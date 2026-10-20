# 블로그 실행과 배포

Node.js 24, pnpm 11.1.1을 사용합니다. 버전은 루트 `.nvmrc`와 `packageManager`에 있고, 의존성은 루트 `pnpm-lock.yaml` 하나로 설치합니다.

```sh
pnpm install --frozen-lockfile
pnpm --filter @apps/client run dev
```

로컬 주소는 http://localhost:3000 입니다. API 서버나 Notion 키는 필요하지 않습니다.

## 글 관리

글 하나는 `apps/client/content/posts/<slug>.mdx` 파일입니다. `<slug>`는 주소가 되며 소문자, 숫자, 하이픈만 쓸 수 있습니다. 발행 주소는 `/posts/<slug>/` 입니다. 예시 글은 저장소에 넣지 않습니다. 파일이 없어도 빌드는 성공합니다. 소개 문구는 공개 전에 확인하세요.

````mdx
---
title: 글 제목
description: 목록과 검색, RSS, 소셜 카드에 보이는 한 줄 설명
publishedAt: 2026-10-20
category: 프론트엔드
tags:
  - react
  - nextjs
featured: false
---

도입 문단입니다.

## 첫 절

본문입니다. `##` 제목은 목차에 들어갑니다.

```ts caption="예시"
export const answer = 42;
```
````

- `title`, `description`, `publishedAt`, `category`, `tags`는 필수입니다.
- `category`는 주제 필터 값입니다.
- `publishedAt`은 `YYYY-MM-DD`입니다. 목록은 이 날짜의 최신순이고, 같은 날이면 slug 오름차순입니다.
- `tags`는 문자열 목록입니다. 비어 있어도 됩니다.
- `featured`는 선택이며 기본값은 `false`입니다. 화면에는 쓰지 않습니다.
- 날짜 표기는 `YYYY.MM.DD`로 만들고, 읽는 시간은 공백을 뺀 500자당 1분으로 계산합니다. 최소 1분입니다.
- 이전 글은 더 오래된 글, 다음 글은 더 최근 글입니다. 글 링크는 끝에 슬래시를 붙입니다.
- 본문은 Markdown입니다. 코드 블록 정보 문자열에 `caption="설명"`을 붙이면 캡션이 표시됩니다.
- 글 안 링크와 이미지는 `/posts/<slug>`, `/images/file.png`처럼 사이트 루트 기준으로 씁니다. 배포 경로 `/me`는 빌드가 붙입니다.

검색은 제목·설명·본문·코드·태그를 포함합니다. 공백으로 구분한 검색어는 모두 일치해야 하며, 여러 태그는 하나라도 일치하면 됩니다. 검색어/주제/태그 간에는 AND 조건입니다. 필터 상태는 URL에 저장됩니다.

## GitHub Pages

이 블로그는 정적 HTML로 빌드되어 별도 서버 없이 배포됩니다. RSS와 사이트맵도 빌드 시 생성됩니다. 공개 사이트는 https://leejunyeolkor.github.io/me/ 입니다. 글이나 사이트를 바꾼 뒤에는 `main`에 머지하고, 배포 워크플로가 성공해야 그 주소에 반영됩니다.

1. 작업 브랜치에 변경 내용을 커밋하고 푸시한 뒤, PR을 통해 `main`에 머지합니다.
2. 저장소 Settings → Pages → Source는 GitHub Actions입니다.
3. `main`에 푸시되면 Deploy blog to GitHub Pages 워크플로가 자동으로 실행됩니다. Actions 탭에서 같은 워크플로를 Run workflow로 수동 실행할 수도 있습니다.
4. 워크플로가 성공하면 https://leejunyeolkor.github.io/me/ 에서 확인합니다.

겹치는 배포는 `pages` 동시성 그룹에서 한 번에 하나만 진행됩니다. 이미 진행 중인 배포는 취소하지 않고 끝내며, 나중에 시작된 배포는 그다음 차례에 실행됩니다.

```sh
NEXT_PUBLIC_BASE_PATH=/me NEXT_PUBLIC_SITE_URL=https://leejunyeolkor.github.io/me pnpm --filter @apps/client run build
pnpm --filter @apps/client run typecheck
```

배포 산출물은 `apps/client/out`입니다. 커스텀 도메인 루트에 배포할 경우 워크플로의 `NEXT_PUBLIC_BASE_PATH`를 빈 문자열로, `NEXT_PUBLIC_SITE_URL`을 해당 HTTPS 도메인으로 변경합니다.
