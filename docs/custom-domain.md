# 커스텀 도메인

오늘은 `https://leejunyeolkor.github.io/me/` 로 배포됩니다. 도메인을 바꾸기 전에는 저장소 Variables를 비워 둡니다. 비어 있으면 워크플로가 지금 주소와 base path `/me`로 빌드합니다.

사이트 주소는 `NEXT_PUBLIC_SITE_URL`, base path는 `NEXT_PUBLIC_BASE_PATH` 입니다. 코드에 도메인을 적어 두지 않습니다. 배포 워크플로는 아래 Variables를 읽습니다.

| Variable                   | 비웠을 때                            | 커스텀 도메인                                                                     |
| -------------------------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| `SITE_URL`                 | `https://leejunyeolkor.github.io/me` | `https://도메인`. 비우면 `CUSTOM_DOMAIN`으로 `https://` 주소를 만듭니다           |
| `BASE_PATH`                | `/me`                                | 비웁니다. `/` 로 두면 루트입니다. `/me`와 함께 두면 도메인 아래 경로가 어긋납니다 |
| `CUSTOM_DOMAIN`            | CNAME 없음                           | `example.com` 또는 `www.example.com`. `https://`와 경로는 빼기                    |
| `GOOGLE_SITE_VERIFICATION` | 메타 태그 없음                       | 새 속성의 토큰으로 바꿉니다                                                       |

Variables는 **Settings → Secrets and variables → Actions → Variables** 입니다.

## 1. 대표 호스트를 정합니다

apex(`example.com`)와 `www`를 둘 다 DNS에 넣습니다. GitHub Pages의 Custom domain에 적은 쪽이 대표 주소이고, 다른 쪽은 그쪽으로 리다이렉트됩니다. `CUSTOM_DOMAIN`과 `SITE_URL`도 그 호스트와 같게 맞춥니다. 국제화 도메인은 Punycode로 넣습니다.

## 2. GitHub에서 도메인을 먼저 확인합니다

DNS를 이 저장소로 보내기 전에 확인하는 편이 안전합니다. 확인 없이 DNS만 바꾸면, 사이트가 꺼져 있는 동안 다른 사람이 그 호스트를 가져갈 수 있습니다.

GitHub Docs의 Verifying your custom domain for GitHub Pages를 따릅니다. 등록 기관에 GitHub가 안내하는 TXT를 넣고, GitHub 계정 설정에서 도메인을 확인합니다. 이 TXT는 Search Console용 TXT와 다릅니다.

## 3. 저장소 Variables를 넣습니다

1. `CUSTOM_DOMAIN`에 대표 호스트만 넣습니다. 예: `www.example.com`
2. `SITE_URL`은 비우거나 `https://www.example.com` 처럼 같은 호스트를 넣습니다. 끝 슬래시는 없어도 됩니다.
3. `BASE_PATH`는 비웁니다. `CUSTOM_DOMAIN`이 있고 `BASE_PATH`가 비어 있으면 워크플로는 base path 없이 빌드합니다. 루트임을 드러내려면 `/` 를 넣습니다.
4. 예전에 넣어 둔 `GOOGLE_SITE_VERIFICATION`은 새 Search Console 토큰으로 바꾸거나 지웁니다.

## 4. Pages에 도메인을 저장하고 배포합니다

DNS 레코드보다 이 단계를 먼저 합니다.

이 사이트는 GitHub Actions로 배포됩니다. Actions로 배포하는 사이트는 저장소 소스에 CNAME 파일을 커밋해도 도메인이 바뀌지 않습니다. Pages 설정에 직접 저장합니다.

1. 저장소 **Settings → Pages**에서 Source가 GitHub Actions인지 확인합니다.
2. Custom domain에 대표 호스트를 넣고 Save합니다.
3. `main`에 머지하거나 Actions에서 **Deploy blog to GitHub Pages**를 실행합니다.
4. `CUSTOM_DOMAIN`이 있으면 워크플로가 배포물 `out/CNAME`에 그 호스트를 한 줄로 적습니다. Pages에 저장한 값과 같아야 합니다.

이 배포부터 사이트는 도메인 루트 기준으로 만들어집니다. DNS가 아직이면 `github.io` 주소가 잠시 어색할 수 있습니다. 5번의 DNS가 끝난 뒤에 다시 확인합니다.

## 5. DNS 레코드를 넣습니다

apex에는 A 네 개와 AAAA 네 개를 모두 넣습니다. 이름은 `@` 이거나 비웁니다. 파킹용으로 남아 있는 A, AAAA, CNAME은 지웁니다. 와일드카드(`*`) 레코드는 쓰지 않습니다.

| 타입 | 값                    |
| ---- | --------------------- |
| A    | `185.199.108.153`     |
| A    | `185.199.109.153`     |
| A    | `185.199.110.153`     |
| A    | `185.199.111.153`     |
| AAAA | `2606:50c0:8000::153` |
| AAAA | `2606:50c0:8001::153` |
| AAAA | `2606:50c0:8002::153` |
| AAAA | `2606:50c0:8003::153` |

`www`는 CNAME 하나이고, 값은 `leejunyeolkor.github.io` 입니다. 저장소 이름 `/me`는 붙이지 않습니다. Pages 설정의 `*.pages.github.io` 임시 호스트로 보내면 안 됩니다.

전파는 최대 24시간이 걸릴 수 있습니다.

```sh
dig example.com +noall +answer -t A
dig example.com +noall +answer -t AAAA
dig www.example.com +nostats +nocomments +nocmd
```

A/AAAA가 위 주소와 같고, www의 CNAME이 `leejunyeolkor.github.io`로 끝나면 됩니다.

## 6. HTTPS를 켜고 사이트를 확인합니다

1. DNS가 반영되면 **Settings → Pages → Enforce HTTPS**를 켭니다. 칸이 보이기까지 최대 24시간이 걸릴 수 있습니다.
2. `https://대표-도메인/` 이 열립니다.
3. 글, CSS, RSS에 `/me`가 없어야 합니다. 있으면 `BASE_PATH`가 `/me`인 빌드입니다.
4. `https://대표-도메인/sitemap.xml` 과 `robots.txt`의 Sitemap이 새 도메인입니다.
5. `https://대표-도메인/category/food/` 가 열립니다.

apex와 www 중 Pages에 저장하지 않은 쪽은 저장한 쪽으로 리다이렉트됩니다. canonical은 그 대표 호스트입니다.

## 7. 예전 `/me` 주소

커스텀 도메인을 이 프로젝트 사이트에 연결하면 공개 경로에서 `/me`가 빠집니다. `https://leejunyeolkor.github.io/me/posts/slug/` 는 `https://대표-도메인/posts/slug/` 가 됩니다. canonical, 사이트맵, RSS도 그 빌드의 `SITE_URL`을 따릅니다.

한 빌드로 `/me`와 도메인 루트를 같이 낼 수는 없습니다. base path는 빌드에 박히기 때문입니다. `/me`를 남긴 채 도메인만 연결하면 링크가 `/me`를 가리켜 깨집니다.

연결 후 `https://leejunyeolkor.github.io/me/` 와 글 주소 하나를 열어 봅니다. GitHub Pages는 프로젝트 사이트의 기본 `github.io` 주소를 커스텀 도메인으로 보내는 경우가 많습니다. `/me` 다음 경로만 남아 새 도메인으로 가면 예전 링크가 유지되는 것입니다. 404라면 그 주소는 더 이상 제공되지 않습니다. Search Console 새 속성에 사이트맵을 제출하고, `/me` 복사본을 따로 두지 않습니다.

## 8. Search Console과 AdSense

새 도메인 속성을 만들고 사이트맵을 다시 제출합니다. `docs/search-console.md`의 5번과 AdSense 절을 따릅니다. `ads.txt`와 개인정보처리방침은 광고 신청 전에 준열이 채웁니다.
