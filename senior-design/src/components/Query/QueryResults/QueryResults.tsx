import { Box } from "@mui/material";

export const QueryResults = ({ queryResult }: { queryResult: any }) => {
    const renderResults = () => {
        if (!queryResult) {
            return "No results available.";
        }

        // If it's a string, render it directly
        if (typeof queryResult === 'string') {
            return queryResult;
        }

        // If it's an array, render it as a table
        if (Array.isArray(queryResult)) {
            if (queryResult.length === 0) {
                return "No data returned.";
            }

            // Ensure the first item is an object
            if (typeof queryResult[0] !== 'object' || queryResult[0] === null) {
                return "Unexpected data format.";
            }

            return (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            {Object.keys(queryResult[0]).map((key) => (
                                <th
                                    key={key}
                                    style={{
                                        border: '1px solid white',
                                        padding: '8px',
                                        textAlign: 'left',
                                        backgroundColor: 'darkgray',
                                        color: 'white',
                                    }}
                                >
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {queryResult.map((row: any, index: number) => (
                            <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                    <td
                                        key={i}
                                        style={{
                                            border: '1px solid white',
                                            padding: '8px',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {value !== null && value !== undefined ? value.toString() : "N/A"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        // If it's an object, render key-value pairs
        if (typeof queryResult === "object") {
            return (
                <ul>
                    {Object.entries(queryResult).map(([key, value], index) => (
                        <li key={index}>
                            <strong>{key}:</strong> {value !== null && value !== undefined ? value.toString() : "N/A"}
                        </li>
                    ))}
                </ul>
            );
        }

        // Fallback for unknown data types
        return "Unsupported data type received.";
    };

    return (
        <Box
            component="div"
            sx={{
                backgroundColor: 'gray',
                flexGrow: 1,
                borderRadius: '15px',
                maxWidth: 'lg',
                fontFamily: 'monospace',
                marginTop: '20px',
                padding: '20px',
                color: 'white',
                textAlign: "center",
            }}
        >
            <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>Query Results</Box>
            <Box sx={{ fontSize: '16px', marginTop: '10px' }}>
                {renderResults()}
            </Box>
        </Box>
    );
};
