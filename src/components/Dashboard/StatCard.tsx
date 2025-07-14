import React from 'react';


interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  increase?: number;
  period?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  increase,
  period = 'vs mes anterior'
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          {increase !== undefined && (
            <div className="mt-2 flex items-center text-sm">
              <span className={increase >= 0 ? 'text-green-500' : 'text-red-500'}>
                {increase >= 0 ? '+' : ''}{increase}%
              </span>
              <span className="text-gray-400 ml-1">{period}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')} text-${color.replace('border-', '').replace('-500', '-500')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;