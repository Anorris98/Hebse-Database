# Description: This script is used to upload data from H5 files to a PostgreSQL database. Uses recursion to look for h5 files. If corrupt, will not upload them.
# This will do all directories in the POSYDON_data directory and down. Only should use when you want to upload "all" of the data.

import h5py
import pandas as pd
from sqlalchemy import create_engine
from glob import glob
import os
import logging
import numpy as np
import binascii

# Set up logging
logging.basicConfig(filename='h5_import_errors.log', level=logging.ERROR, format='%(asctime)s %(message)s')

# Directory containing H5 files
base_directory = r'C:\Users\Alek\OneDrive\Desktop\College\Iowa State\2024\Fall 2024\CYBE 491 - Sr. Design and Professionalism I\POSYDON\POSYDON DATA\POSYDON_data'

# PostgreSQL credentials
username = 'postgres'
password = 'root'
host = 'localhost'
port = '5432'
database = 'hades'

# Connect to PostgreSQL
engine = create_engine(f'postgresql+psycopg2://{username}:{password}@{host}:{port}/{database}')

# Find all H5 files in the directory and subdirectories
h5_files = glob(os.path.join(base_directory, '**', '*.h5'), recursive=True)


# Function to convert hexadecimal data to readable text
def convert_hex_to_readable(data):
    if isinstance(data, bytes):
        try:
            return data.decode('utf-8', errors='ignore')
        except UnicodeDecodeError:
            return binascii.hexlify(data).decode('utf-8')
    elif isinstance(data, (list, pd.Series, np.ndarray)):
        # Recursively convert lists, Pandas Series, or NumPy arrays
        return [convert_hex_to_readable(item) for item in data]
    elif isinstance(data, np.void):
        # Convert numpy.void to a tuple of its elements
        return tuple(data.tolist())
    return data


# Recursive function to visit all groups and datasets in an HDF5 file
def visit_all_items(name, obj, dataset_list):
    if isinstance(obj, h5py.Dataset):
        dataset_list.append((name, obj))
    elif isinstance(obj, h5py.Group):
        for key, item in obj.items():
            visit_all_items(f"{name}/{key}", item, dataset_list)


# Function to fill missing values by averaging surrounding points
def fill_missing_values(data):
    if data.isna().any().any():
        data.interpolate(method='linear', axis=0, inplace=True, limit_direction='both')
    return data


# Process each H5 file
for file_path in h5_files:
    # Extract the file name to use as the table name (without extension)
    table_name = os.path.splitext(os.path.basename(file_path))[0]

    try:
        # Attempt to open the HDF5 file
        with h5py.File(file_path, 'r') as hdf_file:
            # List to collect all datasets in the file
            dataset_list = []
            hdf_file.visititems(lambda name, obj: visit_all_items(name, obj, dataset_list))

            # Loop through each dataset collected
            for dataset_name, dataset in dataset_list:
                try:
                    # Load dataset into a pandas DataFrame
                    raw_data = dataset[()]

                    # Handle compound datasets (structured arrays)
                    if isinstance(raw_data, np.ndarray) and raw_data.dtype.names is not None:
                        # Create DataFrame from structured array
                        data = pd.DataFrame.from_records(raw_data)
                    else:
                        # Convert data if it's hex encoded or contains complex types
                        data_converted = convert_hex_to_readable(raw_data)

                        # Ensure data is in a 2D format for DataFrame
                        if isinstance(data_converted, np.ndarray):
                            if data_converted.ndim == 1:
                                # Each dataset row is treated as a separate run, use dataset attributes for columns if available
                                data = pd.DataFrame(data_converted.reshape(1, -1))
                            elif data_converted.ndim == 2:
                                data = pd.DataFrame(data_converted)
                            else:
                                data = pd.DataFrame(data_converted.flatten().reshape(-1, 1))
                        else:
                            data = pd.DataFrame([data_converted])

                    # Assign default column names based on dataset attributes or generate generic ones
                    if dataset.dtype.names is not None:
                        columns = [name.decode('utf-8') if isinstance(name, bytes) else name for name in
                                   dataset.dtype.names]
                    elif data.shape[1] > 1:
                        columns = [f"Column_{i + 1}" for i in range(data.shape[1])]
                    else:
                        columns = [dataset_name.split('/')[-1]]

                    data.columns = columns

                    # Fill missing values by averaging surrounding points
                    data = fill_missing_values(data)

                    # Insert data into SQL table
                    try:
                        sanitized_table_name = f"{table_name}_{dataset_name.replace('/', '_')}"
                        data.to_sql(sanitized_table_name, engine, if_exists='replace', index=False)
                        print(
                            f"Data successfully inserted into table '{sanitized_table_name}' in database '{database}'.")
                    except Exception as e:
                        print(f"Failed to insert data into table '{sanitized_table_name}' due to: {e}")
                        logging.error(
                            f"Failed to insert data into table '{sanitized_table_name}' in file '{file_path}': {e}")

                except Exception as e:
                    logging.error(f"Error processing dataset '{dataset_name}' in file '{file_path}': {e}")
                    print(f"Error processing dataset '{dataset_name}' in file '{file_path}': {e}")

    except OSError as e:
        # Log the corrupted file and skip it
        logging.error(f"Error opening file '{file_path}': {e}")
        print(f"Skipping corrupted file: {file_path}")
