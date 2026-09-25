@AGENTS.md

# WashOn Frontend — Claude 작업 규칙

Next.js 16 (App Router) + React 19 + TypeScript, CSS Modules. 백엔드는 별도 저장소(laundry-status-backend, Spring Boot)다.

## 코드 규칙

- Next.js API는 학습 데이터와 다를 수 있다. 코드를 쓰기 전에 `AGENTS.md`의 안내대로 `node_modules/next/dist/docs/`를 확인한다.
- 라우트는 `app/` 아래 App Router 규칙을 따른다: 학생 뷰 `app/room/[roomId]`, 관리자 `app/admin`.
- 스타일은 해당 라우트 옆의 `*.module.css`로 작성한다.
- API 주소는 `process.env.NEXT_PUBLIC_API_URL` (기본 `http://localhost:8081`)로만 참조하고 하드코딩하지 않는다.
- 관리자 API 호출은 세션 쿠키를 쓰므로 `credentials: "include"`를 유지한다.
- 백엔드 API 계약(경로, 요청/응답 필드)을 프론트에서 임의로 바꾸지 않는다. 변경이 필요하면 백엔드 저장소 변경이 먼저임을 사용자에게 알린다.
- `.env.local` 등 env 파일은 커밋하지 않는다.

## 검증

- 변경 후 `npm run typecheck`와 `npm run build`가 통과해야 한다 (별도 테스트 스위트 없음).

## 로컬 환경 / 프로세스

- 사용 포트: 프론트 `3000` (백엔드 `8081`, MariaDB `3307`, Redis `6379`).
- **이 프로젝트와 무관한 프로세스는 절대 종료하지 않는다.**
- **필요한 포트가 이미 사용 중이면 프로세스를 죽이거나 포트를 임의로 바꾸지 말고, 사용 중인 프로세스 정보와 함께 사용자에게 알린다.**
