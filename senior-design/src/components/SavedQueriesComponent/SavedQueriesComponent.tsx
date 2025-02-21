import Box from "@mui/material/Box";
import {IconButton} from "@mui/material";
import {ArrowDropDown, Clear, ContentCopyOutlined} from "@mui/icons-material";
import {useState} from "react";

export const SavedQueriesComponent = ({savedQueries, setSavedQueries, setInputValue}: {
    savedQueries: string[],
    setSavedQueries: (value: ((prevState: string[]) => string[]) | string[]) => void,
    setInputValue: (value: (((prevState: string) => string) | string)) => void
}) => {

    const [displaySavedQueries, setDisplaySavedQueries] = useState<boolean>(false);

    function deleteQuery(query: string) {
        const updatedQueries = savedQueries.filter((item: string) => item !== query);
        localStorage.saved = JSON.stringify([...updatedQueries])
        if (updatedQueries.length == 0) {
            setDisplaySavedQueries(false);
        }
        setSavedQueries(updatedQueries);
    }


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
            <Box sx={{fontSize: '20px', fontWeight: 'bold', backgroundColor: 'gray',}}>
                Saved Queries <IconButton sx={{maxHeight: "10px", width: "30px"}}
                                          onClick={() => setDisplaySavedQueries(!displaySavedQueries)}><ArrowDropDown
                sx={{color: 'white', backgroundColor: "black"}}/></IconButton>
            </Box>
            {displaySavedQueries ?
                savedQueries.map((item: string, index: number) => (
                    <Box sx={{
                        borderRadius: "8px",
                        border: "1px solid transparent",
                        textAlign: 'center',
                        maxWidth: "calc(100% - 24px)",
                        padding: '4px',
                        margin: '8px',
                        backgroundColor: 'darkgray',
                        textTransform: 'none',
                        fontFamily: 'monospace',
                        fontSize: "16px",
                        color: 'white',
                        display: "inline-flex",
                        alignItems: "center",
                        flexDirection: 'row-reverse'
                    }} key={index}>
                        <IconButton sx={{height: "10px", width: "30px", textAlign: "center"}}
                                    onClick={() => deleteQuery(item)}><Clear
                            sx={{color: 'white', backgroundColor: "black"}}/></IconButton>
                        <IconButton sx={{height: "10px", width: "30px", textAlign: "center"}}
                                    onClick={() => setInputValue(item)}><ContentCopyOutlined
                            sx={{color: 'white', backgroundColor: "black"}}/></IconButton>
                        <Box flexGrow={1} component="div" sx={{
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word',
                            textAlign: 'center',
                            width: "calc(100% - 60px)"
                        }}>{item}</Box>
                    </Box>
                )) : null}
        </Box>
    )
}