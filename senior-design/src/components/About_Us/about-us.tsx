import Box from "@mui/material/Box";

export const AboutUs = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
            }}
        >
            <Box
                sx={{
                    paddingTop: "120px",
                    paddingBottom: "16px",
                    width: "1150px",
                }}
            >
                <Box
                    sx={{
                        paddingTop: "120px",
                        backgroundColor: "gray",
                        borderRadius: "15px",
                        width: "1150px",
                        fontFamily: "monospace",
                        padding: "20px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        justifyContent: "flex-start",
                    }}
                >
                    <Box sx={{ fontSize: '25px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '20px', textAlign: 'center' }}>
                        About Us
                    </Box>
                    <Box sx={{ fontSize: '16px' }}>
                        The creators of HADES are interdisciplinary team of Computer, Software, and Cyber Security Engineers from Iowa State University. This project was produced as part of our Senior Design class. The team is made up of James Byrd, Eamon Collins, Alek Norris, Alex Polston, Andrew Snyder, and Svyatoslav Varnitskyy. We are all passionate about developing new and innovative solutions to complex problems. We all have an interest in space and astronomy, and are pleased to develop HADES as a way to help astronomy advance. More details about our project can be found at <a href="https://sdmay25-20.sd.ece.iastate.edu/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>https://sdmay25-20.sd.ece.iastate.edu/</a>.
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};