import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { JapaneseNameData, ERA_PERIODS } from '../lib/japaneseNameDatabase';

interface NameTrendChartProps {
  nameData: JapaneseNameData;
}

export function NameTrendChart({ nameData }: NameTrendChartProps) {
  // 데이터 준비
  const chartData = Object.entries(nameData.yearlyRanks)
    .map(([year, rank]) => ({
      year: parseInt(year),
      rank: rank,
      score: 11 - rank, // 순위를 점수로 변환 (1위 = 10점)
      era: getEraForYear(parseInt(year))
    }))
    .sort((a, b) => a.year - b.year);

  function getEraForYear(year: number): string {
    if (year >= ERA_PERIODS.REIWA.start) return ERA_PERIODS.REIWA.name;
    if (year >= ERA_PERIODS.HEISEI.start) return ERA_PERIODS.HEISEI.name;
    if (year >= ERA_PERIODS.SHOWA.start) return ERA_PERIODS.SHOWA.name;
    return '전전';
  }

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}년</p>
          <p className="text-blue-600 dark:text-blue-400">
            순위: {data.rank}위
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {data.era} 시대
          </p>
        </div>
      );
    }
    return null;
  };

  const minYear = Math.min(...chartData.map(d => d.year));
  const maxYear = Math.max(...chartData.map(d => d.year));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          
          {/* 시대 구분선 */}
          {ERA_PERIODS.HEISEI.start >= minYear && ERA_PERIODS.HEISEI.start <= maxYear && (
            <ReferenceLine 
              x={ERA_PERIODS.HEISEI.start} 
              stroke="#8b5cf6" 
              strokeDasharray="2 2" 
              opacity={0.5}
            />
          )}
          {ERA_PERIODS.REIWA.start >= minYear && ERA_PERIODS.REIWA.start <= maxYear && (
            <ReferenceLine 
              x={ERA_PERIODS.REIWA.start} 
              stroke="#10b981" 
              strokeDasharray="2 2" 
              opacity={0.5}
            />
          )}
          
          <XAxis 
            dataKey="year" 
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[1, 10]}
            reversed
            tick={{ fontSize: 12 }}
            label={{ 
              value: '순위', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Line 
            type="monotone" 
            dataKey="rank" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* 시대 구분 범례 */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-gray-400"></div>
          <span className="text-gray-600 dark:text-gray-400">쇼와 시대</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-purple-400"></div>
          <span className="text-gray-600 dark:text-gray-400">헤이세이 시대 (1989~)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-400"></div>
          <span className="text-gray-600 dark:text-gray-400">레이와 시대 (2019~)</span>
        </div>
      </div>
    </div>
  );
}