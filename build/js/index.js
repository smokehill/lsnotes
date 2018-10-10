import Vue from 'vue';
import VueRouter from 'vue-router';

import InboxComponent from './components/inbox.vue';
import TrashComponent from './components/trash.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: InboxComponent
    },
    {
      path: '/inbox',
      component: InboxComponent
    },
    {
      path: '/trash',
      component: TrashComponent
    },
  ],
  // mode: 'history' // removes /#/ from url
});

const app = new Vue({
  el: '#app',
  router: router,
  data: {},
  created: function () {},
  mounted: function() {},
  methods: {}
});