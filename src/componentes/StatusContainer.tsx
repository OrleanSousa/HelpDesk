import React from 'react';

type StatItem = {
  title: string;
  count: number;
};

type StatsProps = {
  stats: {
    aberto: StatItem;
    em_atendimento: StatItem;
    encerrado: StatItem;
    total: StatItem;
  };
};

function getBorderColorByStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'aberto':
      return 'border-blue-500';
    case 'em_atendimento':
      return 'border-yellow-500';
    case 'encerrado':
      return 'border-red-500';
    case 'total':
      return 'border-green-500';
    default:
      return 'border-gray-500';
  }
}

const StatusContainer: React.FC<StatsProps> = ({ stats }) => {
  const types = ['aberto', 'em_atendimento', 'encerrado', 'total'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {types.map((type) => {
        const stat = stats[type as keyof StatsProps['stats']];
        if (!stat) return null;

        const borderColor = getBorderColorByStatus(type);

        return (
          <div key={type} className={`bg-gray-700 text-white rounded-lg p-4 border-l-4 ${borderColor}`}>
            <h5 className="text-xl font-semibold text-center mb-2">{stat.title}</h5>
            <p className="text-3xl font-bold text-center">{stat.count}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatusContainer;