// 일본 이름 데이터베이스
export interface JapaneseNameData {
  kanji: string;
  reading: string;
  gender: 'M' | 'F';
  yearlyRanks: Record<number, number>; // year -> rank (1-10, null if not in top 10)
  source: string;
  characteristics?: string[];
  similarityReason?: string; // 유사성 이유 (동적으로 추가됨)
}

const sampleJapaneseNames: JapaneseNameData[] = [
  // === 남성 이름 ===
  
  // 1960년대-1970년대 남성 이름 (쇼와 초중기)
  {
    kanji: '博',
    reading: 'ひろし',
    gender: 'M',
    yearlyRanks: { 1960: 2, 1961: 1, 1962: 1, 1963: 2, 1964: 3, 1965: 4, 1970: 8 },
    source: 'MeijiYasuda',
    characteristics: ['전통적', '안정감']
  },
  {
    kanji: '勝',
    reading: 'まさる',
    gender: 'M',
    yearlyRanks: { 1960: 4, 1961: 3, 1962: 3, 1963: 4, 1964: 5, 1965: 6, 1970: 9 },
    source: 'MeijiYasuda',
    characteristics: ['전통적', '남성적']
  },
  {
    kanji: '進',
    reading: 'すすむ',
    gender: 'M',
    yearlyRanks: { 1962: 6, 1963: 5, 1964: 4, 1965: 5, 1966: 6, 1967: 7, 1970: 10 },
    source: 'MeijiYasuda',
    characteristics: ['진취적', '미래지향적']
  },
  {
    kanji: '隆',
    reading: 'たかし',
    gender: 'M',
    yearlyRanks: { 1965: 8, 1966: 7, 1967: 6, 1968: 5, 1969: 6, 1970: 7, 1975: 9 },
    source: 'MeijiYasuda',
    characteristics: ['전통적', '웅대함']
  },
  {
    kanji: '誠',
    reading: 'まこと',
    gender: 'M',
    yearlyRanks: { 1968: 3, 1969: 2, 1970: 2, 1971: 3, 1972: 4, 1973: 5, 1975: 7 },
    source: 'MeijiYasuda',
    characteristics: ['성실함', '진실함']
  },

  // 1970년대-1980년대 남성 이름 (쇼와 중후기)
  {
    kanji: '健',
    reading: 'けん',
    gender: 'M',
    yearlyRanks: { 1975: 3, 1976: 2, 1977: 2, 1978: 3, 1979: 4, 1980: 5, 1985: 8 },
    source: 'MeijiYasuda',
    characteristics: ['건강함', '활력']
  },
  {
    kanji: '大輔',
    reading: 'だいすけ',
    gender: 'M',
    yearlyRanks: { 1975: 5, 1976: 4, 1977: 3, 1978: 2, 1979: 2, 1980: 3, 1985: 6 },
    source: 'MeijiYasuda',
    characteristics: ['도움', '지원']
  },
  {
    kanji: '秀樹',
    reading: 'ひでき',
    gender: 'M',
    yearlyRanks: { 1978: 6, 1979: 5, 1980: 4, 1981: 3, 1982: 4, 1983: 5, 1985: 7 },
    source: 'MeijiYasuda',
    characteristics: ['우수함', '자연적']
  },
  {
    kanji: '智',
    reading: 'さとし',
    gender: 'M',
    yearlyRanks: { 1979: 7, 1980: 6, 1981: 5, 1982: 5, 1983: 6, 1984: 7, 1985: 8 },
    source: 'MeijiYasuda',
    characteristics: ['지혜', '현명함']
  },
  {
    kanji: '聡',
    reading: 'そう',
    gender: 'M',
    yearlyRanks: { 1980: 7, 1981: 6, 1982: 6, 1983: 7, 1984: 8, 1985: 9, 1990: 8 },
    source: 'MeijiYasuda',
    characteristics: ['영리함', '민첩함']
  },

  // 1980년대-1990년대 남성 이름 (쇼와 말기~헤이세이 초기)
  {
    kanji: '翔太',
    reading: 'しょうた',
    gender: 'M',
    yearlyRanks: { 1985: 2, 1986: 1, 1987: 1, 1988: 2, 1989: 3, 1990: 4, 1995: 8 },
    source: 'MeijiYasuda',
    characteristics: ['역동적', '젊음']
  },
  {
    kanji: '拓也',
    reading: 'たくや',
    gender: 'M',
    yearlyRanks: { 1985: 4, 1986: 3, 1987: 3, 1988: 4, 1989: 5, 1990: 6, 1995: 9 },
    source: 'MeijiYasuda',
    characteristics: ['개척정신', '확장']
  },
  {
    kanji: '健太',
    reading: 'けんた',
    gender: 'M',
    yearlyRanks: { 1988: 5, 1989: 4, 1990: 3, 1991: 3, 1992: 4, 1993: 5, 1995: 7 },
    source: 'MeijiYasuda',
    characteristics: ['건강함', '활기']
  },
  {
    kanji: '大樹',
    reading: 'だいき',
    gender: 'M',
    yearlyRanks: { 1990: 7, 1991: 6, 1992: 5, 1993: 6, 1994: 7, 1995: 8, 2000: 10 },
    source: 'MeijiYasuda',
    characteristics: ['웅대함', '자연적']
  },
  {
    kanji: '裕太',
    reading: 'ゆうた',
    gender: 'M',
    yearlyRanks: { 1990: 5, 1991: 4, 1992: 3, 1993: 4, 1994: 5, 1995: 6, 2000: 9 },
    source: 'MeijiYasuda',
    characteristics: ['여유로움', '관대함']
  },

  // 1990년대-2000년대 남성 이름 (헤이세이 전기)
  {
    kanji: '大翔',
    reading: 'ひろと',
    gender: 'M',
    yearlyRanks: { 1995: 2, 1996: 1, 1997: 1, 1998: 2, 1999: 3, 2000: 4, 2005: 8 },
    source: 'MeijiYasuda',
    characteristics: ['웅대함', '비상']
  },
  {
    kanji: '蓮',
    reading: 'れん',
    gender: 'M',
    yearlyRanks: { 1995: 3, 1996: 2, 1997: 3, 1998: 4, 1999: 5, 2000: 6, 2005: 9 },
    source: 'MeijiYasuda',
    characteristics: ['자연적', '순수함']
  },
  {
    kanji: '海斗',
    reading: 'かいと',
    gender: 'M',
    yearlyRanks: { 1998: 5, 1999: 4, 2000: 3, 2001: 3, 2002: 4, 2003: 5, 2005: 7 },
    source: 'MeijiYasuda',
    characteristics: ['자연적', '역동적']
  },
  {
    kanji: '翼',
    reading: 'つばさ',
    gender: 'M',
    yearlyRanks: { 2000: 7, 2001: 6, 2002: 5, 2003: 6, 2004: 7, 2005: 8, 2010: 10 },
    source: 'MeijiYasuda',
    characteristics: ['자유로움', '비상']
  },
  {
    kanji: '颯太',
    reading: 'そうた',
    gender: 'M',
    yearlyRanks: { 2000: 5, 2001: 4, 2002: 3, 2003: 4, 2004: 5, 2005: 6, 2010: 9 },
    source: 'MeijiYasuda',
    characteristics: ['시원함', '활기']
  },

  // 2000년대-2010년대 남성 이름 (헤이세이 중후기)
  {
    kanji: '陽翔',
    reading: 'はると',
    gender: 'M',
    yearlyRanks: { 2005: 2, 2006: 1, 2007: 1, 2008: 1, 2009: 2, 2010: 3, 2015: 6 },
    source: 'MeijiYasuda',
    characteristics: ['밝음', '비상']
  },
  {
    kanji: '湊',
    reading: 'みなと',
    gender: 'M',
    yearlyRanks: { 2005: 3, 2006: 2, 2007: 2, 2008: 3, 2009: 4, 2010: 5, 2015: 8 },
    source: 'MeijiYasuda',
    characteristics: ['만남', '소통']
  },
  {
    kanji: '悠真',
    reading: 'ゆうま',
    gender: 'M',
    yearlyRanks: { 2008: 4, 2009: 3, 2010: 2, 2011: 2, 2012: 3, 2013: 4, 2015: 7 },
    source: 'MeijiYasuda',
    characteristics: ['여유로움', '진실함']
  },
  {
    kanji: '結翔',
    reading: 'ゆいと',
    gender: 'M',
    yearlyRanks: { 2010: 6, 2011: 5, 2012: 4, 2013: 3, 2014: 4, 2015: 5, 2020: 8 },
    source: 'MeijiYasuda',
    characteristics: ['연결', '비상']
  },
  {
    kanji: '碧',
    reading: 'あお',
    gender: 'M',
    yearlyRanks: { 2010: 8, 2011: 7, 2012: 6, 2013: 5, 2014: 6, 2015: 7, 2020: 9 },
    source: 'MeijiYasuda',
    characteristics: ['자연적', '신선함']
  },

  // 2010년대-2020년대 남성 이름 (헤이세이 말기~레이와)
  {
    kanji: '蒼',
    reading: 'あおい',
    gender: 'M',
    yearlyRanks: { 2015: 2, 2016: 1, 2017: 1, 2018: 2, 2019: 3, 2020: 4, 2024: 7 },
    source: 'MeijiYasuda',
    characteristics: ['자연적', '청량함']
  },
  {
    kanji: '律',
    reading: 'りつ',
    gender: 'M',
    yearlyRanks: { 2015: 4, 2016: 3, 2017: 3, 2018: 4, 2019: 5, 2020: 6, 2024: 8 },
    source: 'MeijiYasuda',
    characteristics: ['질서', '규칙성']
  },
  {
    kanji: '樹',
    reading: 'いつき',
    gender: 'M',
    yearlyRanks: { 2018: 5, 2019: 4, 2020: 3, 2021: 3, 2022: 4, 2023: 5, 2024: 6 },
    source: 'MeijiYasuda',
    characteristics: ['자연적', '성장']
  },
  {
    kanji: '凪',
    reading: 'なぎ',
    gender: 'M',
    yearlyRanks: { 2020: 7, 2021: 6, 2022: 5, 2023: 4, 2024: 3 },
    source: 'MeijiYasuda',
    characteristics: ['고요함', '평온']
  },
  {
    kanji: '新',
    reading: 'あらた',
    gender: 'M',
    yearlyRanks: { 2020: 5, 2021: 4, 2022: 3, 2023: 3, 2024: 4 },
    source: 'MeijiYasuda',
    characteristics: ['새로움', '혁신']
  },

  // === 여성 이름 ===

  // 1960년대-1970년대 여성 이름 (쇼와 초중기)
  {
    kanji: '恵',
    reading: 'めぐみ',
    gender: 'F',
    yearlyRanks: { 1960: 1, 1961: 1, 1962: 2, 1963: 3, 1964: 4, 1965: 5, 1970: 8 },
    source: 'MeijiYasuda',
    characteristics: ['은혜', '자비']
  },
  {
    kanji: '直美',
    reading: 'なおみ',
    gender: 'F',
    yearlyRanks: { 1965: 2, 1966: 1, 1967: 1, 1968: 1, 1969: 2, 1970: 3, 1975: 7 },
    source: 'MeijiYasuda',
    characteristics: ['정직함', '아름다움']
  },
  {
    kanji: '洋子',
    reading: 'ようこ',
    gender: 'F',
    yearlyRanks: { 1960: 4, 1961: 3, 1962: 2, 1963: 2, 1964: 3, 1965: 4, 1970: 8 },
    source: 'MeijiYasuda',
    characteristics: ['서구적', '개방적']
  },
  {
    kanji: '真理',
    reading: 'まり',
    gender: 'F',
    yearlyRanks: { 1960: 6, 1961: 5, 1962: 4, 1963: 4, 1964: 5, 1965: 6, 1970: 9 },
    source: 'MeijiYasuda',
    characteristics: ['진리', '이성적']
  },
  {
    kanji: '愛',
    reading: 'あい',
    gender: 'F',
    yearlyRanks: { 1965: 5, 1966: 4, 1967: 3, 1968: 3, 1969: 4, 1970: 5, 1975: 8 },
    source: 'MeijiYasuda',
    characteristics: ['사랑', '애정']
  },

  // 1970년대-1980년대 여성 이름 (쇼와 중후기)
  {
    kanji: '恵子',
    reading: 'けいこ',
    gender: 'F',
    yearlyRanks: { 1975: 2, 1976: 1, 1977: 1, 1978: 2, 1979: 3, 1980: 4, 1985: 7 },
    source: 'MeijiYasuda',
    characteristics: ['은혜', '전통적']
  },
  {
    kanji: '由美',
    reading: 'ゆみ',
    gender: 'F',
    yearlyRanks: { 1975: 3, 1976: 2, 1977: 2, 1978: 3, 1979: 4, 1980: 5, 1985: 8 },
    source: 'MeijiYasuda',
    characteristics: ['자유로움', '아름다움']
  },
  {
    kanji: '真由美',
    reading: 'まゆみ',
    gender: 'F',
    yearlyRanks: { 1978: 4, 1979: 3, 1980: 2, 1981: 2, 1982: 3, 1983: 4, 1985: 6 },
    source: 'MeijiYasuda',
    characteristics: ['진실함', '아름다움']
  },
  {
    kanji: '智子',
    reading: 'ともこ',
    gender: 'F',
    yearlyRanks: { 1980: 6, 1981: 5, 1982: 4, 1983: 3, 1984: 4, 1985: 5, 1990: 8 },
    source: 'MeijiYasuda',
    characteristics: ['지혜', '현명함']
  },
  {
    kanji: '裕子',
    reading: 'ゆうこ',
    gender: 'F',
    yearlyRanks: { 1982: 5, 1983: 4, 1984: 3, 1985: 2, 1986: 3, 1987: 4, 1990: 7 },
    source: 'MeijiYasuda',
    characteristics: ['여유로움', '관대함']
  },

  // 1980년대-1990년대 여성 이름 (쇼와 말기~헤이세이 초기)
  {
    kanji: '美咲',
    reading: 'みさき',
    gender: 'F',
    yearlyRanks: { 1985: 3, 1986: 2, 1987: 1, 1988: 1, 1989: 2, 1990: 3, 1995: 6 },
    source: 'MeijiYasuda',
    characteristics: ['아름다움', '개화']
  },
  {
    kanji: '愛美',
    reading: 'まなみ',
    gender: 'F',
    yearlyRanks: { 1985: 4, 1986: 3, 1987: 2, 1988: 3, 1989: 4, 1990: 5, 1995: 8 },
    source: 'MeijiYasuda',
    characteristics: ['사랑', '아름다움']
  },
  {
    kanji: '彩',
    reading: 'あや',
    gender: 'F',
    yearlyRanks: { 1988: 5, 1989: 4, 1990: 4, 1991: 3, 1992: 4, 1993: 5, 1995: 7 },
    source: 'MeijiYasuda',
    characteristics: ['색채', '화려함']
  },
  {
    kanji: '香織',
    reading: 'かおり',
    gender: 'F',
    yearlyRanks: { 1990: 6, 1991: 5, 1992: 5, 1993: 6, 1994: 7, 1995: 8, 2000: 10 },
    source: 'MeijiYasuda',
    characteristics: ['향기', '우아함']
  },
  {
    kanji: '舞',
    reading: 'まい',
    gender: 'F',
    yearlyRanks: { 1990: 7, 1991: 6, 1992: 6, 1993: 7, 1994: 8, 1995: 9, 2000: 9 },
    source: 'MeijiYasuda',
    characteristics: ['춤', '우아함']
  },

  // 1990년대-2000년대 여성 이름 (헤이세이 전기)
  {
    kanji: '結愛',
    reading: 'ゆあ',
    gender: 'F',
    yearlyRanks: { 1995: 2, 1996: 1, 1997: 1, 1998: 2, 1999: 3, 2000: 4, 2005: 7 },
    source: 'MeijiYasuda',
    characteristics: ['결합', '사랑']
  },
  {
    kanji: '七海',
    reading: 'ななみ',
    gender: 'F',
    yearlyRanks: { 1995: 3, 1996: 2, 1997: 2, 1998: 3, 1999: 4, 2000: 5, 2005: 8 },
    source: 'MeijiYasuda',
    characteristics: ['바다', '넓음']
  },
  {
    kanji: '遥',
    reading: 'はるか',
    gender: 'F',
    yearlyRanks: { 1998: 4, 1999: 3, 2000: 2, 2001: 2, 2002: 3, 2003: 4, 2005: 6 },
    source: 'MeijiYasuda',
    characteristics: ['멀리', '이상향']
  },
  {
    kanji: '花',
    reading: 'はな',
    gender: 'F',
    yearlyRanks: { 2000: 6, 2001: 5, 2002: 4, 2003: 3, 2004: 4, 2005: 5, 2010: 8 },
    source: 'MeijiYasuda',
    characteristics: ['꽃', '자연적']
  },
  {
    kanji: '心',
    reading: 'こころ',
    gender: 'F',
    yearlyRanks: { 2000: 8, 2001: 7, 2002: 6, 2003: 5, 2004: 6, 2005: 7, 2010: 9 },
    source: 'MeijiYasuda',
    characteristics: ['마음', '감성']
  },

  // 2000년대-2010년대 여성 이름 (헤이세이 중후기)
  {
    kanji: '葵',
    reading: 'あおい',
    gender: 'F',
    yearlyRanks: { 2005: 2, 2006: 1, 2007: 1, 2008: 1, 2009: 2, 2010: 3, 2015: 6 },
    source: 'MeijiYasuda',
    characteristics: ['자연적', '향기']
  },
  {
    kanji: '陽菜',
    reading: 'ひな',
    gender: 'F',
    yearlyRanks: { 2005: 3, 2006: 2, 2007: 2, 2008: 3, 2009: 4, 2010: 5, 2015: 8 },
    source: 'MeijiYasuda',
    characteristics: ['햇살', '자연적']
  },
  {
    kanji: '凛',
    reading: 'りん',
    gender: 'F',
    yearlyRanks: { 2008: 4, 2009: 3, 2010: 2, 2011: 2, 2012: 3, 2013: 4, 2015: 7 },
    source: 'MeijiYasuda',
    characteristics: ['당당함', '기품']
  },
  {
    kanji: '咲良',
    reading: 'さくら',
    gender: 'F',
    yearlyRanks: { 2010: 6, 2011: 5, 2012: 4, 2013: 3, 2014: 4, 2015: 5, 2020: 8 },
    source: 'MeijiYasuda',
    characteristics: ['꽃', '일본적']
  },
  {
    kanji: '音',
    reading: 'おと',
    gender: 'F',
    yearlyRanks: { 2010: 8, 2011: 7, 2012: 6, 2013: 5, 2014: 6, 2015: 7, 2020: 9 },
    source: 'MeijiYasuda',
    characteristics: ['음악', '감성']
  },

  // 2010년대-2020년代 여성 이름 (헤이세이 말기~레이와)
  {
    kanji: '紬',
    reading: 'つむぎ',
    gender: 'F',
    yearlyRanks: { 2015: 2, 2016: 1, 2017: 1, 2018: 2, 2019: 3, 2020: 4, 2024: 7 },
    source: 'MeijiYasuda',
    characteristics: ['전통적', '수공예']
  },
  {
    kanji: '陽葵',
    reading: 'ひまり',
    gender: 'F',
    yearlyRanks: { 2015: 4, 2016: 3, 2017: 3, 2018: 4, 2019: 5, 2020: 6, 2024: 8 },
    source: 'MeijiYasuda',
    characteristics: ['햇살', '자연적']
  },
  {
    kanji: '芽',
    reading: 'めい',
    gender: 'F',
    yearlyRanks: { 2018: 5, 2019: 4, 2020: 3, 2021: 3, 2022: 4, 2023: 5, 2024: 6 },
    source: 'MeijiYasuda',
    characteristics: ['새싹', '성장']
  },
  {
    kanji: '莉子',
    reading: 'りこ',
    gender: 'F',
    yearlyRanks: { 2020: 7, 2021: 6, 2022: 5, 2023: 4, 2024: 3 },
    source: 'MeijiYasuda',
    characteristics: ['자연적', '우아함']
  },
  {
    kanji: '奏',
    reading: 'かなで',
    gender: 'F',
    yearlyRanks: { 2020: 5, 2021: 4, 2022: 3, 2023: 3, 2024: 4 },
    source: 'MeijiYasuda',
    characteristics: ['음악', '조화']
  }
];

// 시대 구분
export const ERA_PERIODS = {
  SHOWA: { nameKo: '쇼와', nameEn: 'showa', name: '쇼와', start: 1926, end: 1988 },
  HEISEI: { nameKo: '헤이세이', nameEn: 'heisei', name: '헤이세이', start: 1989, end: 2018 },
  REIWA: { nameKo: '레이와', nameEn: 'reiwa', name: '레이와', start: 2019, end: 2024 }
};

export class JapaneseNameDatabase {
  static searchNames(query: string): JapaneseNameData[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    return sampleJapaneseNames.filter(name => 
      name.kanji.includes(normalizedQuery) ||
      name.reading.includes(normalizedQuery) ||
      // 히라가나를 로마자로 검색하는 경우도 고려
      this.convertToRomaji(name.reading).includes(normalizedQuery) ||
      // 특성으로도 검색 가능
      (name.characteristics && name.characteristics.some(char => char.includes(normalizedQuery))) ||
      // 부분 매칭도 지원
      name.kanji.split('').some(char => char.includes(normalizedQuery)) ||
      name.reading.split('').some(char => char.includes(normalizedQuery))
    );
  }

  static getAllNames(): JapaneseNameData[] {
    return sampleJapaneseNames;
  }

  static getNamesByGender(gender: 'M' | 'F'): JapaneseNameData[] {
    return sampleJapaneseNames.filter(name => name.gender === gender);
  }

  static getNamesByEra(era: keyof typeof ERA_PERIODS): JapaneseNameData[] {
    const period = ERA_PERIODS[era];
    return sampleJapaneseNames.filter(name => {
      const years = Object.keys(name.yearlyRanks).map(Number);
      return years.some(year => year >= period.start && year <= period.end);
    });
  }

  static getPopularNames(): JapaneseNameData[] {
    // 최근 5년간 1위를 한 적이 있는 이름들
    return sampleJapaneseNames.filter(name => {
      const recent5Years = [2020, 2021, 2022, 2023, 2024];
      return recent5Years.some(year => name.yearlyRanks[year] === 1);
    });
  }

  static getSimilarNames(targetName: string): JapaneseNameData[] {
    // 비슷한 한자나 읽기를 가진 이름들 찾기
    const target = sampleJapaneseNames.find(name => name.kanji === targetName);
    if (!target) return [];

    const similarNames: { name: JapaneseNameData; score: number; reason: string }[] = [];

    for (const name of sampleJapaneseNames) {
      if (name.kanji === targetName) continue;

      let score = 0;
      const reasons: string[] = [];

      // 1. 같은 한자 포함 (높은 점수)
      const sharedKanji = name.kanji.split('').filter(char => target.kanji.includes(char));
      if (sharedKanji.length > 0) {
        score += sharedKanji.length * 15;
        reasons.push(`공통한자(${sharedKanji.join('')})`);
      }

      // 2. 발음 유사성
      if (name.reading.includes(target.reading.substring(0, 2)) || 
          target.reading.includes(name.reading.substring(0, 2))) {
        score += 10;
        reasons.push('발음유사');
      }

      // 3. 같은 성별
      if (target.gender === name.gender) {
        score += 5;
        reasons.push('같은성별');
      }

      // 4. 비슷한 시대 인기
      const targetPeakYear = this.getPeakYear(target);
      const namePeakYear = this.getPeakYear(name);
      if (targetPeakYear && namePeakYear && Math.abs(targetPeakYear - namePeakYear) <= 10) {
        score += 8;
        reasons.push('같은시대');
      }

      // 5. 공통 특성
      if (target.characteristics && name.characteristics) {
        const sharedCharacteristics = target.characteristics.filter(char => 
          name.characteristics!.includes(char)
        );
        if (sharedCharacteristics.length > 0) {
          score += sharedCharacteristics.length * 3;
          reasons.push(`공통특성(${sharedCharacteristics[0]})`);
        }
      }

      if (score > 5) {  // 최소 점수 기준
        similarNames.push({
          name,
          score,
          reason: reasons.join(', ')
        });
      }
    }

    // 점수 순으로 정렬하고 상위 8개만 반환
    return similarNames
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => ({ ...item.name, similarityReason: item.reason }));
  }

  static getPeakYear(nameData: JapaneseNameData): number | null {
    if (!nameData.yearlyRanks || Object.keys(nameData.yearlyRanks).length === 0) {
      return null;
    }
    
    const bestRank = Math.min(...Object.values(nameData.yearlyRanks));
    const peakYears = Object.entries(nameData.yearlyRanks)
      .filter(([, rank]) => rank === bestRank)
      .map(([year]) => parseInt(year));
    
    return peakYears.length > 0 ? Math.round(peakYears.reduce((a, b) => a + b) / peakYears.length) : null;
  }

  private static convertToRomaji(hiragana: string): string {
    // 간단한 히라가나 -> 로마자 변환
    const romajiMap: Record<string, string> = {
      'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
      'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
      'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
      'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
      'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
      'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
      'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
      'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
      'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
      'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
      'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
      'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
      'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
      'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
      'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n'
    };

    return hiragana.split('').map(char => romajiMap[char] || char).join('');
  }
}