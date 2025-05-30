import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { NutritionalSummary } from '../../contexts/NutritionContext';

interface NutritionSummaryChartProps {
  data: NutritionalSummary;
}

const NutritionSummaryChart: React.FC<NutritionSummaryChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Breakfast', value: data.mealBreakdown.breakfast },
    { name: 'Lunch', value: data.mealBreakdown.lunch },
    { name: 'Dinner', value: data.mealBreakdown.dinner },
    { name: 'Snack', value: data.mealBreakdown.snack },
  ].filter(item => item.value > 0);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'];

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">No meal data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={25}
          outerRadius={45}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} cal`, 'Calories']}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          formatter={(value) => <span className="text-xs">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default NutritionSummaryChart;