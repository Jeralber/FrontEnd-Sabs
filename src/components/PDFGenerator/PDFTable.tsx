import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './PDFBase';

interface Column {
  header: string;
  accessor: string;
  width?: string | number;
}

interface PDFTableProps {
  columns: Column[];
  data: any[];
}

const PDFTable: React.FC<PDFTableProps> = ({ columns, data }) => {
  return (
    <View style={styles.table}>
      {/* Encabezado de la tabla */}
      <View style={[styles.tableRow, styles.tableRowHeader]}>
        {columns.map((column, index) => (
          <View 
            key={`header-${index}`} 
            style={[
              styles.tableCell, 
              { width: column.width || `${100 / columns.length}%` }
            ]}
          >
            <Text>{column.header}</Text>
          </View>
        ))}
      </View>

      {/* Filas de datos */}
      {data.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.tableRow}>
          {columns.map((column, colIndex) => (
            <View 
              key={`cell-${rowIndex}-${colIndex}`} 
              style={[
                styles.tableCell, 
                { width: column.width || `${100 / columns.length}%` }
              ]}
            >
              <Text>{row[column.accessor] !== undefined ? String(row[column.accessor]) : ''}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default PDFTable;