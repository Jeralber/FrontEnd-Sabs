import { Button } from "@heroui/react";
import { useState, useMemo } from "react";
import { Edit, Trash, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";

type Column<T> = {
  accessorKey: keyof T;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  isDate?: boolean;
};

interface DataTableProps<T> {
  data: T[] | { data: T[], message?: string };
  title?: string;
  columns: Column<T>[];
  onEdit: (row: T) => void;
  onCreate?: () => void;
  onDelete?: (id: number) => void;
  getRowId: (row: T) => number ;
}

export function DataTable<T extends { [key: string]: any }>({
  data,
  title,
  columns,
  onEdit,
  onCreate,
  onDelete,
  getRowId,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.map(col => col.accessorKey))
  );
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Normalize data to ensure it's always an array
  const normalizedData = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.error('Error: data no es un array ni contiene una propiedad data que sea array', data);
      return [];
    }
  }, [data]);

  // Función para manejar el ordenamiento
  const handleSort = (key: keyof T, isDate?: boolean) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Función para alternar la visibilidad de una columna
  const toggleColumnVisibility = (key: keyof T) => {
    setVisibleColumns(prevVisible => {
      const newVisible = new Set(prevVisible);
      if (newVisible.has(key)) {
        newVisible.delete(key);
      } else {
        newVisible.add(key);
      }
      return newVisible;
    });
  };

  // Datos filtrados y ordenados
  const sortedAndFilteredData = useMemo(() => {
    // Primero filtramos los datos
    let filteredData = normalizedData.filter((row) => {
      return columns.some((col) => {
        const value = String(row[col.accessorKey] || '');
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    // Luego ordenamos si hay una configuración de ordenamiento
    if (sortConfig.key) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];
        
        // Manejar ordenamiento de fechas
        const column = columns.find(col => col.accessorKey === sortConfig.key);
        if (column?.isDate) {
          const dateA = aValue ? new Date(aValue).getTime() : 0;
          const dateB = bValue ? new Date(bValue).getTime() : 0;
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Ordenamiento normal para strings y números
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [normalizedData, columns, searchTerm, sortConfig]);

  // Columnas visibles filtradas
  const visibleColumnsList = columns.filter(col => 
    visibleColumns.has(col.accessorKey)
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

      <div className="flex flex-wrap justify-between mb-4 gap-2">
        {onCreate && (
          <Button
            onClick={onCreate}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Crear
          </Button>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {showColumnSelector ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>

      {showColumnSelector && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50">
          <h3 className="font-medium mb-2">Mostrar/Ocultar Columnas</h3>
          <div className="flex flex-wrap gap-2">
            {columns.map((column) => (
              <label key={String(column.accessorKey)} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={visibleColumns.has(column.accessorKey)}
                  onChange={() => toggleColumnVisibility(column.accessorKey)}
                  className="rounded"
                />
                <span>{column.header}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              {visibleColumnsList.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`px-6 py-3 text-left text-sm font-medium text-gray-600 ${
                    col.sortable !== false ? 'cursor-pointer select-none' : ''
                  }`}
                  onClick={() => col.sortable !== false && handleSort(col.accessorKey, col.isDate)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {col.sortable !== false && sortConfig.key === col.accessorKey && (
                      <span>
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAndFilteredData.length > 0 ? (
              sortedAndFilteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {visibleColumnsList.map((col, i) => (
                    <td key={i} className="px-6 py-4 text-sm text-gray-700">
                      {col.cell ? col.cell(row) : String(row[col.accessorKey] || '')}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm text-gray-700 space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onEdit(row)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <Edit size={18} />
                    </Button>
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="light"
                        onClick={() => onDelete(getRowId(row))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={18} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={visibleColumnsList.length + 1} 
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
