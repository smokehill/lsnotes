import Vue from 'vue';
import VueRouter from 'vue-router';
import $ from 'jquery';
// components
import InboxComponent from './components/inbox.vue';
import TrashComponent from './components/trash.vue';
import FormComponent from './components/form.vue';

Vue.use(VueRouter);

var router = new VueRouter({
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
  ]
});

var app = new Vue({
  el: '#app',
  router: router,
  data: {},
  components: {
    'form-component': FormComponent,
  },
  methods: {
    compose() {
      this.$refs.form.show();
    }
  }
});