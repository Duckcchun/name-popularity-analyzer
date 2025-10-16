import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Search, TrendingUp, Users, Calendar, ArrowRight, Heart, Link, Database, Loader2 } from 'lucide-react';
import { NameTrendChart } from './components/NameTrendChart';
import { GenerationAnalysis } from './components/GenerationAnalysis';
import { KoreanNameRecommendations } from './components/KoreanNameRecommendations';
import { generateComment } from './lib/commentGenerator';
import { projectId, publicAnonKey } from './utils/supabase/info';

// API 호출 함수들
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c15330c1`;

async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}

async function checkDatabaseStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/japanese-names`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Database check failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      status: 'ok',
      count: data.names?.length || 0,
      sampleNames: data.names?.slice(0, 5) || []
    };
  } catch (error) {
    console.error('Database check error:', error);
    throw error;
  }
}

async function initializeDatabase() {
  console.log('Initializing database with URL:', `${API_BASE_URL}/init-database`);
  
  const response = await fetch(`${API_BASE_URL}/init-database`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Database init response status:', response.status);
  console.log('Database init response ok:', response.ok);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Database init error response:', errorText);
    throw new Error(`Database initialization failed: ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('Database init result:', result);
  return result;
}

async function searchJapaneseNames(query: string) {
  console.log('Searching for:', query);
  console.log('Search URL:', `${API_BASE_URL}/search-japanese-names?q=${encodeURIComponent(query)}`);
  
  const response = await fetch(`${API_BASE_URL}/search-japanese-names?q=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  });
  
  console.log('Search response status:', response.status);
  console.log('Search response ok:', response.ok);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Search error response:', errorText);
    throw new Error(`Search failed: ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log('Search result data:', data);
  return data.names || [];
}

async function getAllJapaneseNames() {
  const response = await fetch(`${API_BASE_URL}/japanese-names`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get names: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.names || [];
}

async function getKoreanRecommendations(japaneseName: any) {
  const response = await fetch(`${API_BASE_URL}/korean-recommendations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ japaneseName })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get recommendations: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.recommendations || [];
}

async function getSimilarJapaneseNames(targetName: string) {
  const response = await fetch(`${API_BASE_URL}/similar-japanese-names`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ targetName })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get similar names: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.similarNames || [];
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [similarNames, setSimilarNames] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbStats, setDbStats] = useState({ japanese: 0, korean: 0 });
  const [error, setError] = useState('');

  // 데이터베이스 초기화
  useEffect(() => {
    async function initDb() {
      try {
        setIsLoading(true);
        setError('');
        console.log('Initializing database with comprehensive data...');
        console.log('API_BASE_URL:', API_BASE_URL);
        console.log('projectId:', projectId);
        console.log('publicAnonKey:', publicAnonKey ? 'Present' : 'Missing');
        
        // 먼저 서버 상태 확인
        console.log('Checking server health...');
        const healthCheck = await checkServerHealth();
        console.log('Server health check result:', healthCheck);
        
        const result = await initializeDatabase();
        console.log('Database initialization result:', result);
        setDbStats(result.counts || { japanese: 0, korean: 0 });
        
        // 데이터베이스에 실제로 데이터가 들어갔는지 확인
        console.log('Verifying database contents...');
        const dbStatus = await checkDatabaseStatus();
        console.log('Database status:', dbStatus);
        
        if (dbStatus.count === 0) {
          console.warn('Database appears to be empty, this might cause search issues');
          setError('데이터베이스가 비어있습니다. 새로고침을 시도해보세요.');
        }
        
        setIsDbInitialized(true);
      } catch (error) {
        console.error('Database initialization error:', error);
        setError(`연결 실패: ${error.message}`);
        // 데이터베이스 초기화가 실패해도 기본 기능은 사용할 수 있도록
        setIsDbInitialized(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    initDb();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      setError('');
      const results = await searchJapaneseNames(searchQuery);
      setSearchResults(results);
      setSearchSuggestions([]); // 검색 후 제안 숨기기
      
      if (results.length > 0) {
        const firstResult = results[0];
        setSelectedName(firstResult);
        
        // 한국 이름 추천 가져오기
        const koreanRecommendations = await getKoreanRecommendations(firstResult);
        setRecommendations(koreanRecommendations);
        
        // 관련 일본 이름들 가져오기
        const relatedNames = await getSimilarJapaneseNames(firstResult.kanji);
        setSimilarNames(relatedNames);
      } else {
        // 검색 결과가 없을 때 상태 초기화
        setSelectedName(null);
        setRecommendations([]);
        setSimilarNames([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(`검색 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNameSelect = async (name) => {
    try {
      setIsLoading(true);
      setSelectedName(name);
      
      const koreanRecommendations = await getKoreanRecommendations(name);
      setRecommendations(koreanRecommendations);
      
      // 관련 이름들도 가져오기
      const relatedNames = await getSimilarJapaneseNames(name.kanji);
      setSimilarNames(relatedNames);
    } catch (error) {
      console.error('Name selection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // 실시간 검색 제안
    if (value.trim().length > 0) {
      try {
        const suggestions = await searchJapaneseNames(value);
        setSearchSuggestions(suggestions.slice(0, 5));
      } catch (error) {
        console.error('Suggestion error:', error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchQuery(suggestion.kanji);
    setSearchSuggestions([]);
    
    try {
      setIsLoading(true);
      const results = await searchJapaneseNames(suggestion.kanji);
      setSearchResults(results);
      
      if (results.length > 0) {
        const firstResult = results[0];
        setSelectedName(firstResult);
        const koreanRecommendations = await getKoreanRecommendations(firstResult);
        setRecommendations(koreanRecommendations);
        const relatedNames = await getSimilarJapaneseNames(firstResult.kanji);
        setSimilarNames(relatedNames);
      }
    } catch (error) {
      console.error('Suggestion click error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllNamesClick = async () => {
    try {
      setIsLoading(true);
      const allNames = await getAllJapaneseNames();
      setSearchResults(allNames.slice(0, 20)); // 처음 20개만 표시
      setSearchQuery('');
    } catch (error) {
      console.error('Get all names error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDbInitialized && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <Database className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-lg font-medium">데이터베이스 초기화 중...</span>
            </div>
            <p className="text-sm text-gray-600">
              정확한 일본-한국 이름 데이터를 로딩하고 있습니다
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            일본 이름 → 한국 이름 추천
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            일본 이름의 시대적 감성을 분석해서 비슷한 느낌의 한국 이름을 추천해드립니다
          </p>
          {isDbInitialized && dbStats.japanese > 0 && (
            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-green-600">
              <Database className="h-4 w-4" />
              <span>데이터베이스 연동 완료 ({dbStats.japanese + dbStats.korean}개 이름 데이터)</span>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <details className="cursor-pointer">
              <summary>연결 정보 (디버깅용)</summary>
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-left">
                <p>API URL: {API_BASE_URL}</p>
                <p>Project ID: {projectId}</p>
                <p>Auth Key: {publicAnonKey ? '설정됨' : '누락'}</p>
                <p>현재 URL: {window.location.href}</p>
              </div>
            </details>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dbStats.japanese || 300}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">일본 이름 데이터</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{dbStats.korean || 300}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">한국 이름 매칭</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">75년</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">분석 기간 (1950-2024)</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">일본 시대 (쇼와/헤이세이/레이와)</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              일본 이름 검색
            </CardTitle>
            <CardDescription>
              한자, 히라가나, 또는 로마자로 일본 이름을 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="예: 翔太, はると, 紬, haruto, makoto"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full"
                  disabled={isLoading}
                />
                
                {/* 검색 제안 드롭다운 */}
                {searchSuggestions.length > 0 && searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{suggestion.kanji}</span>
                          <span className="text-sm text-gray-500">({suggestion.reading})</span>
                          <Badge variant={suggestion.gender === 'M' ? 'default' : 'secondary'} className="text-xs">
                            {suggestion.gender === 'M' ? '남' : '여'}
                          </Badge>
                        </div>
                        {suggestion.characteristics && suggestion.characteristics.length > 0 && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {suggestion.characteristics.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleSearch} className="px-6" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '검색'}
              </Button>
            </div>
            
            {/* 인기 이름 예시 */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                인기 일본 이름으로 시도해보세요:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">현재 인기 (2020년대)</p>
                  <div className="flex flex-wrap gap-1">
                    {['陽翔', '紬', '湊'].map(name => (
                      <Badge 
                        key={name}
                        variant="outline" 
                        className="cursor-pointer text-xs hover:bg-blue-50"
                        onClick={() => setSearchQuery(name)}
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">2000년대</p>
                  <div className="flex flex-wrap gap-1">
                    {['大翔', '蓮', '結愛'].map(name => (
                      <Badge 
                        key={name}
                        variant="outline" 
                        className="cursor-pointer text-xs hover:bg-blue-50"
                        onClick={() => setSearchQuery(name)}
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">1990년대</p>
                  <div className="flex flex-wrap gap-1">
                    {['翔太', '大輝', '美咲'].map(name => (
                      <Badge 
                        key={name}
                        variant="outline" 
                        className="cursor-pointer text-xs hover:bg-blue-50"
                        onClick={() => setSearchQuery(name)}
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">1970-80년대</p>
                  <div className="flex flex-wrap gap-1">
                    {['誠', '直美', '愛'].map(name => (
                      <Badge 
                        key={name}
                        variant="outline" 
                        className="cursor-pointer text-xs hover:bg-blue-50"
                        onClick={() => setSearchQuery(name)}
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  검색 결과: {searchResults.length}개
                </p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {searchResults.map((name, index) => (
                    <Badge
                      key={index}
                      variant={selectedName?.kanji === name.kanji ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handleNameSelect(name)}
                    >
                      <span className="font-medium">{name.kanji}</span>
                      <span className="ml-1 text-xs opacity-75">({name.reading})</span>
                      {name.characteristics && (
                        <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">
                          {name.characteristics[0]}
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span>⚠️ {error}</span>
              </div>
              <div className="mt-2 text-sm text-red-500">
                <p>• 브라우저 개발자 도구(F12)의 콘솔 탭에서 자세한 에러 정보를 확인할 수 있습니다</p>
                <p>• 페이지를 새로고침하여 다시 시도해보세요</p>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      setError('');
                      setIsLoading(true);
                      const health = await checkServerHealth();
                      console.log('Manual health check:', health);
                      alert('서버 연결 성공! 콘솔을 확인해주세요.');
                    } catch (error) {
                      console.error('Manual health check failed:', error);
                      setError(`서버 연결 테스트 실패: ${error.message}`);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  서버 연결 테스트
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      setError('');
                      setIsLoading(true);
                      setSearchQuery('翔太');
                      const results = await searchJapaneseNames('翔太');
                      console.log('Test search results:', results);
                      alert(`테스트 검색 완료! ${results.length}개 결과. 콘솔을 확인해주세요.`);
                    } catch (error) {
                      console.error('Test search failed:', error);
                      setError(`테스트 검색 실패: ${error.message}`);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  테스트 검색 (翔太)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      setError('');
                      setIsLoading(true);
                      const response = await fetch(`${API_BASE_URL}/debug-search?q=haruto`, {
                        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
                      });
                      const debugInfo = await response.json();
                      console.log('Haruto debug info:', debugInfo);
                      alert(`Haruto 디버그 완료! 콘솔을 확인해주세요. 후보: ${debugInfo.harutoCandidates?.length}개`);
                    } catch (error) {
                      console.error('Debug search failed:', error);
                      setError(`디버그 검색 실패: ${error.message}`);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  Haruto 디버그
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      setError('');
                      setIsLoading(true);
                      const dbStatus = await checkDatabaseStatus();
                      console.log('Manual database check:', dbStatus);
                      alert(`데이터베이스 상태: ${dbStatus.count}개 이름 확인됨. 콘솔을 확인해주세요.`);
                    } catch (error) {
                      console.error('Manual database check failed:', error);
                      setError(`데이터베이스 확인 실패: ${error.message}`);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  DB 상태 확인
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  새로고침
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>데이터를 불러오는 중...</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {selectedName && (
          <div className="space-y-8">
            {/* Japanese Name Analysis */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedName.kanji}</span>
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      ({selectedName.reading})
                    </span>
                  </div>
                  <Badge variant={selectedName.gender === 'M' ? 'default' : 'secondary'}>
                    {selectedName.gender === 'M' ? '남성' : '여성'}명
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg leading-relaxed">
                  {generateComment(selectedName)}
                </div>
              </CardContent>
            </Card>

            {/* Similar Names Section */}
            {similarNames.length > 0 && (
              <Card className="shadow-lg border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-green-500" />
                    관련 일본 이름
                  </CardTitle>
                  <CardDescription>
                    {selectedName.kanji}와 비슷한 특성을 가진 다른 일본 이름들입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {similarNames.map((name, index) => (
                      <div 
                        key={index}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => handleNameSelect(name)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-lg">{name.kanji}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({name.reading})
                            </span>
                            <Badge variant={name.gender === 'M' ? 'default' : 'secondary'} className="text-xs">
                              {name.gender === 'M' ? '남' : '여'}
                            </Badge>
                          </div>
                        </div>
                        
                        {name.similarityReason && (
                          <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                            유사점: {name.similarityReason}
                          </div>
                        )}
                        
                        {name.characteristics && (
                          <div className="flex flex-wrap gap-1">
                            {name.characteristics.slice(0, 3).map((char, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {char}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      💡 관련 이름을 클릭하면 해당 이름의 분석과 한국 이름 추천을 볼 수 있습니다
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Korean Name Recommendations */}
            {recommendations.length > 0 && (
              <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    추천 한국 이름
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                  <CardDescription>
                    {selectedName.kanji}와 비슷한 시대적 감성을 가진 한국 이름들입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KoreanNameRecommendations 
                    recommendations={recommendations}
                    japaneseNameData={selectedName}
                  />
                </CardContent>
              </Card>
            )}

            {/* Trend Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  일본에서의 연도별 인기 추이
                </CardTitle>
                <CardDescription>
                  순위 변화 추이 (1위가 최고값)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NameTrendChart nameData={selectedName} />
              </CardContent>
            </Card>

            {/* Generation Analysis */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  일본 세대 분석
                </CardTitle>
                <CardDescription>
                  어떤 일본 세대에 가장 인기가 있었는지 분석
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GenerationAnalysis nameData={selectedName} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Empty State */}
        {searchResults.length === 0 && searchQuery && !isLoading && (
          <Card className="py-12">
            <CardContent className="text-center space-y-6">
              <div>
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  "{searchQuery}"를 찾을 수 없습니다
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  다른 검색어를 시도해보거나 아래 제안을 참고해주세요
                </p>
              </div>

              {/* 검색 팁 */}
              <div className="max-w-2xl mx-auto text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">검색 팝</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• 한자로 검색: 翔太, 美咲, 蓮</li>
                  <li>• 히라가나로 검색: はると, みさき, れん</li>
                  <li>• 로마자로 검색: haruto, misaki, ren</li>
                  <li>• 부분 검색도 가능합니다 (예: 翔, 美)</li>
                </ul>
              </div>

              {/* 인기 이름 추천 */}
              <div>
                <h4 className="font-medium mb-4">인기 일본 이름으로 시도해보세요</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['陽翔', '湊', '蓮', '紬', '陽葵', '結愛', '翔太', '大翔', '美咲', '愛', '誠', '直美'].map(name => (
                    <Badge 
                      key={name}
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      onClick={async () => {
                        setSearchQuery(name);
                        try {
                          setIsLoading(true);
                          const results = await searchJapaneseNames(name);
                          setSearchResults(results);
                          if (results.length > 0) {
                            const firstResult = results[0];
                            setSelectedName(firstResult);
                            const koreanRecommendations = await getKoreanRecommendations(firstResult);
                            setRecommendations(koreanRecommendations);
                            const relatedNames = await getSimilarJapaneseNames(firstResult.kanji);
                            setSimilarNames(relatedNames);
                          }
                        } catch (error) {
                          console.error('Popular name click error:', error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 전체 이름 목록 버튼 */}
              <div>
                <Button 
                  variant="outline" 
                  onClick={handleAllNamesClick}
                  disabled={isLoading}
                >
                  <Users className="h-4 w-4 mr-2" />
                  전체 이름 목록 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}