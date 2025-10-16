import { JapaneseNameData, ERA_PERIODS, getEraForYear } from './japaneseNameDatabase';

interface NameStats {
  totalAppearances: number;
  peakYears: number[];
  peakRank: number;
  recentScore: number; // 최근10년의 평균 스코어
  dominantEra: keyof typeof ERA_PERIODS | null;
  eraShares: Record<string, number>;
  isRetro: boolean;
  trend: 'rising' | 'stable' | 'declining' | 'retro';
}

function calculateNameStats(nameData: JapaneseNameData): NameStats {
  const ranks = nameData.yearlyRanks;
  const years = Object.keys(ranks).map(Number).sort();
  
  // 기본 통계
  const totalAppearances = years.length;
  const allRanks = Object.values(ranks);
  const peakRank = Math.min(...allRanks);
  const peakYears = years.filter(year => ranks[year] === peakRank);
  
  // 최근 10년 스코어 계산
  const recentYears = years.filter(year => year >= 2015);
  const recentScore = recentYears.length > 0 
    ? recentYears.reduce((sum, year) => sum + (11 - ranks[year]), 0) / recentYears.length
    : 0;
  
  // 전체 기간 스코어
  const totalScore = years.reduce((sum, year) => sum + (11 - ranks[year]), 0);
  
  // 레트로 판정
  const isRetro = recentScore / (totalScore / years.length) < 0.3;
  
  // 시대별 점유율 계산
  const eraShares: Record<string, number> = {};
  let dominantEra: keyof typeof ERA_PERIODS | null = null;
  let maxShare = 0;
  
  Object.keys(ERA_PERIODS).forEach(era => {
    const period = ERA_PERIODS[era as keyof typeof ERA_PERIODS];
    const eraYears = years.filter(year => year >= period.start && year <= period.end);
    const eraScore = eraYears.reduce((sum, year) => sum + (11 - ranks[year]), 0);
    const share = totalScore > 0 ? eraScore / totalScore : 0;
    
    eraShares[era] = share;
    if (share > maxShare) {
      maxShare = share;
      dominantEra = era as keyof typeof ERA_PERIODS;
    }
  });
  
  // 트렌드 판정
  let trend: 'rising' | 'stable' | 'declining' | 'retro' = 'stable';
  if (isRetro) {
    trend = 'retro';
  } else if (recentYears.length >= 3) {
    const recentRanks = recentYears.map(year => ranks[year]);
    const early = recentRanks.slice(0, Math.floor(recentRanks.length / 2));
    const late = recentRanks.slice(Math.floor(recentRanks.length / 2));
    
    const earlyAvg = early.reduce((a, b) => a + b, 0) / early.length;
    const lateAvg = late.reduce((a, b) => a + b, 0) / late.length;
    
    if (lateAvg < earlyAvg - 1) trend = 'rising';
    else if (lateAvg > earlyAvg + 1) trend = 'declining';
  }
  
  return {
    totalAppearances,
    peakYears,
    peakRank,
    recentScore,
    dominantEra,
    eraShares,
    isRetro,
    trend
  };
}

export function generateComment(nameData: JapaneseNameData): string {
  const stats = calculateNameStats(nameData);
  const { kanji, reading, gender } = nameData;
  const genderLabel = gender === 'M' ? '남자아이' : '여자아이';
  
  // 메인 코멘트
  let mainComment = '';
  
  if (stats.dominantEra) {
    const era = ERA_PERIODS[stats.dominantEra];
    mainComment = `${kanji}(${reading})는 일본 ${era.name} 시대를 대표하는 ${genderLabel} 이름입니다.`;
  } else {
    mainComment = `${kanji}(${reading})는 일본에서 꾸준히 사랑받는 ${genderLabel} 이름입니다.`;
  }
  
  // 전성기 설명
  if (stats.peakYears.length > 0) {
    const peakStart = Math.min(...stats.peakYears);
    const peakEnd = Math.max(...stats.peakYears);
    
    if (peakStart === peakEnd) {
      mainComment += ` ${peakStart}년에 ${stats.peakRank}위의 인기를 기록했습니다.`;
    } else {
      mainComment += ` ${peakStart}년부터 ${peakEnd}년까지 ${stats.peakRank}위의 높은 인기를 누렸습니다.`;
    }
  }
  
  // 현재 트렌드
  let trendComment = '';
  switch (stats.trend) {
    case 'retro':
      trendComment = '지금은 사용 빈도가 줄어 레트로한 느낌을 주는 이름이 되었습니다.';
      break;
    case 'rising':
      trendComment = '최근 들어 다시 인기가 높아지고 있는 이름입니다.';
      break;
    case 'declining':
      trendComment = '예전만큼의 인기는 아니지만 여전히 사랑받는 이름입니다.';
      break;
    case 'stable':
      trendComment = '꾸준한 인기를 유지하고 있는 안정적인 이름입니다.';
      break;
  }
  
  return `${mainComment} ${trendComment}`;
}

export function getGenerationAnalysis(nameData: JapaneseNameData) {
  const stats = calculateNameStats(nameData);
  
  return {
    stats,
    dominantEra: stats.dominantEra ? ERA_PERIODS[stats.dominantEra] : null,
    eraBreakdown: Object.entries(stats.eraShares).map(([era, share]) => ({
      era: ERA_PERIODS[era as keyof typeof ERA_PERIODS],
      share,
      percentage: Math.round(share * 100)
    })).sort((a, b) => b.share - a.share)
  };
}