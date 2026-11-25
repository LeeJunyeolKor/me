import { formatHours, formatKrw, type Restaurant } from '@/lib/restaurant';

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const hours = formatHours(restaurant.hours);
  return (
    <section className='restaurant-card' aria-label='식당 정보'>
      <h2>{restaurant.name}</h2>
      <p className='restaurant-card__score' aria-label={`5점 만점에 ${restaurant.rating}점`}>
        {restaurant.rating} / 5
      </p>
      <dl>
        <dt>동네</dt>
        <dd>{restaurant.area}</dd>
        {restaurant.address ? (
          <>
            <dt>주소</dt>
            <dd>{restaurant.address}</dd>
          </>
        ) : null}
        {restaurant.servesCuisine ? (
          <>
            <dt>음식</dt>
            <dd>{restaurant.servesCuisine}</dd>
          </>
        ) : null}
        <dt>가격대</dt>
        <dd>{restaurant.priceRange}</dd>
        <dt>영업시간</dt>
        <dd className='restaurant-card__hours'>{hours}</dd>
        <dt>방문</dt>
        <dd>
          <time dateTime={restaurant.visitedAt}>{restaurant.visitedAt.replaceAll('-', '.')}</time>
        </dd>
        {restaurant.mapUrl ? (
          <>
            <dt>지도</dt>
            <dd>
              <a href={restaurant.mapUrl} target='_blank' rel='noreferrer noopener'>
                지도 보기
              </a>
            </dd>
          </>
        ) : null}
      </dl>
      {restaurant.menu.length ? (
        <ul className='restaurant-menu'>
          {restaurant.menu.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              <span>{item.name}</span>
              <span>{formatKrw(item.price)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
