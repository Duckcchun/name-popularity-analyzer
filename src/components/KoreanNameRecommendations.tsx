import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Star, TrendingUp, Calendar, Sparkles } from 'lucide-react';

// Updated interfaces to match the new data structure from Supabase
interface KoreanNameData {
  name: string;
  gender: 'M' | 'F';
  yearlyRanks?: Record<number, number>;
  source: string;
  characteristics?: string[];
  peakYear?: number;
  era?: string;
  matchScore?: number;
  matchReason?: string;
  compatibility?: string;
}

interface JapaneseNameData {
  kanji: string;
  reading: string;
  gender: 'M' | 'F';
  yearlyRanks?: Record<number, number>;
  source: string;
  characteristics?: string[];
}

interface KoreanNameRecommendationsProps {
  recommendations: KoreanNameData[];
  japaneseNameData: JapaneseNameData;
}

export function KoreanNameRecommendations({ 
  recommendations, 
  japaneseNameData 
}: KoreanNameRecommendationsProps) {
  
  const getMatchQuality = (matchScore: number) => {
    if (matchScore >= 40) return { label: '매우 높음', color: 'bg-green-500', score: 100 };
    if (matchScore >= 30) return { label: '높음', color: 'bg-blue-500', score: 90 };
    if (matchScore >= 20) return { label: '보통', color: 'bg-yellow-500', score: 75 };
    if (matchScore >= 10) return { label: '낮음', color: 'bg-orange-500', score: 60 };
    return { label: '매우 낮음', color: 'bg-gray-500', score: 40 };
  };

  const getPeakYear = (nameData: { yearlyRanks?: Record<number, number>; peakYear?: number }): number => {
    if (nameData.peakYear) return nameData.peakYear;
    
    if (!nameData.yearlyRanks || Object.keys(nameData.yearlyRanks).length === 0) {
      return 0;
    }
    
    const bestRank = Math.min(...Object.values(nameData.yearlyRanks));
    const peakYears = Object.entries(nameData.yearlyRanks)
      .filter(([, rank]) => rank === bestRank)
      .map(([year]) => parseInt(year));
    
    return peakYears.length > 0 ? Math.round(peakYears.reduce((a, b) => a + b) / peakYears.length) : 0;
  };

  return (
    <div className="space-y-6">
      {/* 추천 개요 */}
      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <Sparkles className="h-8 w-8 mx-auto text-purple-500 mb-3" />
        <h3 className="text-lg font-semibold mb-2">
          {japaneseNameData.kanji}와 비슷한 감성의 한국 이름
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          일본에서의 인기 시기와 트렌드를 분석해서 추천해드렸습니다
        </p>
      </div>

      {/* 추천 이름 목록 */}
      <div className="grid gap-4">
        {recommendations.map((recommendation, index) => {
          const matchScore = recommendation.matchScore || 0;
          const matchQuality = getMatchQuality(matchScore);
          const koreanPeakYear = getPeakYear(recommendation);
          const japanesePeakYear = getPeakYear(japaneseNameData);

          return (
            <Card key={index} className={`${index === 0 ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {recommendation.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${matchQuality.color}`}></div>
                    <span className="text-sm font-medium">{recommendation.compatibility || matchQuality.label}</span>
                  </div>
                </div>
                <CardDescription>
                  <span className="text-gray-600 dark:text-gray-400">
                    {recommendation.gender === 'M' ? '남성' : '여성'}명 • {recommendation.source ? `출처: ${recommendation.source}` : '통계청 자료'}
                  </span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 매치 이유 */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">매치 이유</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {recommendation.matchReason || '시대적 특성과 트렌드가 유사한 이름입니다.'}
                  </p>
                </div>

                {/* 매치 품질 표시 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">매치 점수:</span>
                  <Badge variant="outline" className="text-xs">
                    {matchScore}점 ({matchQuality.label})
                  </Badge>
                </div>

                {/* 특성 태그 */}
                {recommendation.characteristics && recommendation.characteristics.length > 0 && (
                  <div>
                    <span className="text-sm font-medium block mb-2">특성</span>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.characteristics.map((char, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 인기 시기 비교 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="font-medium text-red-700 dark:text-red-300">일본</div>
                    <div className="text-red-600 dark:text-red-400">
                      {japanesePeakYear > 0 ? `${japanesePeakYear}년 전성기` : '데이터 부족'}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="font-medium text-blue-700 dark:text-blue-300">한국</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      {koreanPeakYear > 0 ? `${koreanPeakYear}년 전성기` : '데이터 부족'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 추가 정보 */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-amber-600" />
          <span className="font-medium text-amber-800 dark:text-amber-200">
            추천 기준
          </span>
        </div>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          일본과 한국에서 비슷한 시기에 인기를 얻은 이름들을 우선적으로 추천합니다. 
          전성기 시기, 인기 지속 기간, 세대적 특성을 종합적으로 고려했습니다.
        </p>
      </div>
    </div>
  );
}