export default [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/home/HomePage.vue'),
        meta: { title: '홈 | Vue 스타터 킷', label: '홈' },
      },
      ...(import.meta.env.DEV
        ? [
            {
              path: 'examples',
              name: 'examples',
              component: () => import('@/pages/examples/ExamplesPage.vue'),
              meta: { title: '패키지 예제 | Vue 스타터 킷', label: '패키지 예제' },
            },
          ]
        : []),
    ],
  },
]
