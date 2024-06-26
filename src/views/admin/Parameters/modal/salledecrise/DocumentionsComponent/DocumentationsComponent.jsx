import React, { useState } from "react";
import { Box } from "@chakra-ui/react";

import PdfDownloadButton from "./PdfDownloadButton";
import PdfList from "./PdfList";

const DocumentationsComponent = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);

  const handlePdfClick = (pdf) => {
    setSelectedPdf(pdf);
  };

  return (
    <Box >
      {!selectedPdf ? (
        <PdfDownloadButton handlePdfClick={handlePdfClick} />
      ) : (
        <PdfList selectedPdf={selectedPdf} setSelectedPdf={setSelectedPdf} />
      )}
    </Box>
  );
};

export default DocumentationsComponent;