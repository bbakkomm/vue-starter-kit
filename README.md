# Vue 스타터 킷

Vue 3와 Vite 기반의 회사 프런트엔드 스타터 킷입니다. 공통 UI는 shadcn-vue와 Tailwind CSS v3를 사용하고 기본 글꼴은 Pretendard입니다.

## 로컬 실행

Node.js `24.15.0`에서 의존성을 설치합니다.

```powershell
npm ci
Copy-Item .env.example .env.local
```

`.env.local`의 `VITE_API_BASE_URL`에 개발 API 주소를 지정합니다. 값을 비워두면 Axios가 Vite의 앱 기본 경로를 사용합니다. 홈과 공통 레이아웃은 API 주소 설정 전에도 확인할 수 있습니다.

```powershell
npm run dev
```

## 패키지 예제

개발 서버에서 사이드바의 **패키지 예제**를 선택하거나 `/examples`를 엽니다.

- MSW와 Faker로 만든 팀원 목록을 Axios와 Vue Query로 조회합니다. **오류 응답**을 켜면 목록의 오류 상태를 확인할 수 있습니다.
- 이름, 이메일, 소속 팀을 입력해 VeeValidate·Zod 검증과 등록 후 목록 갱신을 확인합니다.
- 목록 검색에는 VueUse의 디바운스가 적용됩니다. **모션 재생**은 GSAP으로 행을 표시하며, 운영체제의 모션 감소 설정을 따릅니다.
- 데스크톱 사이드바를 접고 새로고침하면 Pinia에 저장한 설정이 복원됩니다.

예제의 팀원 데이터는 브라우저 메모리에 있으며 새로고침하면 초기화됩니다. 모의 API는 예제 화면에서 시작합니다. MSW 버전을 올릴 때는 `npx msw init public --save`로 서비스 워커 파일도 갱신합니다.

## 빌드와 검사

```powershell
npm run build
npm run lint
```

빌드 결과는 `dist/`에 생성되며 `npm run preview`로 확인할 수 있습니다. History 라우팅을 사용하므로 배포 서버는 화면 URL을 직접 열거나 새로고침할 때 `index.html`을 제공하도록 설정합니다. `npm run lint`는 수정 가능한 항목을 자동으로 고치며, `dev-front-sample/`은 검사 범위에서 제외합니다.

## 코드 위치

| 경로                         | 역할                                          |
| ---------------------------- | --------------------------------------------- |
| `src/pages/<영역>/`          | URL별 화면과 Vue Query 호출                   |
| `src/layouts/MainLayout.vue` | 상단바, 사이드바, 화면 본문                   |
| `src/router/routes.js`       | URL, lazy import, 화면 제목                   |
| `src/boot/set-page-title.js` | 라우트의 제목을 브라우저에 반영               |
| `src/api/client.js`          | 공통 Axios 인스턴스                           |
| `src/stores/`                | 사이드바 등 클라이언트 상태                   |
| `src/components/ui/`         | shadcn-vue 공용 컴포넌트                      |
| `src/css/app.css`            | Tailwind, 테마 토큰, 공통 스타일              |
| `src/fonts/<글꼴명>/`        | 글꼴별 원본 파일과 `@font-face` 선언          |
| `public/assets/`             | 고정 URL로 제공할 이미지, 아이콘 등 정적 파일 |

새 화면은 해당 영역의 `pages` 폴더에 만들고 `routes.js`에서 lazy import로 등록합니다. `meta.title`은 브라우저 제목에, `meta.label`은 상단바에 표시됩니다. `@/`는 `src/`를 가리킵니다.

글꼴은 `src/fonts/pretendard/`처럼 패밀리별 폴더에 파일과 CSS를 함께 두고, 사용할 글꼴의 CSS를 `src/css/app.css`에서 불러옵니다.
