import React from "react";
import { Box } from "@chakra-ui/react";
import PdfDownloadButton from "../default/DocumentionsComponent/PdfDownloadButton";

const AddDocumentComponent = () => {
    return (
        <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
            <PdfDownloadButton />
        </Box>
    );
};

export default AddDocumentComponent;
