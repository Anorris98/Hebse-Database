import Box from "@mui/material/Box";

export const About_Us = () => {
    return (
        <Box
            sx={{
                backgroundColor: "gray",
                borderRadius: "15px",
                maxWidth: "lg",
                width: "100%",
                fontFamily: "monospace",
                padding: "20px",
                marginTop: "0px", // Ensures there's no margin at the top
                paddingTop: "20px", // Removes padding at the top
                textAlign: "center",
            }}
        >
            <Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                About Us
            </Box>
            <Box sx={{ fontSize: '16px' }}>
            The creators of HADES are interdisciplinary team of Computer, Software, and Cyber Security Engineers from Iowa State University. This project was produced as part of our Senior Design class. The team is made up of James Byrd, Eamon Collins, Alek Norris, Alex Polston, Andrew Snyder, and Svyatoslav Varnitskyy. We are all passionate about developing new and innovative solutions to complex problems. We all have an interest in space and astronomy, and are pleased to develop HADES as a way to help astronomy advance. More details about our project can be found at <a href="https://sdmay25-20.sd.ece.iastate.edu/" target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>https://sdmay25-20.sd.ece.iastate.edu/</a>. 
            </Box>
        </Box>
    );
};