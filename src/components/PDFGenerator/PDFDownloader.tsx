import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@heroui/react';
import { FaDownload } from 'react-icons/fa';

interface PDFDownloaderProps {
  document: React.ReactElement;
  fileName: string;
}

const PDFDownloader: React.FC<PDFDownloaderProps> = ({ document, fileName }) => {
  return (
    <PDFDownloadLink 
      document={document} 
      fileName={`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <Button 
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          <FaDownload />
          {loading ? 'Generando PDF...' : 'Descargar Reporte'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloader;