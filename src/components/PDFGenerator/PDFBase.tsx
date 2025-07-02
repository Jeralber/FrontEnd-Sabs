import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #333',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'right',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24,
  },
  tableRowHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
    borderRightStyle: 'solid',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
});

interface PDFBaseProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const PDFBase: React.FC<PDFBaseProps> = ({ title, subtitle, children }) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.date}>Fecha: {currentDate}</Text>
        </View>
        
        {children}
        
        <View style={styles.footer}>
          <Text>Sistema de Gestión - Reporte generado automáticamente</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFBase;
export { styles };