'use client'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface DonutChartProps {
  data: { name: string; value: number }[]
  totalLabel?: string
  total: number
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

export default function DonutChart({ data, totalLabel = 'Total' }: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0)

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            labelLine={false}
            
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <div className="text-lg font-bold">{total}</div>
        <div className="text-sm text-gray-500">{totalLabel}</div>
      </div>
    </div>
  )
}
