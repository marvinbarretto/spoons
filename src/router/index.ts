import { createRouter, createWebHistory } from 'vue-router'
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
      component: () => import('../views/UserView.vue'),
      meta: { title: `Home` },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
      meta: { title: `Map` },
    },
    {
      path: '/check-in',
      name: 'check-in',
      component: () => import('../views/CheckInView.vue'),
      meta: { title: `Check In` },
    },
    {
      path: '/badge-award',
      name: 'badge-award',
      component: () => import('../views/BadgeAwardView.vue'),
      meta: { title: `Badge Award` },
    },
    {
      path: '/pubs',
      name: 'pubs',
      component: () => import('../views/PubListView.vue'),
      meta: { title: `Pubs` },
    },
    {
      path: '/pubs/:id',
      name: 'PubDetail',
      component: () => import('../views/PubDetailView.vue'),
      props: true,
      meta: { title: `Pub Detail` },
    },
    {
      path: '/admin/pubs',
      name: 'admin-pubs',
      component: () => import('../views/AdminPubsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: `Admin` },
    },
    {
      path: '/admin/pubs/new',
      name: 'admin-new-pub',
      component: () => import('../views/AdminNewPubView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, title: `New Pub | Admin` },
    },
    {
      path: '/admin/pubs/:id',
      name: 'admin-edit-pub',
      component: () => import('../views/AdminEditPubView.vue'),
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true, title: `Edit Pub | Admin` },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { title: `About` },
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

  const pageTitle = to.meta.title ? `${to.meta.title} | ${SITE_TITLE}` : SITE_TITLE
  document.title = pageTitle

  next()
})

export default router
