# WashOn Frontend

카메라+OCR 기반 세탁기/건조기 실시간 상태 모니터링 시스템 **WashOn**의 웹 프론트엔드 (학생 세탁실 뷰 + 관리자 대시보드).

API 서버는 별도 저장소: [laundry-status-backend](https://github.com/kayoung-dev/laundry-status-backend)

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- 스타일: CSS Modules
- 실시간: 백엔드 SSE(`GET /rooms/{roomId}/stream`) 구독

## 화면

| 경로 | 설명 |
|---|---|
| `/room/[roomId]` | 학생용 세탁실 뷰. 기기 상태를 SSE로 실시간 표시. `?machine=<id>`로 특정 기기 하이라이트(QR 진입) |
| `/admin/login` | 관리자 로그인 |
| `/admin` | 관리자 대시보드 (상태 수동 지정/해제, 감사 로그, 확인 필요·카메라 다운 배지) |

## 로컬 실행

사전 요구사항: Node.js 20+, 실행 중인 백엔드(기본 `http://localhost:8081`)

```bash
npm install
npm run dev        # http://localhost:3000
```

`.env.local` (gitignore됨):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8081
```

백엔드 CORS는 기본적으로 `http://localhost:3000` 하나만 허용하며, 관리자 API는 세션 쿠키(`credentials: "include"`)를 사용한다. 다른 포트/도메인으로 띄우면 백엔드의 `WASHON_CORS_ALLOWED_ORIGIN`도 맞춰야 한다.

## Scripts

```bash
npm run dev         # 개발 서버
npm run typecheck   # tsc --noEmit
npm run build       # 프로덕션 빌드
npm run start       # 빌드 결과 실행
```

시드 데이터 기준 학생 뷰는 `http://localhost:3000/room/seed-room`. 상태별 테스트 절차는 백엔드 저장소의 `docs/TESTING.md` 참고.
