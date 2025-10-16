import { JapaneseNameData } from './japaneseNameDatabase';

// 한국 이름 데이터
export interface KoreanNameData {
  hanja?: string;
  hangul: string;
  gender: 'M' | 'F';
  yearlyRanks: Record<number, number>;
  characteristics: string[];
  source?: string;
}

const koreanNames: KoreanNameData[] = [
  // === 남성 이름 ===
  
  // 1950년대-1960년대 남성 이름
  {
    hangul: '영수',
    gender: 'M',
    yearlyRanks: { 1960: 2, 1961: 1, 1962: 1, 1963: 1, 1964: 2, 1965: 3, 1970: 7, 1975: 10 },
    characteristics: ['클래식', '전통적'],
    source: '통계청'
  },
  {
    hangul: '철수',
    gender: 'M',
    yearlyRanks: { 1960: 4, 1961: 3, 1962: 2, 1963: 3, 1964: 4, 1965: 5, 1970: 8 },
    characteristics: ['전통적', '대중적'],
    source: '통계청'
  },
  {
    hangul: '성호',
    gender: 'M',
    yearlyRanks: { 1965: 7, 1966: 5, 1967: 4, 1968: 3, 1969: 4, 1970: 5, 1975: 8 },
    characteristics: ['전통적', '안정적'],
    source: '통계청'
  },
  {
    hangul: '진수',
    gender: 'M',
    yearlyRanks: { 1965: 8, 1966: 6, 1967: 5, 1968: 4, 1969: 5, 1970: 6, 1975: 9 },
    characteristics: ['진취적', '전통적'],
    source: '통계청'
  },
  {
    hangul: '정호',
    gender: 'M',
    yearlyRanks: { 1968: 6, 1969: 5, 1970: 4, 1971: 4, 1972: 5, 1973: 6, 1974: 7, 1975: 8 },
    characteristics: ['정직함', '클래식'],
    source: '통계청'
  },

  // 1970년대-1980년대 남성 이름
  {
    hangul: '현우',
    gender: 'M',
    yearlyRanks: { 1975: 3, 1976: 2, 1977: 2, 1978: 3, 1979: 4, 1980: 5, 1985: 8 },
    characteristics: ['현대적', '세련됨'],
    source: '통계청'
  },
  {
    hangul: '민수',
    gender: 'M',
    yearlyRanks: { 1975: 5, 1976: 4, 1977: 3, 1978: 2, 1979: 2, 1980: 3, 1985: 6, 1990: 10 },
    characteristics: ['대중적', '친근함'],
    source: '통계청'
  },
  {
    hangul: '승호',
    gender: 'M',
    yearlyRanks: { 1978: 6, 1979: 5, 1980: 4, 1981: 3, 1982: 4, 1983: 5, 1985: 7 },
    characteristics: ['진취적', '활동적'],
    source: '통계청'
  },
  {
    hangul: '태우',
    gender: 'M',
    yearlyRanks: { 1979: 7, 1980: 6, 1981: 5, 1982: 5, 1983: 6, 1984: 7, 1985: 8 },
    characteristics: ['자연적', '강인함'],
    source: '통계청'
  },
  {
    hangul: '동현',
    gender: 'M',
    yearlyRanks: { 1980: 7, 1981: 6, 1982: 6, 1983: 7, 1984: 8, 1985: 9, 1990: 8 },
    characteristics: ['현대적', '도시적'],
    source: '통계청'
  },

  // 1980년대-1990년대 남성 이름
  {
    hangul: '지훈',
    gender: 'M',
    yearlyRanks: { 1985: 2, 1986: 1, 1987: 1, 1988: 2, 1989: 3, 1990: 4, 1995: 8 },
    characteristics: ['세련됨', '현대적'],
    source: '통계청'
  },
  {
    hangul: '준호',
    gender: 'M',
    yearlyRanks: { 1985: 4, 1986: 3, 1987: 3, 1988: 4, 1989: 5, 1990: 6, 1995: 9 },
    characteristics: ['세련됨', '우아함'],
    source: '통계청'
  },
  {
    hangul: '성민',
    gender: 'M',
    yearlyRanks: { 1988: 5, 1989: 4, 1990: 3, 1991: 3, 1992: 4, 1993: 5, 1995: 7 },
    characteristics: ['성실함', '친근함'],
    source: '통계청'
  },
  {
    hangul: '현수',
    gender: 'M',
    yearlyRanks: { 1990: 7, 1991: 6, 1992: 5, 1993: 6, 1994: 7, 1995: 8, 2000: 10 },
    characteristics: ['현대적', '깔끔함'],
    source: '통계청'
  },
  {
    hangul: '민호',
    gender: 'M',
    yearlyRanks: { 1990: 5, 1991: 4, 1992: 3, 1993: 4, 1994: 5, 1995: 6, 2000: 9 },
    characteristics: ['대중적', '안정적'],
    source: '통계청'
  },

  // 1990년대-2000년대 남성 이름
  {
    hangul: '준영',
    gender: 'M',
    yearlyRanks: { 1995: 2, 1996: 1, 1997: 1, 1998: 2, 1999: 3, 2000: 4, 2005: 8 },
    characteristics: ['영리함', '세련됨'],
    source: '통계청'
  },
  {
    hangul: '건우',
    gender: 'M',
    yearlyRanks: { 1995: 3, 1996: 2, 1997: 3, 1998: 4, 1999: 5, 2000: 6, 2005: 9 },
    characteristics: ['건강함', '활력'],
    source: '통계청'
  },
  {
    hangul: '진우',
    gender: 'M',
    yearlyRanks: { 1998: 5, 1999: 4, 2000: 3, 2001: 3, 2002: 4, 2003: 5, 2005: 7 },
    characteristics: ['진취적', '친근함'],
    source: '통계청'
  },
  {
    hangul: '수빈',
    gender: 'M',
    yearlyRanks: { 2000: 7, 2001: 6, 2002: 5, 2003: 6, 2004: 7, 2005: 8, 2010: 10 },
    characteristics: ['부드러움', '현대적'],
    source: '통계청'
  },
  {
    hangul: '도현',
    gender: 'M',
    yearlyRanks: { 2000: 5, 2001: 4, 2002: 3, 2003: 4, 2004: 5, 2005: 6, 2010: 9 },
    characteristics: ['도시적', '현대적'],
    source: '통계청'
  },

  // 2000년대-2010년대 남성 이름
  {
    hangul: '서준',
    gender: 'M',
    yearlyRanks: { 2005: 2, 2006: 1, 2007: 1, 2008: 1, 2009: 2, 2010: 3, 2015: 6 },
    characteristics: ['트렌디', '모던'],
    source: '통계청'
  },
  {
    hangul: '민준',
    gender: 'M',
    yearlyRanks: { 2005: 3, 2006: 2, 2007: 2, 2008: 3, 2009: 4, 2010: 5, 2015: 8 },
    characteristics: ['대중적', '친근함'],
    source: '통계청'
  },
  {
    hangul: '예준',
    gender: 'M',
    yearlyRanks: { 2008: 4, 2009: 3, 2010: 2, 2011: 2, 2012: 3, 2013: 4, 2015: 7 },
    characteristics: ['세련됨', '예의'],
    source: '통계청'
  },
  {
    hangul: '도윤',
    gender: 'M',
    yearlyRanks: { 2010: 6, 2011: 5, 2012: 4, 2013: 3, 2014: 4, 2015: 5, 2020: 8 },
    characteristics: ['부드러움', '조화'],
    source: '통계청'
  },
  {
    hangul: '시우',
    gender: 'M',
    yearlyRanks: { 2010: 8, 2011: 7, 2012: 6, 2013: 5, 2014: 6, 2015: 7, 2020: 9 },
    characteristics: ['자연적', '부드러움'],
    source: '통계청'
  },

  // 2010년대-2020년대 남성 이름
  {
    hangul: '이준',
    gender: 'M',
    yearlyRanks: { 2015: 2, 2016: 1, 2017: 1, 2018: 2, 2019: 3, 2020: 4, 2024: 7 },
    characteristics: ['트렌디', '간결함'],
    source: '통계청'
  },
  {
    hangul: '이안',
    gender: 'M',
    yearlyRanks: { 2015: 4, 2016: 3, 2017: 3, 2018: 4, 2019: 5, 2020: 6, 2024: 8 },
    characteristics: ['국제적', '모던'],
    source: '통계청'
  },
  {
    hangul: '지한',
    gender: 'M',
    yearlyRanks: { 2018: 5, 2019: 4, 2020: 3, 2021: 3, 2022: 4, 2023: 5, 2024: 6 },
    characteristics: ['강인함', '현대적'],
    source: '통계청'
  },
  {
    hangul: '하준',
    gender: 'M',
    yearlyRanks: { 2020: 7, 2021: 6, 2022: 5, 2023: 4, 2024: 3 },
    characteristics: ['자연적', '부드러움'],
    source: '통계청'
  },
  {
    hangul: '지우',
    gender: 'M',
    yearlyRanks: { 2020: 5, 2021: 4, 2022: 3, 2023: 3, 2024: 4 },
    characteristics: ['부드러움', '친근함'],
    source: '통계청'
  },

  // === 여성 이름 ===

  // 1950년대-1960년대 여성 이름
  {
    hangul: '순자',
    gender: 'F',
    yearlyRanks: { 1950: 1, 1951: 1, 1952: 2, 1953: 3, 1954: 4, 1955: 5, 1960: 8 },
    characteristics: ['전통적', '클래식'],
    source: '통계청'
  },
  {
    hangul: '영희',
    gender: 'F',
    yearlyRanks: { 1955: 2, 1956: 1, 1957: 1, 1958: 1, 1959: 2, 1960: 3, 1965: 7 },
    characteristics: ['대중적', '전통적'],
    source: '통계청'
  },
  {
    hangul: '미숙',
    gender: 'F',
    yearlyRanks: { 1960: 4, 1961: 3, 1962: 2, 1963: 2, 1964: 3, 1965: 4, 1970: 8 },
    characteristics: ['전통적', '우아함'],
    source: '통계청'
  },
  {
    hangul: '정숙',
    gender: 'F',
    yearlyRanks: { 1960: 6, 1961: 5, 1962: 4, 1963: 4, 1964: 5, 1965: 6, 1970: 9 },
    characteristics: ['정숙함', '전통적'],
    source: '통계청'
  },
  {
    hangul: '경희',
    gender: 'F',
    yearlyRanks: { 1965: 5, 1966: 4, 1967: 3, 1968: 3, 1969: 4, 1970: 5, 1975: 8 },
    characteristics: ['우아함', '전통적'],
    source: '통계청'
  },

  // 1970년대-1980년대 여성 이름
  {
    hangul: '은영',
    gender: 'F',
    yearlyRanks: { 1975: 2, 1976: 1, 1977: 1, 1978: 2, 1979: 3, 1980: 4, 1985: 7 },
    characteristics: ['우아함', '세련됨'],
    source: '통계청'
  },
  {
    hangul: '미영',
    gender: 'F',
    yearlyRanks: { 1975: 3, 1976: 2, 1977: 2, 1978: 3, 1979: 4, 1980: 5, 1985: 8 },
    characteristics: ['아름다움', '대중적'],
    source: '통계청'
  },
  {
    hangul: '정미',
    gender: 'F',
    yearlyRanks: { 1978: 4, 1979: 3, 1980: 2, 1981: 2, 1982: 3, 1983: 4, 1985: 6 },
    characteristics: ['정갈함', '아름다움'],
    source: '통계청'
  },
  {
    hangul: '수정',
    gender: 'F',
    yearlyRanks: { 1980: 6, 1981: 5, 1982: 4, 1983: 3, 1984: 4, 1985: 5, 1990: 8 },
    characteristics: ['순수함', '맑음'],
    source: '통계청'
  },
  {
    hangul: '혜진',
    gender: 'F',
    yearlyRanks: { 1982: 5, 1983: 4, 1984: 3, 1985: 2, 1986: 3, 1987: 4, 1990: 7 },
    characteristics: ['지혜', '진실함'],
    source: '통계청'
  },

  // 1980년대-1990년대 여성 이름
  {
    hangul: '지현',
    gender: 'F',
    yearlyRanks: { 1985: 3, 1986: 2, 1987: 1, 1988: 1, 1989: 2, 1990: 3, 1995: 6 },
    characteristics: ['지혜', '현명함'],
    source: '통계청'
  },
  {
    hangul: '현정',
    gender: 'F',
    yearlyRanks: { 1985: 4, 1986: 3, 1987: 2, 1988: 3, 1989: 4, 1990: 5, 1995: 8 },
    characteristics: ['현명함', '정숙함'],
    source: '통계청'
  },
  {
    hangul: '민정',
    gender: 'F',
    yearlyRanks: { 1988: 5, 1989: 4, 1990: 4, 1991: 3, 1992: 4, 1993: 5, 1995: 7 },
    characteristics: ['민첩함', '정직함'],
    source: '통계청'
  },
  {
    hangul: '수진',
    gender: 'F',
    yearlyRanks: { 1990: 6, 1991: 5, 1992: 5, 1993: 6, 1994: 7, 1995: 8, 2000: 10 },
    characteristics: ['순수함', '진실함'],
    source: '통계청'
  },
  {
    hangul: '유진',
    gender: 'F',
    yearlyRanks: { 1990: 7, 1991: 6, 1992: 6, 1993: 7, 1994: 8, 1995: 9, 2000: 9 },
    characteristics: ['부드러움', '진실함'],
    source: '통계청'
  },

  // 1990년대-2000년대 여성 이름
  {
    hangul: '예은',
    gender: 'F',
    yearlyRanks: { 1995: 2, 1996: 1, 1997: 1, 1998: 2, 1999: 3, 2000: 4, 2005: 7 },
    characteristics: ['예의', '은혜'],
    source: '통계청'
  },
  {
    hangul: '지은',
    gender: 'F',
    yearlyRanks: { 1995: 3, 1996: 2, 1997: 2, 1998: 3, 1999: 4, 2000: 5, 2005: 8 },
    characteristics: ['지혜', '은혜'],
    source: '통계청'
  },
  {
    hangul: '서현',
    gender: 'F',
    yearlyRanks: { 1998: 4, 1999: 3, 2000: 2, 2001: 2, 2002: 3, 2003: 4, 2005: 6 },
    characteristics: ['서구적', '현명함'],
    source: '통계청'
  },
  {
    hangul: '하영',
    gender: 'F',
    yearlyRanks: { 2000: 6, 2001: 5, 2002: 4, 2003: 3, 2004: 4, 2005: 5, 2010: 8 },
    characteristics: ['자연적', '영리함'],
    source: '통계청'
  },
  {
    hangul: '채원',
    gender: 'F',
    yearlyRanks: { 2000: 8, 2001: 7, 2002: 6, 2003: 5, 2004: 6, 2005: 7, 2010: 9 },
    characteristics: ['자연적', '원만함'],
    source: '통계청'
  },

  // 2000년대-2010년대 여성 이름
  {
    hangul: '서연',
    gender: 'F',
    yearlyRanks: { 2005: 2, 2006: 1, 2007: 1, 2008: 1, 2009: 2, 2010: 3, 2015: 6 },
    characteristics: ['세련됨', '현대적'],
    source: '통계청'
  },
  {
    hangul: '지우',
    gender: 'F',
    yearlyRanks: { 2005: 3, 2006: 2, 2007: 2, 2008: 3, 2009: 4, 2010: 5, 2015: 8 },
    characteristics: ['부드러움', '친근함'],
    source: '통계청'
  },
  {
    hangul: '수아',
    gender: 'F',
    yearlyRanks: { 2008: 4, 2009: 3, 2010: 2, 2011: 2, 2012: 3, 2013: 4, 2015: 7 },
    characteristics: ['순수함', '아름다움'],
    source: '통계청'
  },
  {
    hangul: '시은',
    gender: 'F',
    yearlyRanks: { 2010: 6, 2011: 5, 2012: 4, 2013: 3, 2014: 4, 2015: 5, 2020: 8 },
    characteristics: ['시적', '은혜'],
    source: '통계청'
  },
  {
    hangul: '채은',
    gender: 'F',
    yearlyRanks: { 2010: 8, 2011: 7, 2012: 6, 2013: 5, 2014: 6, 2015: 7, 2020: 9 },
    characteristics: ['자연적', '은혜'],
    source: '통계청'
  },

  // 2010년대-2020년대 여성 이름
  {
    hangul: '시아',
    gender: 'F',
    yearlyRanks: { 2015: 2, 2016: 1, 2017: 1, 2018: 2, 2019: 3, 2020: 4, 2024: 7 },
    characteristics: ['트렌디', '국제적'],
    source: '통계청'
  },
  {
    hangul: '지아',
    gender: 'F',
    yearlyRanks: { 2015: 4, 2016: 3, 2017: 3, 2018: 4, 2019: 5, 2020: 6, 2024: 8 },
    characteristics: ['지혜', '아름다움'],
    source: '통계청'
  },
  {
    hangul: '지윤',
    gender: 'F',
    yearlyRanks: { 2018: 5, 2019: 4, 2020: 3, 2021: 3, 2022: 4, 2023: 5, 2024: 6 },
    characteristics: ['조화', '부드러움'],
    source: '통계청'
  },
  {
    hangul: '서윤',
    gender: 'F',
    yearlyRanks: { 2020: 7, 2021: 6, 2022: 5, 2023: 4, 2024: 3 },
    characteristics: ['세련됨', '조화'],
    source: '통계청'
  },
  {
    hangul: '하은',
    gender: 'F',
    yearlyRanks: { 2020: 5, 2021: 4, 2022: 3, 2023: 3, 2024: 4 },
    characteristics: ['자연적', '은혜'],
    source: '통계청'
  }
];

// 시대 정보
export const eraDescriptions = {
  'pre1960': { name: '전전 세대', start: 1945, end: 1959 },
  '1960s': { name: '베이비붐 세대', start: 1960, end: 1969 },
  '1970s': { name: '산업화 세대', start: 1970, end: 1979 },
  '1980s': { name: 'X세대', start: 1980, end: 1989 },
  '1990s': { name: '밀레니얼 초기', start: 1990, end: 1999 },
  '2000s': { name: '밀레니얼 세대', start: 2000, end: 2009 },
  '2010s': { name: 'Z세대 초기', start: 2010, end: 2019 },
  '2020s': { name: 'Z세대', start: 2020, end: 2029 }
};

export function getEraDescription(year: number) {
  if (year < 1960) return eraDescriptions.pre1960;
  if (year < 1970) return eraDescriptions['1960s'];
  if (year < 1980) return eraDescriptions['1970s'];
  if (year < 1990) return eraDescriptions['1980s'];
  if (year < 2000) return eraDescriptions['1990s'];
  if (year < 2010) return eraDescriptions['2000s'];
  if (year < 2020) return eraDescriptions['2010s'];
  return eraDescriptions['2020s'];
}

// 추천 로직
export interface NameRecommendation {
  koreanName: KoreanNameData;
  matchScore: number;
  matchReason: string;
  peakYearDifference: number;
}

export function getKoreanNameRecommendations(japaneseNameData: JapaneseNameData): NameRecommendation[] {
  const japanesePeakYear = getNamePeakYear(japaneseNameData);
  const recommendations: NameRecommendation[] = [];

  for (const koreanName of koreanNames) {
    if (koreanName.gender !== japaneseNameData.gender) continue;

    const koreanPeakYear = getNamePeakYear(koreanName);
    const yearDifference = Math.abs(japanesePeakYear - koreanPeakYear);
    
    // 점수 계산 (낮을수록 좋음)
    let score = yearDifference;
    
    // 시대적 맥락 고려
    const japaneseEra = getEraDescription(japanesePeakYear);
    const koreanEra = getEraDescription(koreanPeakYear);
    
    // 같은 시대면 보너스
    if (japaneseEra.name === koreanEra.name) {
      score -= 10;
    }
    
    // 인접 시대면 작은 보너스
    if (Math.abs(japanesePeakYear - koreanPeakYear) <= 10) {
      score -= 5;
    }

    const matchReason = generateMatchReason(
      japaneseNameData, 
      koreanName, 
      japanesePeakYear, 
      koreanPeakYear,
      japaneseEra,
      koreanEra
    );

    recommendations.push({
      koreanName,
      matchScore: score,
      matchReason,
      peakYearDifference: yearDifference
    });
  }

  // 점수 순으로 정렬하고 상위 8개 반환
  return recommendations
    .sort((a, b) => a.matchScore - b.matchScore)
    .slice(0, 8);
}

function getNamePeakYear(nameData: KoreanNameData | JapaneseNameData): number {
  const ranks = nameData.yearlyRanks;
  const bestRank = Math.min(...Object.values(ranks));
  const peakYears = Object.entries(ranks)
    .filter(([, rank]) => rank === bestRank)
    .map(([year]) => parseInt(year));
  
  return Math.round(peakYears.reduce((a, b) => a + b) / peakYears.length);
}

function generateMatchReason(
  japaneseNameData: JapaneseNameData,
  koreanName: KoreanNameData,
  japanesePeakYear: number,
  koreanPeakYear: number,
  japaneseEra: any,
  koreanEra: any
): string {
  const yearDiff = Math.abs(japanesePeakYear - koreanPeakYear);
  
  if (yearDiff <= 3) {
    return `${japanesePeakYear}년경 일본에서 인기였을 때 한국에서도 ${koreanPeakYear}년경 인기를 얻었습니다.`;
  } else if (yearDiff <= 10) {
    return `일본에서 ${japaneseEra.name} 시기에 인기였고, 한국에서도 ${koreanEra.name} 시기에 비슷하게 인기를 얻었습니다.`;
  } else if (japaneseEra.name === koreanEra.name) {
    return `같은 ${japaneseEra.name} 시기에 양국에서 모두 인기를 얻은 이름 스타일입니다.`;
  } else {
    return `일본의 ${japaneseEra.name} 시기 인기 이름과 한국의 ${koreanEra.name} 시기 인기 이름으로 시대적 특성이 비슷합니다.`;
  }
}