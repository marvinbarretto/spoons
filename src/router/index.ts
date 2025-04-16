import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'
import { SITE_TITLE } from '../constants'

const auth = getAuth()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: `Home | ${SITE_TITLE}` },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
      meta: { title: `Map | ${SITE_TITLE}` },
    },
    {
      path: '/me',
      name: 'user',
      component: () => import('../views/UserView.vue'),
      meta: { title: `User | ${SITE_TITLE}` },
    },
    {
      path: '/check-in',
      name: 'check-in',
      component: () => import('../views/CheckInView.vue'),
      meta: { title: `Check In | ${SITE_TITLE}` },
    },
    {
      path: '/badge-award',
      name: 'badge-award',
      component: () => import('../views/BadgeAwardView.vue'),
      meta: { title: `Badge Award | ${SITE_TITLE}` },
    },
    {
      path: '/pubs',
      name: 'pubs',
      component: () => import('../views/PubListView.vue'),
      meta: { title: `Pubs | ${SITE_TITLE}` },
    },
    {
      path: '/pubs/:id',
      name: 'PubDetail',
      component: () => import('../views/PubDetailView.vue'),
      props: true,
      meta: { title: `Pub Detail | ${SITE_TITLE}` },
    },
    {
      path: '/admin/pubs',
      name: 'admin-pubs',
      component: () => import('../views/AdminPubsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: `Admin | ${SITE_TITLE}` },
    },
    {
      path: '/admin/pubs/new',
      name: 'admin-new-pub',
      component: () => import('../views/AdminNewPubView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: `New Pub | Admin | ${SITE_TITLE}` },
    },
    {
      path: '/admin/pubs/:id',
      name: 'admin-edit-pub',
      component: () => import('../views/AdminEditPubView.vue'),
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true, title: `Edit Pub | Admin | ${SITE_TITLE}` },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { title: `About | ${SITE_TITLE}` },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  const user = auth.currentUser

  if (requiresAuth && !user) {
    return next({ name: 'home' }) // or redirect to /login if you build one
  }

  if (requiresAdmin) {
    if (!user?.uid) return next({ name: 'home' })

    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const userData = userDoc.exists() ? userDoc.data() : null

    if (!userData?.isAdmin) {
      return next({ name: 'home' }) // or show error
    }
  }

  document.title = (to.meta.title as string) || SITE_TITLE
  next()
})

export default router
