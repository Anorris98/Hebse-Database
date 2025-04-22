import { useState } from "react";
import { Box, Collapse, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Define the interface for each section
interface Section {
  title: string;
  description: string;
}

// Define the interface for the component props
interface UserManualWelcomeTextProperties {
  title: string;
  message: string;
  sections: Section[];
}

// Use the interface to type the component props
export const UserManualText = ({ title, message, sections }: UserManualWelcomeTextProperties) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: "gray",
        borderRadius: "15px",
        maxWidth: "1000px",
        width: "1000px",
        fontFamily: "monospace",
        padding: "10px",
        textAlign: "center",
        color: "white",
      }}
    >
      <Box sx={{ fontSize: "20px", fontWeight: "bold" }}>{title}</Box>
      <Box sx={{ fontSize: "16px", textAlign: "left" }}>
        {message.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </Box>
      <Collapse in={expanded}>
        {sections.map((section, index) => (
          <Box key={index} sx={{ marginTop: "20px" }}>
            <Box sx={{ fontSize: "18px", fontWeight: "bold" }}>{section.title}</Box>
            <Box sx={{ marginTop: "5px", textAlign: "left" }}>
              {section.description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </Box>
          </Box>
        ))}
      </Collapse>
      <Button
        onClick={() => setExpanded(!expanded)}
        endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{
          marginTop: "10px",
          backgroundColor: "darkgray",
          fontFamily: "monospace",
          color: "white",
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        {expanded ? "Hide Details" : "Show More"}
      </Button>
    </Box>
  );
};