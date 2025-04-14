import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/me',
      name: 'user',
      component: () => import('../views/UserView.vue'),
    },
    {
      path: '/check-in',
      name: 'check-in',
      component: () => import('../views/CheckInView.vue'),
    },
    {
      path: '/pubs',
      name: 'pubs',
      component: () => import('../views/PubListView.vue'),
    },
    {
      path: '/pubs/:id',
      name: 'PubDetail',
      component: () => import('../views/PubDetailView.vue'),
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
