import Vue from 'vue';
import VueRouter from 'vue-router';
import NotesComponent from './components/Notes.vue';


Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: NotesComponent
    },
    {
      path: '/notes',
      component: NotesComponent
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