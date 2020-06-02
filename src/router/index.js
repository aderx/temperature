import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Temp from '../views/temp.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'temp',
    component: Temp
  },
  {
    path: '/env/:eId',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Home
  },
  {
    path: '/show/:id',
    name: 'show',
    component: () => import(/* webpackChunkName: "show" */ '../views/show.vue')
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router
