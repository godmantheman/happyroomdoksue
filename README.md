# 독서탑 노트

책 제목과 짧은 메모를 층층이 쌓는 독서탑 사이트입니다.  
이 프로젝트는 Next.js 기반이라 GitHub에 올린 뒤 Vercel에 바로 연결할 수 있고, Postgres 데이터베이스를 붙이면 기록이 실제 DB에 저장됩니다.

## 기술 스택

- Next.js App Router
- React
- Postgres (`postgres` 드라이버)
- Vercel 배포

## 로컬 실행

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 파일 생성

```bash
cp .env.example .env.local
```

3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 을 열면 됩니다.

## 데이터베이스 연결

이 앱은 아래 환경 변수 중 하나가 있으면 Postgres를 사용합니다.

- `DATABASE_URL`
- `POSTGRES_URL`

연결이 없으면 임시 메모리 모드로 동작합니다.  
즉, 화면 테스트는 가능하지만 서버가 재시작되면 데이터가 사라집니다.

### 테이블 만들기

DB 콘솔에서 [`db/schema.sql`](./db/schema.sql)을 실행하세요.

## GitHub -> Vercel 배포

1. GitHub 저장소를 만듭니다.
2. 이 폴더를 커밋해서 GitHub에 푸시합니다.
3. Vercel에서 `New Project`를 눌러 해당 GitHub 저장소를 가져옵니다.
4. Framework Preset은 `Next.js`로 자동 인식됩니다.
5. Vercel Marketplace에서 Postgres 제공자(예: Neon)를 연결합니다.
6. 프로젝트 환경 변수에 `DATABASE_URL` 또는 `POSTGRES_URL`이 들어왔는지 확인합니다.
7. 다시 배포하면 독서 기록이 DB에 저장됩니다.

## 참고

Vercel 공식 문서 기준으로, 기존 `Vercel Postgres`는 2025년 7월 22일 기준 더 이상 신규 사용용으로 제공되지 않고 Marketplace 기반 Postgres 연동을 사용합니다.  
새 프로젝트는 Vercel Marketplace에서 Neon, Supabase, Aurora Postgres 같은 Postgres 제공자를 연결하는 방식이 맞습니다.
