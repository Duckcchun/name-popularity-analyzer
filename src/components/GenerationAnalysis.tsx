import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { JapaneseNameData } from '../lib/japaneseNameDatabase';
import { getGenerationAnalysis } from '../lib/commentGenerator';
import { Crown, TrendingUp, TrendingDown, Minus, RotateCcw } from 'lucide-react';

interface GenerationAnalysisProps {
  nameData: JapaneseNameData;
}

export function GenerationAnalysis({ nameData }: GenerationAnalysisProps) {
  const analysis = getGenerationAnalysis(nameData);
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'retro': return <RotateCcw className="h-4 w-4 text-purple-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'rising': return '상승중';
      case 'declining': return '하락세';
      case 'retro': return '레트로';
      case 'stable': return '안정';
      default: return '불명';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'declining': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'retro': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'stable': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 주요 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {analysis.stats.peakRank}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">최고 순위</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {analysis.stats.peakYears.length > 0 ? analysis.stats.peakYears[0] : '-'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">전성기</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {analysis.stats.totalAppearances}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">순위 진입 연수</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <Badge className={getTrendColor(analysis.stats.trend)}>
              {getTrendIcon(analysis.stats.trend)}
              {getTrendLabel(analysis.stats.trend)}
            </Badge>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">현재 경향</div>
        </div>
      </div>

      {/* 시대별 분석 */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          시대별 인기도
        </h3>
        
        <div className="space-y-3">
          {analysis.eraBreakdown.map((item, index) => (
            <div key={item.era.nameEn} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.era.name} 시대</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({item.era.start}~{item.era.end}년)
                  </span>
                  {index === 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      가장 인기
                    </Badge>
                  )}
                </div>
                <span className="font-medium">{item.percentage}%</span>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
          분석 상세
        </h4>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          {analysis.dominantEra && (
            <p>
              • 가장 인기가 높았던 시대는 {analysis.dominantEra.name} 시대입니다
            </p>
          )}
          {analysis.stats.peakYears.length > 0 && (
            <p>
              • {Math.min(...analysis.stats.peakYears)}년~{Math.max(...analysis.stats.peakYears)}년이 전성기였습니다
            </p>
          )}
          <p>
            • 데이터 출처: {nameData.source}
          </p>
        </div>
      </div>
    </div>
  );
}