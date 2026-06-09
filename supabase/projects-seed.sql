insert into public.projects (
  id,
  title,
  description,
  stack,
  image,
  href,
  gallery_images,
  sort_order
)
values
  (
    '1',
    'ARC Trading',
    'Сайт для криптовалютной компании, предоставляющей услуги маркет-мейкинга. фокус на чёткой подаче ценностного предложения, формировании доверия и сильном впечатлении.',
    array['React', 'Three.js', 'TypeScript'],
    'https://iili.io/f4fgRpI.webp',
    'https://www.arctrading.io/',
    array[
      'https://iili.io/f4qYulR.webp',
      'https://bs.boomstream.com/balancer/tfNZNLb0-uDOlgdNc.mp4',
      'https://iili.io/f4qY5HN.webp',
      'https://bs.boomstream.com/balancer/HmimaZ01-uDOlgdNc.mp4',
      'https://bs.boomstream.com/balancer/tGbdj3rP-uDOlgdNc.mp4'
    ],
    0
  ),
  (
    '2',
    'Kodiak',
    'Kodiak — компания, поддерживающая новое поколение владельцев малого бизнеса через долевое финансирование и долгосрочное операционное партнерство.',
    array['D3.js', 'Next.js', 'Tailwind'],
    'https://iili.io/f4fgu7p.webp',
    null,
    array[
      'https://iili.io/f4qYASp.webp',
      'https://bs.boomstream.com/balancer/g2w9OviK-3aLokGCi.mp4',
      'https://iili.io/f4qY7RI.webp',
      'https://bs.boomstream.com/balancer/TFFZOfdR-3aLokGCi.mp4'
    ],
    1
  ),
  (
    '3',
    'Numio',
    'Концепт-дизайн Numio — мобильного приложения для персонального финансового учёта с фокусом на отслеживание доходов и расходов.',
    array['Python', 'WebGL', 'React'],
    'https://iili.io/f4fgzrv.webp',
    null,
    array[
      'https://iili.io/f4qYlxn.webp',
      'https://iili.io/f4qYMl4.webp',
      'https://iili.io/f4qYXJ2.webp',
      'https://iili.io/f4qYjO7.webp',
      'https://iili.io/f4qYeWu.webp',
      'https://iili.io/f4qYkib.webp'
    ],
    2
  ),
  (
    '4',
    'ARVE’',
    'Международный сервис подбора, продажи и аренды арт-объектов для интерьера, инвестиций, коллабораций, частных коллекций и подарков.',
    array['Shopify', 'Motion', 'Next.js'],
    'https://iili.io/f4fgT2R.webp',
    'https://arve.art/',
    array[
      'https://iili.io/f4fgT2R.webp',
      'https://bs.boomstream.com/balancer/fGf3OUJU-3aLokGCi.mp4',
      'https://iili.io/f4qYxVa.webp'
    ],
    3
  ),
  (
    '5',
    'Nimb',
    'Система управления проектами с учетом времени, задач и доходов. Трекинг через встроенный таймер, автоматический подсчет выполненных проектов, база клиентов и визуализация статистики.',
    array['React', 'Python', 'WebSockets'],
    'https://iili.io/f4fg7It.webp',
    null,
    array[
      'https://iili.io/f4qYoog.webp',
      'https://bs.boomstream.com/balancer/qILLzOpm-uDOlgdNc.mp4',
      'https://iili.io/f4qY1iG.webp',
      'https://iili.io/f4qYVUl.webp'
    ],
    4
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  stack = excluded.stack,
  image = excluded.image,
  href = excluded.href,
  gallery_images = excluded.gallery_images,
  sort_order = excluded.sort_order,
  updated_at = now();
