import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaFilePdf } from 'react-icons/fa';

interface PDFDownloadButtonProps {
  document: React.ReactElement;
  fileName: string;
  className?: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ 
  document, 
  fileName, 
  className 
}) => {
  return (
    <PDFDownloadLink 
      document={document} 
      fileName={fileName}
      className={className || "inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"}
    >
      {({ blob, url, loading, error }) => 
        loading ? 
          'Generando documento...' : 
          <>
            <FaFilePdf className="mr-2" />
            Descargar PDF
          </>
      }
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;