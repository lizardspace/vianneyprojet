import React from "react";
import { Box } from "@chakra-ui/react";
import DocumentationsComponent from "../default/DocumentionsComponent/DocumentationsComponent";
import { useEvent } from '../../../EventContext'; // Import the useEvent hook
import DocumentTabs from "../alertejesuisendanger/components/DocumentTabs";


const AddDocumentComponent = () => {
    const { selectedEventId } = useEvent();
    return (
        <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
                  <DocumentTabs />
            {selectedEventId && (
                <DocumentationsComponent eventId={selectedEventId} />
            )}
        </Box>
    );
};

export default AddDocumentComponent;
