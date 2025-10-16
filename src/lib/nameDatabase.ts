// 한국 이름 데이터베이스
export interface NameData {
  hanja?: string; // 한자 (없을 수도 있음)
  hangul: string; // 한글
  gender: 'M' | 'F';
  yearlyRanks: Record<number, number>; // year -> rank (1-10, null if not in top 10)
  source: string;
}

const sampleNames: NameData[] = [
  {
    hanja: '민준',
    hangul: '민준',
    gender: 'M',
    yearlyRanks: {
      2008: 5,
      2009: 3,
      2010: 1,
      2011: 1,
      2012: 1,
      2013: 1,
      2014: 1,
      2015: 1,
      2016: 1,
      2017: 2,
      2018: 3,
      2019: 4,
      2020: 5
    },
    source: '통계청'
  },
  {
    hanja: '서연',
    hangul: '서연',
    gender: 'F',
    yearlyRanks: {
      2015: 8,
      2016: 5,
      2017: 3,
      2018: 2,
      2019: 1,
      2020: 1,
      2021: 1,
      2022: 1,
      2023: 1,
      2024: 1
    },
    source: '통계청'
  },
  {
    hanja: '지현',
    hangul: '지현',
    gender: 'F',
    yearlyRanks: {
      1985: 3,
      1986: 2,
      1987: 1,
      1988: 1,
      1989: 1,
      1990: 2,
      1991: 3,
      1992: 4,
      1993: 5,
      1995: 7,
      2000: 9
    },
    source: '통계청'
  },
  {
    hanja: '현우',
    hangul: '현우',
    gender: 'M',
    yearlyRanks: {
      1990: 4,
      1991: 3,
      1992: 2,
      1993: 1,
      1994: 1,
      1995: 2,
      1996: 3,
      1997: 4,
      1998: 5,
      2000: 7,
      2005: 9
    },
    source: '통계청'
  },
  {
    hanja: '영수',
    hangul: '영수',
    gender: 'M',
    yearlyRanks: {
      1960: 2,
      1961: 1,
      1962: 1,
      1963: 1,
      1964: 2,
      1965: 3,
      1966: 4,
      1967: 5,
      1970: 7,
      1975: 10
    },
    source: '통계청'
  },
  {
    hanja: '미영',
    hangul: '미영',
    gender: 'F',
    yearlyRanks: {
      1965: 4,
      1966: 3,
      1967: 2,
      1968: 1,
      1969: 1,
      1970: 1,
      1971: 2,
      1972: 3,
      1973: 4,
      1975: 6,
      1980: 8
    },
    source: '통계청'
  },
  {
    hanja: '준서',
    hangul: '준서',
    gender: 'M',
    yearlyRanks: {
      2005: 9,
      2006: 7,
      2007: 5,
      2008: 3,
      2009: 2,
      2010: 3,
      2011: 4,
      2012: 5,
      2013: 6,
      2014: 7,
      2015: 8
    },
    source: '통계청'
  },
  {
    hanja: '예은',
    hangul: '예은',
    gender: 'F',
    yearlyRanks: {
      2005: 8,
      2006: 6,
      2007: 4,
      2008: 2,
      2009: 1,
      2010: 1,
      2011: 2,
      2012: 3,
      2013: 4,
      2014: 5,
      2015: 6
    },
    source: '통계청'
  },
  {
    hangul: '하은',
    gender: 'F',
    yearlyRanks: {
      2018: 9,
      2019: 7,
      2020: 5,
      2021: 3,
      2022: 2,
      2023: 2,
      2024: 3
    },
    source: '통계청'
  }
];

export class NameDatabase {
  static searchNames(query: string): NameData[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    return sampleNames.filter(name => 
      name.hangul.includes(normalizedQuery) ||
      (name.hanja && name.hanja.includes(normalizedQuery))
    );
  }

  static getAllNames(): NameData[] {
    return sampleNames;
  }

  static getNamesByGender(gender: 'M' | 'F'): NameData[] {
    return sampleNames.filter(name => name.gender === gender);
  }
}

// 한국 세대 구분
export const GENERATION_PERIODS = {
  BABY_BOOM: { start: 1955, end: 1963, name: '베이비붐 세대', nameEn: 'BabyBoom' },
  X_GENERATION: { start: 1970, end: 1980, name: 'X세대', nameEn: 'Generation X' },
  MILLENNIAL: { start: 1981, end: 1996, name: '밀레니얼 세대', nameEn: 'Millennial' },
  Z_GENERATION: { start: 1997, end: 2010, name: 'Z세대', nameEn: 'Generation Z' },
  ALPHA: { start: 2010, end: 2024, name: '알파세대', nameEn: 'Generation Alpha' }
} as const;

export function getGenerationForYear(year: number): keyof typeof GENERATION_PERIODS | null {
  if (year >= GENERATION_PERIODS.ALPHA.start) return 'ALPHA';
  if (year >= GENERATION_PERIODS.Z_GENERATION.start) return 'Z_GENERATION';
  if (year >= GENERATION_PERIODS.MILLENNIAL.start) return 'MILLENNIAL';
  if (year >= GENERATION_PERIODS.X_GENERATION.start) return 'X_GENERATION';
  if (year >= GENERATION_PERIODS.BABY_BOOM.start) return 'BABY_BOOM';
  return null;
}