# Search Console

공개 주소는 아직 `https://leejunyeolkor.github.io/me/` 입니다. 이 주소는 GitHub 하위 경로라서, Search Console에서는 **URL 접두어** 속성만 만들 수 있습니다. `github.io` 도메인 속성은 DNS TXT가 필요한데, 그 도메인은 준열 소유가 아닙니다. 도메인 속성은 커스텀 도메인을 연결한 뒤에 만듭니다. 절차는 `docs/custom-domain.md`입니다.

사이트맵과 `robots.txt`는 빌드될 때 만들어집니다. 주소의 출발점은 `NEXT_PUBLIC_SITE_URL` 하나이고, 기본값은 `https://leejunyeolkor.github.io/me` 입니다.

## 1. URL 접두어 속성 만들기

1. [Google Search Console](https://search.google.com/search-console)에 준열 Google 계정으로 로그인합니다.
2. 속성 추가에서 **URL 접두어**를 고릅니다.
3. 주소에 `https://leejunyeolkor.github.io/me/` 를 그대로 넣습니다. 마지막 슬래시까지 포함합니다.
4. 도메인 속성은 고르지 않습니다.

## 2. 소유권 확인

확인 방법은 메타 태그 또는 HTML 파일입니다. DNS 확인은 이 주소에서 쓸 수 없습니다.

### 메타 태그

1. Search Console이 보여주는 `google-site-verification` 메타 태그에서 `content` 값만 복사합니다. 태그 전체는 넣지 않습니다.
2. GitHub 저장소 **Settings → Secrets and variables → Actions → Variables**에서 `GOOGLE_SITE_VERIFICATION`을 만들고 그 토큰을 넣습니다. Secret이 아닙니다. 이 값은 공개 HTML에 들어갑니다.
3. `main`에 머지하거나 Actions에서 **Deploy blog to GitHub Pages**를 실행해 다시 배포합니다. 환경 변수는 빌드 시에만 반영됩니다.
4. `https://leejunyeolkor.github.io/me/` 페이지 소스에 `name="google-site-verification"` 메타가 보이는지 확인합니다. 변수가 비어 있으면 이 메타는 나오지 않습니다.
5. Search Console에서 확인을 누릅니다.

### HTML 파일

1. Search Console이 내려 주는 HTML 파일을 `apps/client/public/`에 넣습니다. 파일 이름을 바꾸지 않습니다.
2. 그 파일을 커밋하고 `main`에 배포합니다.
3. 확인 주소는 `https://leejunyeolkor.github.io/me/파일명.html` 입니다. `public/` 파일은 사이트 루트, 즉 `/me/` 아래에 올라갑니다.
4. 브라우저에서 그 주소가 열리는지 본 다음 Search Console에서 확인을 누릅니다.

## 3. 사이트맵 제출

1. 속성 → 색인 생성 → Sitemaps.
2. `https://leejunyeolkor.github.io/me/sitemap.xml` 을 제출합니다.
3. `https://leejunyeolkor.github.io/me/robots.txt` 의 `Sitemap:` 줄이 같은 주소인지 봅니다.

사이트맵에는 홈, 소개, 노트, 개인정보처리방침, `/category/dev/`, `/category/food/`, `/category/life/`, 그리고 `draft`가 아닌 글이 들어갑니다. 픽스처와 `draft: true` 글은 빠집니다.

## 4. 색인 확인

URL 검사에 홈과 카테고리 주소를 넣어 봅니다. 발행된 글이 생기면 `/posts/<slug>/` 도 검사합니다. 페이지 소스의 `lang`은 `ko`이고, canonical과 Open Graph 주소는 `https://leejunyeolkor.github.io/me/...` 입니다.

맛집 글을 발행한 뒤에는 [리치 검색결과 테스트](https://search.google.com/test/rich-results)에 그 글 주소를 넣습니다. 글에는 `BlogPosting`이 있고, `restaurant`가 있는 맛집 글에는 `Review`와 `Restaurant`가 더 있습니다. 별점, 상호, 동네, 가격대, 구조화된 영업시간, 작성자(이준열)가 들어갑니다. 문장으로만 적은 영업시간은 화면에는 나오고 `openingHours`에는 넣지 않습니다. 식당의 총점은 넣지 않습니다. Google은 사업자가 자기 매장을 직접 평가한 리뷰 스니펫을 허용하지 않습니다. 이 블로그의 작성자는 식당과 별개인 리뷰어입니다.

## 5. 커스텀 도메인으로 옮긴 뒤

1. `docs/custom-domain.md`대로 도메인을 연결하고 다시 배포합니다.
2. 새 URL 접두어 속성(`https://도메인/`)을 추가하거나, 그 도메인의 DNS TXT로 **도메인** 속성을 만듭니다.
3. 새 사이트맵 `https://도메인/sitemap.xml` 을 제출합니다.
4. 도메인 속성에서 다른 도메인으로 옮길 때만 Search Console 주소 변경 도구를 쓸 수 있습니다. `github.io` URL 접두어에는 그 도구가 없습니다. 새 속성에 사이트맵을 제출하고, 예전 속성은 리다이렉트가 확인될 때까지 남겨 둡니다.

## AdSense를 켜기 전에

신청은 준열 Google 계정에서 직접 합니다. 이 저장소는 광고 코드를 넣지 않습니다.

- 콘텐츠가 있어야 합니다. 지금은 발행된 글이 없습니다. 픽스처는 테스트용이라 배포되지 않습니다.
- 보통 커스텀 도메인이 필요합니다. `ads.txt`는 등록할 사이트 루트에 있어야 합니다. `https://leejunyeolkor.github.io/ads.txt` 는 이 저장소가 아니라 사용자 사이트(`leejunyeolkor.github.io` 저장소) 영역이라 여기서 만들 수 없습니다.
- 커스텀 도메인을 연결한 뒤 `apps/client/public/ads.txt`에 코드를 넣으면 `https://도메인/ads.txt` 로 제공됩니다.
- 개인정보처리방침 초안은 `/privacy/` 입니다. 광고를 켜면 Google이 쿠키를 쓸 수 있으므로, 신청 전에 그 페이지 문장을 실제 내용으로 고칩니다.
