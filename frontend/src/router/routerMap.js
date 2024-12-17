/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/layouts/AppSider.vue'),
    children: [
      {
        path: '/tools',
        name: 'Tools',
        component: () => import('@/views/tools/Index.vue'),
      },
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/Index.vue'),
      },
      {
        path: '/video',
        name: 'Video',
        component: () => import('@/views/video/Index.vue'),
      },
      {
        path: '/web',
        name: 'Web',
        component: () => import('@/views/web/Index.vue'),
      },
      {
        path: '/download',
        name: 'Download',
        component: () => import('@/views/download/Index.vue'),
      },
    ]
  }
]

export default constantRouterMap
