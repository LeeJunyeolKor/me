import { PostIndex } from '@/components/post-index';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getSearchPosts } from '@/lib/search';
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id='main-content'>
        <section className='intro shell editorial-grid'>
          <div aria-hidden='true' />
          <div>
            <h1>이준열의 개발 블로그</h1>
            <p>프론트엔드와 AI 개발에 관해 씁니다.</p>
          </div>
        </section>
        <section id='writing' className='writing shell editorial-grid' aria-labelledby='writing-title'>
          <div className='rail' aria-hidden='true'>
            글
          </div>
          <div className='writing-main'>
            <div className='writing-heading'>
              <h2 id='writing-title'>글 찾아보기</h2>
              <span>최신순</span>
            </div>
            <PostIndex posts={getSearchPosts()} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
