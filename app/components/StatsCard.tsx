interface StatsCardProps {
  label: string
  value: string | number
  change: string
  changeType: 'positive' | 'neutral' | 'warning' | 'negative'
}

export default function StatsCard({
  label,
  value,
  change,
  changeType,
}: StatsCardProps) {
  const changeColorMap = {
    positive: 'text-green-600',
    neutral: 'text-gray-600',
    warning: 'text-orange-600',
    negative: 'text-red-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-3">{value}</div>
      <div className={`text-sm ${changeColorMap[changeType]}`}>{change}</div>
    </div>
  )
}
