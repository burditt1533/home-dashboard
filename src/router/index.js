import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import Todo from '../views/Todo.vue'
import Calendar from '../views/Calendar.vue'
import Photos from '../views/Photos.vue'
import Media from '../views/Media.vue'
import Guest from '../views/Guest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/todo',
      name: 'todo',
      component: Todo
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/photos',
      name: 'photos',
      component: Photos
    },
    {
      path: '/media',
      name: 'media',
      component: Media
    },
    {
      path: '/guest',
      name: 'guest',
      component: Guest
    }
  ]
})

export default router
