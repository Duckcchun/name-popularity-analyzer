import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c15330c1/health", async (c) => {
  try {
    console.log('Health check requested');
    
    // Test KV store access
    const testKey = 'health_check_test';
    await kv.set(testKey, 'ok');
    const testValue = await kv.get(testKey);
    await kv.del(testKey);
    
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      kvStore: testValue === 'ok' ? 'working' : 'error',
      server: 'running'
    };
    
    console.log('Health check result:', status);
    return c.json(status);
  } catch (error) {
    console.error('Health check error:', error);
    return c.json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      error: error.message 
    }, 500);
  }
});

// Data structures for names
interface JapaneseNameData {
  kanji: string;
  reading: string;
  gender: 'M' | 'F';
  yearlyRanks: Record<number, number>;
  source: string;
  characteristics?: string[];
  similarityReason?: string;
}

interface KoreanNameData {
  name: string;
  gender: 'M' | 'F';
  yearlyRanks: Record<number, number>;
  source: string;
  characteristics?: string[];
  peakYear?: number;
  era?: string;
}

// Romaji to Hiragana conversion
function romajiToHiragana(romaji: string): string {
  const conversions: Record<string, string> = {
    'a': 'あ', 'ka': 'か', 'ga': 'が', 'sa': 'さ', 'za': 'ざ', 'ta': 'た', 'da': 'だ',
    'na': 'な', 'ha': 'は', 'ba': 'ば', 'pa': 'ぱ', 'ma': 'ま', 'ya': 'や', 'ra': 'ら', 'wa': 'わ',
    'i': 'い', 'ki': 'き', 'gi': 'ぎ', 'si': 'し', 'shi': 'し', 'zi': 'じ', 'ji': 'じ', 'ti': 'ち', 'chi': 'ち', 'di': 'ぢ',
    'ni': 'に', 'hi': 'ひ', 'bi': 'び', 'pi': 'ぴ', 'mi': 'み', 'ri': 'り',
    'u': 'う', 'ku': 'く', 'gu': 'ぐ', 'su': 'す', 'zu': 'ず', 'tu': 'つ', 'tsu': 'つ', 'du': 'づ',
    'nu': 'ぬ', 'hu': 'ふ', 'fu': 'ふ', 'bu': 'ぶ', 'pu': 'ぷ', 'mu': 'む', 'yu': 'ゆ', 'ru': 'る',
    'e': 'え', 'ke': 'け', 'ge': 'げ', 'se': 'せ', 'ze': 'ぜ', 'te': 'て', 'de': 'で',
    'ne': 'ね', 'he': 'へ', 'be': 'べ', 'pe': 'ぺ', 'me': 'め', 're': 'れ',
    'o': 'お', 'ko': 'こ', 'go': 'ご', 'so': 'そ', 'zo': 'ぞ', 'to': 'と', 'do': 'ど',
    'no': 'の', 'ho': 'ほ', 'bo': 'ぼ', 'po': 'ぽ', 'mo': 'も', 'yo': 'よ', 'ro': 'ろ', 'wo': 'を',
    'n': 'ん',
    // Special combinations for common Japanese name patterns
    'kya': 'きゃ', 'gya': 'ぎゃ', 'sha': 'しゃ', 'ja': 'じゃ', 'cha': 'ちゃ', 'nya': 'にゃ',
    'hya': 'ひゃ', 'bya': 'びゃ', 'pya': 'ぴゃ', 'mya': 'みゃ', 'rya': 'りゃ',
    'kyu': 'きゅ', 'gyu': 'ぎゅ', 'shu': 'しゅ', 'ju': 'じゅ', 'chu': 'ちゅ', 'nyu': 'にゅ',
    'hyu': 'ひゅ', 'byu': 'びゅ', 'pyu': 'ぴゅ', 'myu': 'みゅ', 'ryu': 'りゅ',
    'kyo': 'きょ', 'gyo': 'ぎょ', 'sho': 'しょ', 'jo': 'じょ', 'cho': 'ちょ', 'nyo': 'にょ',
    'hyo': 'ひょ', 'byo': 'びょ', 'pyo': 'ぴょ', 'myo': 'みょ', 'ryo': 'りょ'
  };

  let result = romaji.toLowerCase();
  
  // Sort by length (longest first) to match longer combinations first
  const sortedKeys = Object.keys(conversions).sort((a, b) => b.length - a.length);
  
  for (const roma of sortedKeys) {
    const regex = new RegExp(roma, 'g');
    result = result.replace(regex, conversions[roma]);
  }
  
  return result;
}

// Hiragana to Romaji conversion (for reverse search)
function hiraganaToRomaji(hiragana: string): string {
  const conversions: Record<string, string> = {
    'あ': 'a', 'か': 'ka', 'が': 'ga', 'さ': 'sa', 'ざ': 'za', 'た': 'ta', 'だ': 'da',
    'な': 'na', 'は': 'ha', 'ば': 'ba', 'ぱ': 'pa', 'ま': 'ma', 'や': 'ya', 'ら': 'ra', 'わ': 'wa',
    'い': 'i', 'き': 'ki', 'ぎ': 'gi', 'し': 'shi', 'じ': 'ji', 'ち': 'chi', 'ぢ': 'di',
    'に': 'ni', 'ひ': 'hi', 'び': 'bi', 'ぴ': 'pi', 'み': 'mi', 'り': 'ri',
    'う': 'u', 'く': 'ku', 'ぐ': 'gu', 'す': 'su', 'ず': 'zu', 'つ': 'tsu', 'づ': 'du',
    'ぬ': 'nu', 'ふ': 'fu', 'ぶ': 'bu', 'ぷ': 'pu', 'む': 'mu', 'ゆ': 'yu', 'る': 'ru',
    'え': 'e', 'け': 'ke', 'げ': 'ge', 'せ': 'se', 'ぜ': 'ze', 'て': 'te', 'で': 'de',
    'ね': 'ne', 'へ': 'he', 'べ': 'be', 'ぺ': 'pe', 'め': 'me', 'れ': 're',
    'お': 'o', 'こ': 'ko', 'ご': 'go', 'そ': 'so', 'ぞ': 'zo', 'と': 'to', 'ど': 'do',
    'の': 'no', 'ほ': 'ho', 'ぼ': 'bo', 'ぽ': 'po', 'も': 'mo', 'よ': 'yo', 'ろ': 'ro', 'を': 'wo',
    'ん': 'n',
    // Special combinations
    'きゃ': 'kya', 'ぎゃ': 'gya', 'しゃ': 'sha', 'じゃ': 'ja', 'ちゃ': 'cha', 'にゃ': 'nya',
    'ひゃ': 'hya', 'びゃ': 'bya', 'ぴゃ': 'pya', 'みゃ': 'mya', 'りゃ': 'rya',
    'きゅ': 'kyu', 'ぎゅ': 'gyu', 'しゅ': 'shu', 'じゅ': 'ju', 'ちゅ': 'chu', 'にゅ': 'nyu',
    'ひゅ': 'hyu', 'びゅ': 'byu', 'ぴゅ': 'pyu', 'みゅ': 'myu', 'りゅ': 'ryu',
    'きょ': 'kyo', 'ぎょ': 'gyo', 'しょ': 'sho', 'じょ': 'jo', 'ちょ': 'cho', 'にょ': 'nyo',
    'ひょ': 'hyo', 'びょ': 'byo', 'ぴょ': 'pyo', 'みょ': 'myo', 'りょ': 'ryo'
  };

  let result = hiragana;
  
  // Sort by length (longest first) to match longer combinations first  
  const sortedKeys = Object.keys(conversions).sort((a, b) => b.length - a.length);
  
  for (const hira of sortedKeys) {
    const regex = new RegExp(hira, 'g');
    result = result.replace(regex, conversions[hira]);
  }
  
  return result;
}



// Initialize database with comprehensive data
app.post("/make-server-c15330c1/init-database", async (c) => {
  try {
    console.log("Initializing database with comprehensive Japanese and Korean name data...");
    
    // Japanese names data - 확장된 정확한 데이터
    const japaneseNames: JapaneseNameData[] = [
      // === 남성 이름 - 1950년대-1960년대 (전후 복구기) ===
      {
        kanji: '博',
        reading: 'ひろし',
        gender: 'M',
        yearlyRanks: { 1955: 1, 1960: 2, 1961: 1, 1962: 1, 1963: 2, 1964: 3, 1965: 4, 1970: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '안정감', '지적']
      },
      {
        kanji: '勝',
        reading: 'まさる',
        gender: 'M',
        yearlyRanks: { 1955: 3, 1960: 4, 1961: 3, 1962: 3, 1963: 4, 1964: 5, 1965: 6, 1970: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '남성적', '승리']
      },
      {
        kanji: '武',
        reading: 'たけし',
        gender: 'M',
        yearlyRanks: { 1952: 2, 1955: 4, 1960: 5, 1962: 6, 1965: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '무사도', '강인함']
      },
      {
        kanji: '清',
        reading: 'きよし',
        gender: 'M',
        yearlyRanks: { 1950: 3, 1955: 5, 1960: 6, 1965: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '깨끗함', '청렴']
      },
      {
        kanji: '正',
        reading: 'ただし',
        gender: 'M',
        yearlyRanks: { 1950: 4, 1955: 6, 1960: 7, 1965: 10 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '정의', '올바름']
      },
      {
        kanji: '太郎',
        reading: 'たろう',
        gender: 'M',
        yearlyRanks: { 1950: 2, 1955: 3, 1960: 5, 1965: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '장남', '클래식']
      },
      {
        kanji: '一郎',
        reading: 'いちろう',
        gender: 'M',
        yearlyRanks: { 1950: 5, 1955: 6, 1960: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '첫째', '숫자']
      },
      {
        kanji: '次郎',
        reading: 'じろう',
        gender: 'M',
        yearlyRanks: { 1950: 7, 1955: 8, 1960: 10 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '둘째', '순서']
      },

      // === 남성 이름 - 1960년대-1970년대 (고도성장기) ===
      {
        kanji: '進',
        reading: 'すすむ',
        gender: 'M',
        yearlyRanks: { 1962: 6, 1963: 5, 1964: 4, 1965: 5, 1966: 6, 1967: 7, 1970: 10 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['진취적', '미래지향적', '발전']
      },
      {
        kanji: '隆',
        reading: 'たかし',
        gender: 'M',
        yearlyRanks: { 1965: 8, 1966: 7, 1967: 6, 1968: 5, 1969: 6, 1970: 7, 1975: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '웅대함', '번영']
      },
      {
        kanji: '誠',
        reading: 'まこと',
        gender: 'M',
        yearlyRanks: { 1968: 3, 1969: 2, 1970: 2, 1971: 3, 1972: 4, 1973: 5, 1975: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['성실함', '진실함', '정직']
      },
      {
        kanji: '豊',
        reading: 'ゆたか',
        gender: 'M',
        yearlyRanks: { 1968: 7, 1970: 5, 1972: 6, 1975: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['풍요로움', '번영', '넉넉함']
      },
      {
        kanji: '治',
        reading: 'おさむ',
        gender: 'M',
        yearlyRanks: { 1965: 7, 1968: 8, 1970: 9, 1975: 10 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '치유', '통치']
      },

      // === 남성 이름 - 1970년대-1980년대 (안정성장기) ===
      {
        kanji: '健',
        reading: 'けん',
        gender: 'M',
        yearlyRanks: { 1975: 3, 1976: 2, 1977: 2, 1978: 3, 1979: 4, 1980: 5, 1985: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['건강함', '활력', '강건함']
      },
      {
        kanji: '大輔',
        reading: 'だいすけ',
        gender: 'M',
        yearlyRanks: { 1975: 5, 1976: 4, 1977: 3, 1978: 2, 1979: 2, 1980: 3, 1985: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['도움', '지원', '협력']
      },
      {
        kanji: '秀樹',
        reading: 'ひでき',
        gender: 'M',
        yearlyRanks: { 1978: 6, 1979: 5, 1980: 4, 1981: 3, 1982: 4, 1983: 5, 1985: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['우수함', '자연적', '성장']
      },
      {
        kanji: '智',
        reading: 'さとし',
        gender: 'M',
        yearlyRanks: { 1979: 7, 1980: 6, 1981: 5, 1982: 5, 1983: 6, 1984: 7, 1985: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['지혜', '현명함', '학문']
      },
      {
        kanji: '聡',
        reading: 'そう',
        gender: 'M',
        yearlyRanks: { 1980: 7, 1981: 6, 1982: 6, 1983: 7, 1984: 8, 1985: 9, 1990: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['영리함', '민첩함', '총명']
      },

      // === 남성 이름 - 1980년대-1990년대 (버블경기~헤이세이 초기) ===
      {
        kanji: '翔太',
        reading: 'しょうた',
        gender: 'M',
        yearlyRanks: { 1985: 2, 1986: 1, 1987: 1, 1988: 2, 1989: 3, 1990: 4, 1995: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['역동적', '젊음', '비상']
      },
      {
        kanji: '拓也',
        reading: 'たくや',
        gender: 'M',
        yearlyRanks: { 1985: 4, 1986: 3, 1987: 3, 1988: 4, 1989: 5, 1990: 6, 1995: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['개척정신', '확장', '도전']
      },
      {
        kanji: '健太',
        reading: 'けんた',
        gender: 'M',
        yearlyRanks: { 1988: 5, 1989: 4, 1990: 3, 1991: 3, 1992: 4, 1993: 5, 1995: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['건강함', '활기', '생명력']
      },
      {
        kanji: '大樹',
        reading: 'だいき',
        gender: 'M',
        yearlyRanks: { 1990: 7, 1991: 6, 1992: 5, 1993: 6, 1994: 7, 1995: 8, 2000: 10 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['웅대함', '자연적', '성장']
      },
      {
        kanji: '裕太',
        reading: 'ゆうた',
        gender: 'M',
        yearlyRanks: { 1990: 5, 1991: 4, 1992: 3, 1993: 4, 1994: 5, 1995: 6, 2000: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['여유로움', '관대함', '넓음']
      },

      // === 남성 이름 - 1990년대-2000년대 (헤이세이 전성기) ===
      {
        kanji: '大翔',
        reading: 'ひろと',
        gender: 'M',
        yearlyRanks: { 1995: 2, 1996: 1, 1997: 1, 1998: 2, 1999: 3, 2000: 4, 2005: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['웅대함', '비상', '자유']
      },
      {
        kanji: '蓮',
        reading: 'れん',
        gender: 'M',
        yearlyRanks: { 1995: 3, 1996: 2, 1997: 3, 1998: 4, 1999: 5, 2000: 6, 2005: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자연적', '순수함', '불교적']
      },
      {
        kanji: '海斗',
        reading: 'かいと',
        gender: 'M',
        yearlyRanks: { 1998: 5, 1999: 4, 2000: 3, 2001: 3, 2002: 4, 2003: 5, 2005: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자연적', '역동적', '광활함']
      },
      {
        kanji: '翼',
        reading: 'つばさ',
        gender: 'M',
        yearlyRanks: { 2000: 7, 2001: 6, 2002: 5, 2003: 6, 2004: 7, 2005: 8, 2010: 10 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자유로움', '비상', '꿈']
      },
      {
        kanji: '颯太',
        reading: 'そうた',
        gender: 'M',
        yearlyRanks: { 2000: 5, 2001: 4, 2002: 3, 2003: 4, 2004: 5, 2005: 6, 2010: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['시원함', '활기', '바람']
      },

      // === 남성 이름 - 2000년대-2010년대 (헤이세이 중후기) ===
      {
        kanji: '陽翔',
        reading: 'はると',
        gender: 'M',
        yearlyRanks: { 2005: 2, 2006: 1, 2007: 1, 2008: 1, 2009: 2, 2010: 3, 2015: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['밝음', '비상', '햇살']
      },
      {
        kanji: '遥斗',
        reading: 'はると',
        gender: 'M',
        yearlyRanks: { 2003: 8, 2004: 5, 2005: 4, 2006: 3, 2007: 4, 2008: 6, 2010: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['멀리', '별', '우주적']
      },
      {
        kanji: '春斗',
        reading: 'はると',
        gender: 'M',
        yearlyRanks: { 2000: 12, 2001: 10, 2002: 8, 2003: 6, 2004: 7, 2005: 8, 2010: 15 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['봄', '별', '시작']
      },
      {
        kanji: '悠人',
        reading: 'はると',
        gender: 'M',
        yearlyRanks: { 1998: 15, 1999: 12, 2000: 9, 2001: 7, 2002: 6, 2003: 8, 2005: 11 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['여유', '사람', '평화']
      },
      {
        kanji: '晴人',
        reading: 'はると',
        gender: 'M',
        yearlyRanks: { 1995: 18, 1996: 15, 1997: 12, 1998: 10, 1999: 9, 2000: 10, 2002: 13 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['맑음', '사람', '쾌활']
      },
      {
        kanji: '湊',
        reading: 'みなと',
        gender: 'M',
        yearlyRanks: { 2005: 3, 2006: 2, 2007: 2, 2008: 3, 2009: 4, 2010: 5, 2015: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['만남', '소통', '항구']
      },
      {
        kanji: '寛',
        reading: 'ひろし',
        gender: 'M',
        yearlyRanks: { 1960: 5, 1965: 7, 1970: 6, 1975: 8, 1980: 12, 1985: 15 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['너그러움', '관대함', '포용']
      },
      {
        kanji: '浩',
        reading: 'ひろし',
        gender: 'M',
        yearlyRanks: { 1965: 4, 1970: 3, 1975: 5, 1980: 7, 1985: 9, 1990: 12 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['넓음', '물', '풍부함']
      },
      {
        kanji: '大輝',
        reading: 'ひろき',
        gender: 'M',
        yearlyRanks: { 1990: 5, 1995: 3, 1996: 4, 1997: 5, 1998: 6, 1999: 7, 2000: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['큰', '빛남', '찬란함']
      },
      {
        kanji: '寛人',
        reading: 'ひろと',
        gender: 'M',
        yearlyRanks: { 2000: 14, 2001: 11, 2002: 9, 2003: 10, 2004: 12, 2005: 13 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['너그러운', '사람', '관용']
      },
      {
        kanji: '悠真',
        reading: 'ゆうま',
        gender: 'M',
        yearlyRanks: { 2008: 4, 2009: 3, 2010: 2, 2011: 2, 2012: 3, 2013: 4, 2015: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['여유로움', '진실함', '평온']
      },
      {
        kanji: '結翔',
        reading: 'ゆいと',
        gender: 'M',
        yearlyRanks: { 2010: 6, 2011: 5, 2012: 4, 2013: 3, 2014: 4, 2015: 5, 2020: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['연결', '비상', '결합']
      },
      {
        kanji: '碧',
        reading: 'あお',
        gender: 'M',
        yearlyRanks: { 2010: 8, 2011: 7, 2012: 6, 2013: 5, 2014: 6, 2015: 7, 2020: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자연적', '신선함', '푸름']
      },

      // === 남성 이름 - 2010년대-2020년대 (헤이세이 말~레이와) ===
      {
        kanji: '蒼',
        reading: 'あおい',
        gender: 'M',
        yearlyRanks: { 2015: 2, 2016: 1, 2017: 1, 2018: 2, 2019: 3, 2020: 4, 2024: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자연적', '청량함', '푸름']
      },
      {
        kanji: '律',
        reading: 'りつ',
        gender: 'M',
        yearlyRanks: { 2015: 4, 2016: 3, 2017: 3, 2018: 4, 2019: 5, 2020: 6, 2024: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['질서', '규칙성', '조율']
      },
      {
        kanji: '樹',
        reading: 'いつき',
        gender: 'M',
        yearlyRanks: { 2018: 5, 2019: 4, 2020: 3, 2021: 3, 2022: 4, 2023: 5, 2024: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자연적', '성장', '나무']
      },
      {
        kanji: '凪',
        reading: 'なぎ',
        gender: 'M',
        yearlyRanks: { 2020: 7, 2021: 6, 2022: 5, 2023: 4, 2024: 3 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['고요함', '평온', '바람없음']
      },
      {
        kanji: '新',
        reading: 'あらた',
        gender: 'M',
        yearlyRanks: { 2020: 5, 2021: 4, 2022: 3, 2023: 3, 2024: 4 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['새로움', '혁신', '시작']
      },

      // === 여성 이름 - 1950년대-1960년대 (전후 복구기) ===
      {
        kanji: '和子',
        reading: 'かずこ',
        gender: 'F',
        yearlyRanks: { 1950: 1, 1955: 2, 1960: 3, 1965: 5 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '평화', '조화']
      },
      {
        kanji: '恵',
        reading: 'めぐみ',
        gender: 'F',
        yearlyRanks: { 1960: 1, 1961: 1, 1962: 2, 1963: 3, 1964: 4, 1965: 5, 1970: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['은혜', '자비', '축복']
      },
      {
        kanji: '洋子',
        reading: 'ようこ',
        gender: 'F',
        yearlyRanks: { 1960: 4, 1961: 3, 1962: 2, 1963: 2, 1964: 3, 1965: 4, 1970: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['서구적', '개방적', '바다']
      },
      {
        kanji: '真理',
        reading: 'まり',
        gender: 'F',
        yearlyRanks: { 1960: 6, 1961: 5, 1962: 4, 1963: 4, 1964: 5, 1965: 6, 1970: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['진리', '이성적', '철학적']
      },
      {
        kanji: '愛',
        reading: 'あい',
        gender: 'F',
        yearlyRanks: { 1965: 5, 1966: 4, 1967: 3, 1968: 3, 1969: 4, 1970: 5, 1975: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['사랑', '애정', '인간성']
      },
      {
        kanji: '花子',
        reading: 'はなこ',
        gender: 'F',
        yearlyRanks: { 1950: 3, 1955: 4, 1960: 6, 1965: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '꽃', '클래식']
      },
      {
        kanji: '桜',
        reading: 'さくら',
        gender: 'F',
        yearlyRanks: { 1955: 5, 1960: 7, 1965: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['벚꽃', '일본적', '봄']
      },

      // === 여성 이름 - 1960년대-1970년대 (고도성장기) ===
      {
        kanji: '直美',
        reading: 'なおみ',
        gender: 'F',
        yearlyRanks: { 1965: 2, 1966: 1, 1967: 1, 1968: 1, 1969: 2, 1970: 3, 1975: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['정직함', '아름다움', '순수']
      },
      {
        kanji: '美紀',
        reading: 'みき',
        gender: 'F',
        yearlyRanks: { 1968: 5, 1970: 4, 1972: 5, 1975: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['아름다움', '기록', '역사']
      },
      {
        kanji: '久美子',
        reading: 'くみこ',
        gender: 'F',
        yearlyRanks: { 1968: 6, 1970: 6, 1972: 7, 1975: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['지속성', '아름다움', '전통적']
      },
      {
        kanji: '典子',
        reading: 'のりこ',
        gender: 'F',
        yearlyRanks: { 1965: 7, 1968: 7, 1970: 8, 1975: 10 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '모범', '규범']
      },

      // === 여성 이름 - 1970년대-1980년대 (안정성장기) ===
      {
        kanji: '恵子',
        reading: 'けいこ',
        gender: 'F',
        yearlyRanks: { 1975: 2, 1976: 1, 1977: 1, 1978: 2, 1979: 3, 1980: 4, 1985: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['은혜', '전통적', '자비로움']
      },
      {
        kanji: '由美',
        reading: 'ゆみ',
        gender: 'F',
        yearlyRanks: { 1975: 3, 1976: 2, 1977: 2, 1978: 3, 1979: 4, 1980: 5, 1985: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자유로움', '아름다움', '활']
      },
      {
        kanji: '真由美',
        reading: 'まゆみ',
        gender: 'F',
        yearlyRanks: { 1978: 4, 1979: 3, 1980: 2, 1981: 2, 1982: 3, 1983: 4, 1985: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['진실함', '아름다움', '진정성']
      },
      {
        kanji: '智子',
        reading: 'ともこ',
        gender: 'F',
        yearlyRanks: { 1980: 6, 1981: 5, 1982: 4, 1983: 3, 1984: 4, 1985: 5, 1990: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['지혜', '현명함', '학문']
      },
      {
        kanji: '裕子',
        reading: 'ゆうこ',
        gender: 'F',
        yearlyRanks: { 1982: 5, 1983: 4, 1984: 3, 1985: 2, 1986: 3, 1987: 4, 1990: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['여유로움', '관대함', '넉넉함']
      },

      // === 여성 이름 - 1980년대-1990년대 (버블경기~헤이세이 초기) ===
      {
        kanji: '美咲',
        reading: 'みさき',
        gender: 'F',
        yearlyRanks: { 1985: 3, 1986: 2, 1987: 1, 1988: 1, 1989: 2, 1990: 3, 1995: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['아름다움', '개화', '꽃피움']
      },
      {
        kanji: '愛美',
        reading: 'まなみ',
        gender: 'F',
        yearlyRanks: { 1985: 4, 1986: 3, 1987: 2, 1988: 3, 1989: 4, 1990: 5, 1995: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['사랑', '아름다움', '애정']
      },
      {
        kanji: '彩',
        reading: 'あや',
        gender: 'F',
        yearlyRanks: { 1988: 5, 1989: 4, 1990: 4, 1991: 3, 1992: 4, 1993: 5, 1995: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['색채', '화려함', '다채로움']
      },
      {
        kanji: '香織',
        reading: 'かおり',
        gender: 'F',
        yearlyRanks: { 1990: 6, 1991: 5, 1992: 5, 1993: 6, 1994: 7, 1995: 8, 2000: 10 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['향기', '우아함', '직조']
      },
      {
        kanji: '舞',
        reading: 'まい',
        gender: 'F',
        yearlyRanks: { 1990: 7, 1991: 6, 1992: 6, 1993: 7, 1994: 8, 1995: 9, 2000: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['춤', '우아함', '예술적']
      },

      // === 여성 이름 - 1990년대-2000년대 (헤이세이 전성기) ===
      {
        kanji: '結愛',
        reading: 'ゆあ',
        gender: 'F',
        yearlyRanks: { 1995: 2, 1996: 1, 1997: 1, 1998: 2, 1999: 3, 2000: 4, 2005: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['결합', '사랑', '연결']
      },
      {
        kanji: '七海',
        reading: 'ななみ',
        gender: 'F',
        yearlyRanks: { 1995: 3, 1996: 2, 1997: 2, 1998: 3, 1999: 4, 2000: 5, 2005: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['바다', '넓음', '자연적']
      },
      {
        kanji: '遥',
        reading: 'はるか',
        gender: 'F',
        yearlyRanks: { 1998: 4, 1999: 3, 2000: 2, 2001: 2, 2002: 3, 2003: 4, 2005: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['멀리', '이상향', '꿈']
      },
      {
        kanji: '花',
        reading: 'はな',
        gender: 'F',
        yearlyRanks: { 2000: 6, 2001: 5, 2002: 4, 2003: 3, 2004: 4, 2005: 5, 2010: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['꽃', '자연적', '아름다움']
      },
      {
        kanji: '心',
        reading: 'こころ',
        gender: 'F',
        yearlyRanks: { 2000: 8, 2001: 7, 2002: 6, 2003: 5, 2004: 6, 2005: 7, 2010: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['마음', '감성', '내면']
      },

      // === 여성 이름 - 2000년대-2010년대 (헤이세이 중후기) ===
      {
        kanji: '葵',
        reading: 'あおい',
        gender: 'F',
        yearlyRanks: { 2005: 2, 2006: 1, 2007: 1, 2008: 1, 2009: 2, 2010: 3, 2015: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자연적', '향기', '꽃']
      },
      {
        kanji: '陽菜',
        reading: 'ひな',
        gender: 'F',
        yearlyRanks: { 2005: 3, 2006: 2, 2007: 2, 2008: 3, 2009: 4, 2010: 5, 2015: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['햇살', '자연적', '채소']
      },
      {
        kanji: '凛',
        reading: 'りん',
        gender: 'F',
        yearlyRanks: { 2008: 4, 2009: 3, 2010: 2, 2011: 2, 2012: 3, 2013: 4, 2015: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['당당함', '기품', '차가운 아름다움']
      },
      {
        kanji: '咲良',
        reading: 'さくら',
        gender: 'F',
        yearlyRanks: { 2010: 6, 2011: 5, 2012: 4, 2013: 3, 2014: 4, 2015: 5, 2020: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['꽃', '일본적', '벚꽃']
      },
      {
        kanji: '音',
        reading: 'おと',
        gender: 'F',
        yearlyRanks: { 2010: 8, 2011: 7, 2012: 6, 2013: 5, 2014: 6, 2015: 7, 2020: 9 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['음악', '감성', '소리']
      },

      // === 여성 이름 - 2010년대-2020년대 (헤이세이 말~레이와) ===
      {
        kanji: '紬',
        reading: 'つむぎ',
        gender: 'F',
        yearlyRanks: { 2015: 2, 2016: 1, 2017: 1, 2018: 2, 2019: 3, 2020: 4, 2024: 7 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['전통적', '수공예', '직조']
      },
      {
        kanji: '陽葵',
        reading: 'ひまり',
        gender: 'F',
        yearlyRanks: { 2015: 4, 2016: 3, 2017: 3, 2018: 4, 2019: 5, 2020: 6, 2024: 8 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['햇살', '자연적', '해바라기']
      },
      {
        kanji: '芽',
        reading: 'めい',
        gender: 'F',
        yearlyRanks: { 2018: 5, 2019: 4, 2020: 3, 2021: 3, 2022: 4, 2023: 5, 2024: 6 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['새싹', '성장', '희망']
      },
      {
        kanji: '莉子',
        reading: 'りこ',
        gender: 'F',
        yearlyRanks: { 2020: 7, 2021: 6, 2022: 5, 2023: 4, 2024: 3 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['자연적', '우아함', '꽃']
      },
      {
        kanji: '奏',
        reading: 'かなで',
        gender: 'F',
        yearlyRanks: { 2020: 5, 2021: 4, 2022: 3, 2023: 3, 2024: 4 },
        source: 'MeijiYasuda_HistoricalData',
        characteristics: ['음악', '조화', '연주']
      }
    ];

    // Korean names data - 시대별 정확한 한국 이름 데이터
    const koreanNames: KoreanNameData[] = [
      // === 1950년대-1960년대 (한국전쟁 이후 복구기) ===
      // 남성 이름
      {
        name: '영수',
        gender: 'M',
        yearlyRanks: { 1955: 1, 1960: 2, 1965: 4 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['전통적', '영원', '보수'],
        peakYear: 1955,
        era: '전후복구기'
      },
      {
        name: '영호',
        gender: 'M',
        yearlyRanks: { 1955: 2, 1960: 3, 1965: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['전통적', '영원', '호수'],
        peakYear: 1955,
        era: '전후복구기'
      },
      {
        name: '정수',
        gender: 'M',
        yearlyRanks: { 1958: 3, 1962: 4, 1965: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['정의', '깨끗함', '전통적'],
        peakYear: 1958,
        era: '전후복구기'
      },
      {
        name: '순호',
        gender: 'M',
        yearlyRanks: { 1955: 4, 1960: 5, 1965: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['순수함', '전통적', '호수'],
        peakYear: 1955,
        era: '전후복구기'
      },
      {
        name: '성호',
        gender: 'M',
        yearlyRanks: { 1952: 3, 1955: 5, 1960: 6, 1965: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['성스러움', '호수', '전통적'],
        peakYear: 1952,
        era: '전후복구기'
      },
      
      // 여성 이름
      {
        name: '영희',
        gender: 'F',
        yearlyRanks: { 1950: 1, 1955: 1, 1960: 2, 1965: 4 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['전통적', '영원', '기쁨'],
        peakYear: 1952,
        era: '전후복구기'
      },
      {
        name: '순자',
        gender: 'F',
        yearlyRanks: { 1950: 2, 1955: 3, 1960: 4, 1965: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['전통적', '순수함', '자식'],
        peakYear: 1950,
        era: '전후복구기'
      },
      {
        name: '정희',
        gender: 'F',
        yearlyRanks: { 1955: 2, 1960: 3, 1965: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['정의', '기쁨', '전통적'],
        peakYear: 1955,
        era: '전후복구기'
      },
      {
        name: '미자',
        gender: 'F',
        yearlyRanks: { 1958: 3, 1962: 4, 1965: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['아름다움', '자식', '전통적'],
        peakYear: 1958,
        era: '전후복구기'
      },

      // === 1960년대-1970년대 (고도성장기) ===
      // 남성 이름
      {
        name: '현수',
        gender: 'M',
        yearlyRanks: { 1965: 1, 1968: 2, 1970: 3, 1975: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['현명함', '보수', '지혜'],
        peakYear: 1965,
        era: '고도성장기'
      },
      {
        name: '동수',
        gender: 'M',
        yearlyRanks: { 1965: 2, 1968: 3, 1970: 4, 1975: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['동쪽', '보수', '새로움'],
        peakYear: 1965,
        era: '고도성장기'
      },
      {
        name: '진수',
        gender: 'M',
        yearlyRanks: { 1968: 1, 1970: 2, 1972: 3, 1975: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['진실', '보수', '귀중함'],
        peakYear: 1968,
        era: '고도성장기'
      },
      {
        name: '상호',
        gender: 'M',
        yearlyRanks: { 1968: 4, 1970: 5, 1972: 6, 1975: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['상서로움', '호수', '길함'],
        peakYear: 1968,
        era: '고도성장기'
      },
      
      // 여성 이름
      {
        name: '미경',
        gender: 'F',
        yearlyRanks: { 1965: 1, 1968: 2, 1970: 3, 1975: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['아름다움', '경치', '여성적'],
        peakYear: 1965,
        era: '고도성장기'
      },
      {
        name: '은주',
        gender: 'F',
        yearlyRanks: { 1968: 1, 1970: 2, 1972: 3, 1975: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['은혜', '구슬', '귀중함'],
        peakYear: 1968,
        era: '고도성장기'
      },
      {
        name: '명숙',
        gender: 'F',
        yearlyRanks: { 1965: 2, 1968: 3, 1970: 4, 1975: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['밝음', '숙녀', '품격'],
        peakYear: 1965,
        era: '고도성장기'
      },
      {
        name: '경숙',
        gender: 'F',
        yearlyRanks: { 1968: 4, 1970: 5, 1972: 6, 1975: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['경치', '숙녀', '아름다움'],
        peakYear: 1968,
        era: '고도성장기'
      },

      // === 1970년대-1980년대 (산업화 발전기) ===
      // 남성 이름
      {
        name: '성민',
        gender: 'M',
        yearlyRanks: { 1975: 1, 1978: 2, 1980: 3, 1985: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['성스러움', '백성', '민중'],
        peakYear: 1975,
        era: '산업화발전기'
      },
      {
        name: '지훈',
        gender: 'M',
        yearlyRanks: { 1975: 2, 1978: 3, 1980: 4, 1985: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['지혜', '가르침', '학문'],
        peakYear: 1975,
        era: '산업화발전기'
      },
      {
        name: '동훈',
        gender: 'M',
        yearlyRanks: { 1978: 1, 1980: 2, 1982: 3, 1985: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['동쪽', '가르침', '새로움'],
        peakYear: 1978,
        era: '산업화발전기'
      },
      {
        name: '영훈',
        gender: 'M',
        yearlyRanks: { 1975: 3, 1978: 4, 1980: 5, 1985: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['영원', '가르침', '전통적'],
        peakYear: 1975,
        era: '산업화발전기'
      },
      
      // 여성 이름
      {
        name: '미숙',
        gender: 'F',
        yearlyRanks: { 1975: 1, 1978: 2, 1980: 3, 1985: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['아름다움', '숙녀', '여성적'],
        peakYear: 1975,
        era: '산업화발전기'
      },
      {
        name: '영미',
        gender: 'F',
        yearlyRanks: { 1975: 2, 1978: 3, 1980: 4, 1985: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['영원', '아름다움', '전통적'],
        peakYear: 1975,
        era: '산업화발전기'
      },
      {
        name: '정미',
        gender: 'F',
        yearlyRanks: { 1978: 1, 1980: 2, 1982: 3, 1985: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['정의', '아름다움', '올바름'],
        peakYear: 1978,
        era: '산업화발전기'
      },
      {
        name: '선미',
        gender: 'F',
        yearlyRanks: { 1975: 3, 1978: 4, 1980: 5, 1985: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['선량', '아름다움', '착함'],
        peakYear: 1975,
        era: '산업화발전기'
      },

      // === 1980년대-1990년대 (민주화 시대) ===
      // 남성 이름
      {
        name: '준영',
        gender: 'M',
        yearlyRanks: { 1985: 1, 1988: 2, 1990: 3, 1995: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['준수함', '영원', '잘생김'],
        peakYear: 1985,
        era: '민주화시대'
      },
      {
        name: '현우',
        gender: 'M',
        yearlyRanks: { 1985: 2, 1988: 3, 1990: 4, 1995: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['현명함', '우주', '지혜'],
        peakYear: 1985,
        era: '민주화시대'
      },
      {
        name: '지현',
        gender: 'M',
        yearlyRanks: { 1988: 1, 1990: 2, 1992: 3, 1995: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['지혜', '현명함', '학문'],
        peakYear: 1988,
        era: '민주화시대'
      },
      {
        name: '성준',
        gender: 'M',
        yearlyRanks: { 1985: 3, 1988: 4, 1990: 5, 1995: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['성스러움', '준수함', '완성'],
        peakYear: 1985,
        era: '민주화시대'
      },
      
      // 여성 이름
      {
        name: '지은',
        gender: 'F',
        yearlyRanks: { 1985: 1, 1988: 2, 1990: 3, 1995: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['지혜', '은혜', '학문'],
        peakYear: 1985,
        era: '민주화시대'
      },
      {
        name: '수진',
        gender: 'F',
        yearlyRanks: { 1985: 2, 1988: 3, 1990: 4, 1995: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['물', '진실', '순수'],
        peakYear: 1985,
        era: '민주화시대'
      },
      {
        name: '혜진',
        gender: 'F',
        yearlyRanks: { 1988: 1, 1990: 2, 1992: 3, 1995: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['혜택', '진실', '은혜'],
        peakYear: 1988,
        era: '민주화시대'
      },
      {
        name: '미진',
        gender: 'F',
        yearlyRanks: { 1985: 3, 1988: 4, 1990: 5, 1995: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['아름다움', '진실', '여성적'],
        peakYear: 1985,
        era: '민주화시대'
      },

      // === 1990년대-2000년대 (세계화 시대) ===
      // 남성 이름
      {
        name: '민준',
        gender: 'M',
        yearlyRanks: { 1995: 1, 1998: 2, 2000: 3, 2005: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['백성', '준수함', '민중'],
        peakYear: 1995,
        era: '세계화시대'
      },
      {
        name: '지훈',  
        gender: 'M',
        yearlyRanks: { 1995: 2, 1998: 3, 2000: 4, 2005: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['지혜', '가르침', '학문'],
        peakYear: 1995,
        era: '세계화시대'
      },
      {
        name: '현민',
        gender: 'M',
        yearlyRanks: { 1998: 1, 2000: 2, 2002: 3, 2005: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['현명함', '백성', '지혜'],
        peakYear: 1998,
        era: '세계화시대'
      },
      {
        name: '준호',
        gender: 'M',
        yearlyRanks: { 1995: 3, 1998: 4, 2000: 5, 2005: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['준수함', '호수', '잘생김'],
        peakYear: 1995,
        era: '세계화시대'
      },
      
      // 여성 이름
      {
        name: '지혜',
        gender: 'F',
        yearlyRanks: { 1995: 1, 1998: 2, 2000: 3, 2005: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['지혜', '혜택', '학문'],
        peakYear: 1995,
        era: '세계화시대'
      },
      {
        name: '서현',
        gender: 'F',
        yearlyRanks: { 1995: 2, 1998: 3, 2000: 4, 2005: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['서쪽', '현명함', '새로움'],
        peakYear: 1995,
        era: '세계화시대'
      },
      {
        name: '민지',
        gender: 'F',
        yearlyRanks: { 1998: 1, 2000: 2, 2002: 3, 2005: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['백성', '지혜', '민중'],
        peakYear: 1998,
        era: '세계화시대'
      },
      {
        name: '지민',
        gender: 'F',
        yearlyRanks: { 1995: 3, 1998: 4, 2000: 5, 2005: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['지혜', '백성', '학문'],
        peakYear: 1995,
        era: '세계화시대'
      },

      // === 2000년대-2010년대 (디지털 혁명 시대) ===
      // 남성 이름
      {
        name: '시우',
        gender: 'M',
        yearlyRanks: { 2005: 1, 2008: 2, 2010: 3, 2015: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['시작', '우주', '새로운'],
        peakYear: 2005,
        era: '디지털혁명시대'
      },
      {
        name: '도윤',
        gender: 'M',
        yearlyRanks: { 2005: 2, 2008: 3, 2010: 4, 2015: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['도', '윤리', '모던'],
        peakYear: 2005,
        era: '디지털혁명시대'
      },
      {
        name: '건우',
        gender: 'M',
        yearlyRanks: { 2008: 1, 2010: 2, 2012: 3, 2015: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['건강', '우주', '활력'],
        peakYear: 2008,
        era: '디지털혁명시대'
      },
      {
        name: '현준',
        gender: 'M',
        yearlyRanks: { 2005: 3, 2008: 4, 2010: 5, 2015: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['현명함', '준수함', '지혜'],
        peakYear: 2005,
        era: '디지털혁명시대'
      },
      
      // 여성 이름
      {
        name: '서연',
        gender: 'F',
        yearlyRanks: { 2005: 1, 2008: 2, 2010: 3, 2015: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['서쪽', '연결', '새로움'],
        peakYear: 2005,
        era: '디지털혁명시대'
      },
      {
        name: '지유',
        gender: 'F',
        yearlyRanks: { 2005: 2, 2008: 3, 2010: 4, 2015: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['지혜', '자유', '학문'],
        peakYear: 2005,
        era: '디지털혁명시대'
      },
      {
        name: '예은',
        gender: 'F',
        yearlyRanks: { 2008: 1, 2010: 2, 2012: 3, 2015: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['예쁨', '은혜', '아름다움'],
        peakYear: 2008,
        era: '디지털혁명시대'
      },
      {
        name: '채원',
        gender: 'F',
        yearlyRanks: { 2005: 3, 2008: 4, 2010: 5, 2015: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['채우다', '원', '풍부'],
        peakYear: 2005,
        era: '디지털혁명시대'
      },

      // === 2010년대-2020년대 (K-문화 시대) ===
      // 남성 이름
      {
        name: '하율',
        gender: 'M',
        yearlyRanks: { 2015: 1, 2018: 2, 2020: 3, 2024: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['하늘', '율리', '높음'],
        peakYear: 2015,
        era: 'K문화시대'
      },
      {
        name: '이준',
        gender: 'M',
        yearlyRanks: { 2015: 2, 2018: 3, 2020: 4, 2024: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['이', '준수함', '모던'],
        peakYear: 2015,
        era: 'K문화시대'
      },
      {
        name: '윤우',
        gender: 'M',
        yearlyRanks: { 2018: 1, 2020: 2, 2022: 3, 2024: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['윤리', '우주', '도덕'],
        peakYear: 2018,
        era: 'K문화시대'
      },
      {
        name: '지한',
        gender: 'M',
        yearlyRanks: { 2015: 3, 2018: 4, 2020: 5, 2024: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['지혜', '한국', '학문'],
        peakYear: 2015,
        era: 'K문화시대'
      },
      
      // 여성 이름
      {
        name: '하린',
        gender: 'F',
        yearlyRanks: { 2015: 1, 2018: 2, 2020: 3, 2024: 6 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['하늘', '숲', '높음'],
        peakYear: 2015,
        era: 'K문화시대'
      },
      {
        name: '시은',
        gender: 'F',
        yearlyRanks: { 2015: 2, 2018: 3, 2020: 4, 2024: 7 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['시작', '은혜', '새로운'],
        peakYear: 2015,
        era: 'K문화시대'
      },
      {
        name: '서하',
        gender: 'F',
        yearlyRanks: { 2018: 1, 2020: 2, 2022: 3, 2024: 5 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['서쪽', '하늘', '새로움'],
        peakYear: 2018,
        era: 'K문화시대'
      },
      {
        name: '윤서',
        gender: 'F',
        yearlyRanks: { 2015: 3, 2018: 4, 2020: 5, 2024: 8 },
        source: 'KoreanStatistics_HistoricalData',
        characteristics: ['윤리', '서쪽', '도덕'],
        peakYear: 2015,
        era: 'K문화시대'
      }
    ];

    // Store all names in database
    console.log(`Storing ${japaneseNames.length} Japanese names in database...`);
    await kv.set('japanese_names', japaneseNames);
    
    console.log(`Storing ${koreanNames.length} Korean names in database...`);
    await kv.set('korean_names', koreanNames);
    
    // Verify data was stored correctly
    const storedJapanese = await kv.get('japanese_names');
    const storedKorean = await kv.get('korean_names');
    
    console.log(`Verification: ${storedJapanese?.length || 0} Japanese names and ${storedKorean?.length || 0} Korean names stored`);
    console.log('Sample Japanese names:', storedJapanese?.slice(0, 3).map(n => ({ kanji: n.kanji, reading: n.reading })));
    
    console.log(`Successfully initialized database with ${japaneseNames.length} Japanese names and ${koreanNames.length} Korean names`);
    
    return c.json({ 
      success: true, 
      message: 'Database initialized successfully',
      counts: {
        japanese: japaneseNames.length,
        korean: koreanNames.length
      }
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Search Japanese names
app.get("/make-server-c15330c1/search-japanese-names", async (c) => {
  try {
    const query = c.req.query('q');
    console.log(`Search request for: "${query}"`);
    
    if (!query) {
      console.log('Empty query, returning empty results');
      return c.json({ names: [] });
    }

    const japaneseNames = await kv.get('japanese_names') || [];
    console.log(`Database contains ${japaneseNames.length} Japanese names`);
    
    if (japaneseNames.length === 0) {
      console.log('No Japanese names in database, initializing...');
      // If no names in database, try to initialize
      // This shouldn't happen if init was successful, but just in case
      return c.json({ names: [], error: 'Database not initialized' });
    }
    
    const searchQuery = query.toLowerCase().trim();
    
    // Convert romaji to hiragana for better matching
    const hiraganaQuery = romajiToHiragana(searchQuery);
    const romajiQuery = searchQuery;
    
    console.log(`Original query: "${query}"`);
    console.log(`Lowercase query: "${searchQuery}"`);
    console.log(`Hiragana conversion: "${hiraganaQuery}"`);
    
    // Enhanced search logic with romaji support
    const results = japaneseNames.filter((name: JapaneseNameData) => {
      // Exact matches
      const kanjiExact = name.kanji === query || name.kanji === searchQuery;
      const readingExact = name.reading === query || name.reading === searchQuery || name.reading === hiraganaQuery;
      
      // Contains matches
      const kanjiContains = name.kanji.toLowerCase().includes(searchQuery);
      const readingContains = name.reading.includes(searchQuery) || name.reading.includes(hiraganaQuery);
      
      // Romaji matches - convert hiragana to romaji and check
      const nameRomaji = hiraganaToRomaji(name.reading);
      const romajiExact = nameRomaji === romajiQuery;
      const romajiContains = nameRomaji.includes(romajiQuery);
      
      // Partial matches (for "h" finding "haruto" etc)
      const romajiStartsWith = nameRomaji.startsWith(romajiQuery);
      const hiraganaStartsWith = name.reading.startsWith(hiraganaQuery);
      
      console.log(`Checking name ${name.kanji} (${name.reading} / ${nameRomaji}):`, {
        kanjiExact, readingExact, kanjiContains, readingContains, 
        romajiExact, romajiContains, romajiStartsWith, hiraganaStartsWith
      });
      
      return kanjiExact || readingExact || kanjiContains || readingContains || 
             romajiExact || romajiContains || romajiStartsWith || hiraganaStartsWith;
    });

    // Sort results by relevance (exact matches first)
    results.sort((a, b) => {
      const aExactKanji = a.kanji === query;
      const bExactKanji = b.kanji === query;
      const aExactReading = a.reading === query;
      const bExactReading = b.reading === query;
      
      if (aExactKanji && !bExactKanji) return -1;
      if (!aExactKanji && bExactKanji) return 1;
      if (aExactReading && !bExactReading) return -1;
      if (!aExactReading && bExactReading) return 1;
      
      return 0;
    });

    console.log(`Search for "${query}" returned ${results.length} results`);
    console.log('First few results:', results.slice(0, 3).map(r => ({ kanji: r.kanji, reading: r.reading })));
    
    return c.json({ names: results });
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Debug endpoint for testing search functionality
app.get("/make-server-c15330c1/debug-search", async (c) => {
  try {
    const query = c.req.query('q') || 'haruto';
    console.log(`Debug search for: "${query}"`);
    
    const japaneseNames = await kv.get('japanese_names') || [];
    console.log(`Database contains ${japaneseNames.length} names`);
    
    const searchQuery = query.toLowerCase().trim();
    const hiraganaQuery = romajiToHiragana(searchQuery);
    const romajiQuery = searchQuery;
    
    const debugInfo = {
      originalQuery: query,
      searchQuery,
      hiraganaQuery,
      romajiQuery,
      databaseCount: japaneseNames.length,
      sampleNames: japaneseNames.slice(0, 5).map(n => ({
        kanji: n.kanji,
        reading: n.reading,
        romaji: hiraganaToRomaji(n.reading)
      })),
      harutoCandidates: japaneseNames.filter(name => {
        const nameRomaji = hiraganaToRomaji(name.reading);
        return nameRomaji.includes('haruto') || name.reading.includes('はると') || name.kanji.includes('陽翔');
      }).map(n => ({
        kanji: n.kanji,
        reading: n.reading,
        romaji: hiraganaToRomaji(n.reading)
      })),
      hStartingNames: japaneseNames.filter(name => {
        const nameRomaji = hiraganaToRomaji(name.reading);
        return nameRomaji.startsWith('h');
      }).map(n => ({
        kanji: n.kanji,
        reading: n.reading,
        romaji: hiraganaToRomaji(n.reading)
      }))
    };
    
    console.log('Debug info:', debugInfo);
    return c.json(debugInfo);
  } catch (error) {
    console.error('Debug search error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all Japanese names
app.get("/make-server-c15330c1/japanese-names", async (c) => {
  try {
    const japaneseNames = await kv.get('japanese_names') || [];
    
    return c.json({ names: japaneseNames });
  } catch (error) {
    console.error('Get all names error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get Korean recommendations
app.post("/make-server-c15330c1/korean-recommendations", async (c) => {
  try {
    const { japaneseName } = await c.req.json();
    
    if (!japaneseName) {
      return c.json({ recommendations: [] });
    }

    const koreanNames = await kv.get('korean_names') || [];
    
    // Get Japanese name's peak year
    const japaneseYears = Object.keys(japaneseName.yearlyRanks).map(Number);
    const japanesePeakYear = japaneseYears.reduce((peak, year) => {
      return japaneseName.yearlyRanks[year] < japaneseName.yearlyRanks[peak] ? year : peak;
    }, japaneseYears[0]);

    // Find Korean names from similar era
    const recommendations = koreanNames
      .filter((koreanName: KoreanNameData) => {
        // Match gender
        if (koreanName.gender !== japaneseName.gender) return false;
        
        // Check if Korean name was popular in similar time period
        const koreanYears = Object.keys(koreanName.yearlyRanks).map(Number);
        const timeDifference = Math.abs(japanesePeakYear - (koreanName.peakYear || koreanYears[0]));
        
        // Allow 10-year difference for era matching
        return timeDifference <= 10;
      })
      .sort((a: KoreanNameData, b: KoreanNameData) => {
        // Sort by peak rank (lower is better)
        const aPeakRank = Math.min(...Object.values(a.yearlyRanks));
        const bPeakRank = Math.min(...Object.values(b.yearlyRanks));
        return aPeakRank - bPeakRank;
      })
      .slice(0, 10); // Top 10 recommendations

    console.log(`Found ${recommendations.length} Korean recommendations for ${japaneseName.kanji}`);
    
    return c.json({ recommendations });
  } catch (error) {
    console.error('Korean recommendations error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get similar Japanese names
app.post("/make-server-c15330c1/similar-japanese-names", async (c) => {
  try {
    const { targetName } = await c.req.json();
    
    if (!targetName) {
      return c.json({ similarNames: [] });
    }

    const japaneseNames = await kv.get('japanese_names') || [];
    const target = japaneseNames.find((name: JapaneseNameData) => name.kanji === targetName);
    
    if (!target) {
      return c.json({ similarNames: [] });
    }

    // Find similar names
    const similarNames = japaneseNames
      .filter((name: JapaneseNameData) => {
        if (name.kanji === target.kanji) return false; // Exclude the target itself
        if (name.gender !== target.gender) return false; // Same gender only
        
        // Check for shared characteristics
        const sharedCharacteristics = name.characteristics?.filter(char => 
          target.characteristics?.includes(char)
        ) || [];
        
        if (sharedCharacteristics.length > 0) {
          name.similarityReason = `공통 특성: ${sharedCharacteristics.join(', ')}`;
          return true;
        }
        
        // Check for similar kanji
        if (name.kanji.includes(target.kanji[0]) || target.kanji.includes(name.kanji[0])) {
          name.similarityReason = `유사한 한자 사용`;
          return true;
        }
        
        // Check for similar era (within 10 years)
        const targetPeakYear = Object.keys(target.yearlyRanks)
          .map(Number)
          .reduce((peak, year) => target.yearlyRanks[year] < target.yearlyRanks[peak] ? year : peak);
        
        const namePeakYear = Object.keys(name.yearlyRanks)
          .map(Number)
          .reduce((peak, year) => name.yearlyRanks[year] < name.yearlyRanks[peak] ? year : peak);
        
        if (Math.abs(targetPeakYear - namePeakYear) <= 10) {
          name.similarityReason = `같은 시대 (${Math.floor(namePeakYear/10)*10}년대)`;
          return true;
        }
        
        return false;
      })
      .slice(0, 8); // Top 8 similar names

    console.log(`Found ${similarNames.length} similar names for ${targetName}`);
    
    return c.json({ similarNames });
  } catch (error) {
    console.error('Similar names error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);