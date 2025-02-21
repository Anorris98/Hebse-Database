import Box from "@mui/material/Box";

export const QueryWelcomeText = () => {
  return (
      <Box
          sx={{
              backgroundColor: "gray",
              borderRadius: "15px",
              maxWidth: "lg",
              width: "100%",
              fontFamily: "monospace",
              padding: "20px",
              marginTop:"200px",
              textAlign: "center",
          }}
      >
          <Box sx={{fontSize: '20px', fontWeight: 'bold'}}>
              How can I help?
          </Box>
          <Box sx={{fontSize: '16px'}}>
              Welcome to the Binary Star Query Bot! This interactive assistant is
              designed to help you explore and retrieve data on binary star systems
              with ease. Whether you're an astronomer, student, or space enthusiast,
              you can quickly access detailed information on various binary systems,
              including orbital periods, mass, luminosity, and more. Additionally,
              you can upload your own binary star data, and the bot will parse and
              integrate it for seamless querying. From answering general questions
              about binary stars to providing insights into specific systems, this
              bot is here to enhance your understanding of the fascinating world of
              stellar pairs. Let’s explore the stars together!
          </Box>
      </Box>
  )
}