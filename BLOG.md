# 블로그 실행과 배포

Node.js 24, pnpm 11.1.1을 사용합니다.

```sh
pnpm --filter @apps/client install --frozen-lockfile
pnpm --filter @apps/client run dev
```

로컬 주소는 http://localhost:3000 입니다. API 서버나 Notion 키는 필요하지 않습니다.

## 글 관리

`apps/client/lib/posts.ts`에서 글과 태그, 주제, 본문을 관리합니다. 예시 글은 모두 삭제했으며 현재 등록된 글은 없습니다. 소개 문구는 공개 전에 확인하세요.

검색은 제목·설명·본문·코드·태그를 포함합니다. 공백으로 구분한 검색어는 모두 일치해야 하며, 여러 태그는 하나라도 일치하면 됩니다. 검색어/주제/태그 간에는 AND 조건입니다. 필터 상태는 URL에 저장됩니다.

## GitHub Pages

이 블로그는 정적 HTML로 빌드되어 별도 서버 없이 배포됩니다. RSS와 사이트맵도 빌드 시 생성됩니다. 글 변경 후 다시 빌드/배포해야 반영됩니다.

1. 작업 브랜치에 변경 내용을 커밋하고 푸시한 뒤, PR을 통해 기본 브랜치에 머지합니다.
2. 저장소 Settings → Pages → Source를 GitHub Actions로 설정합니다.
3. Actions → Deploy blog to GitHub Pages → Run workflow를 실행합니다.
4. 워크플로 성공 후 https://leejunyeolkor.github.io/me/ 에서 확인합니다.

워크플로는 수동 실행 방식이며 파일을 저장하거나 푸시하는 것만으로 배포되지 않습니다. 현재 세션에서는 공개 배포하지 않았습니다.

```sh
NEXT_PUBLIC_BASE_PATH=/me NEXT_PUBLIC_SITE_URL=https://leejunyeolkor.github.io/me pnpm --filter @apps/client run build
pnpm --filter @apps/client run typecheck
```

배포 산출물은 `apps/client/out`입니다. 커스텀 도메인 루트에 배포할 경우 워크플로의 `NEXT_PUBLIC_BASE_PATH`를 빈 문자열로, `NEXT_PUBLIC_SITE_URL`을 해당 HTTPS 도메인으로 변경합니다.
