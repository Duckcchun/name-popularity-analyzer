
# 🎌🇰🇷 일본/한국 이름 트렌드 매처 (Name Trend Matcher)
> 일본 이름의 인기도를 분석하여 시대적 트렌드가 일치하는 한국 이름을 추천하고, 그 변화를 시각화하는 풀스택 웹 애플리케이션

**[🔗 Demo 바로가기](https://duckcchun.github.io/name-popularity-analyzer/)**

---
<br>

## 🔍 한줄 소개
일본 이름의 시대별 인기도 데이터를 분석하여 **가장 유사한 인기도 트렌드를 가진 한국 이름을 추천**하고, 그 변화를 시각화하는 Supabase 연동 풀스택 웹 애플리케이션입니다.

---
<br>

## 🧰 기술 스택
- **Language:** TypeScript
- **Framework:** React, Vite
- **Styling:** Tailwind CSS, Radix UI
- **Data Visualization:** Recharts
- **Database / Backend:** Supabase
- **Deployment:** GitHub Pages

---
<br>

## ✨ 주요 기능
- **이름 인기도 분석:** Supabase DB의 데이터를 기반으로 이름의 시대별 인기도 트렌드를 분석합니다.
- **유사 트렌드 이름 추천:** 분석된 인기도 분포와 가장 유사한 패턴을 가진 한국 이름을 매칭하여 추천합니다.
- **교차 시각화:** Recharts를 활용하여 양국 이름의 인기도 변화를 직관적인 차트로 비교/분석합니다.
- **정교한 UI:** Radix UI 기반의 다양한 컴포넌트(슬라이더, 탭, 팝오버 등)를 활용해 복잡한 데이터를 쉽게 탐색할 수 있습니다.

---
<br>

## 🚀 설치 및 실행 (로컬)

```bash
# 1. 저장소 클론
git clone [https://github.com/Duckcchun/name-popularity-analyzer.git](https://github.com/Duckcchun/name-popularity-analyzer.git)

# 2. 폴더 이동
cd name-popularity-analyzer

# 3. 의존성 설치
npm install

# 4. 개발 서버 실행
npm run dev
````

**환경변수 설정:**
프로젝트 루트에 `.env` 파일을 생성하고, Supabase에서 발급받은 **Project URL**과 **Anon Key**를 아래와 같이 추가해야 합니다.

```
VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

-----

<br>

## 📂 폴더 구조

```
/
├─ public/
├─ src/
│  ├─ components/  # 차트, UI 컴포넌트
│  │   └─ ui/      # Radix UI 기반 기본 컴포넌트
│  ├─ hooks/       # 데이터 fetching, 분석 로직 커스텀 훅
│  ├─ services/    # Supabase API 연동 로직
│  ├─ types/       # TypeScript 타입 정의
│  ├─ lib/         # utils 등 공통 함수
│  ├─ App.tsx      # 메인 애플리케이션 컴포넌트
│  └─ main.tsx     # 애플리케이션 진입점
├─ .gitignore
├─ package.json
└─ vite.config.ts
```

-----

<br>

## 📈 앞으로의 계획 (Roadmap)

  - [ ] **한국 -\> 일본 역방향** 추천 기능 추가
  - [ ] 이름 추천 **알고리즘 고도화** (유사도 측정 방식 개선)
  - [ ] **사용자 인증** 및 내가 찾은 이름 저장 기능 (개인화)

-----

<br>

## 📸 스크린샷

*(스크린샷 추가 예정)*

-----

<br>

## 📬 Contact

  - **GitHub:** [@Duckcchun](https://github.com/Duckcchun)
  - **Email:** (qasw1733@gmail.com)

