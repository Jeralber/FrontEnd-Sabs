import React from 'react';
import { Button } from '@heroui/react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onFilter: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilter,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col">
        <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1">
          Fecha Inicio
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1">
          Fecha Fin
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      
      <div className="flex items-end">
        <Button 
          onClick={onFilter}
          className="bg-green-600 hover:bg-green-700"
        >
          Filtrar
        </Button>
      </div>
    </div>
  );
};

export default DateRangeFilter;