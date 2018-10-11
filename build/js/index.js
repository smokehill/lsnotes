import Vue from 'vue';
import VueRouter from 'vue-router';

import InboxComponent from './components/inbox.vue';
import TrashComponent from './components/trash.vue';
import FormComponent from './components/form.vue';

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
  components: {
    'form-component': FormComponent,
  },
  created: function () {},
  mounted: function() {},
  methods: {
    compose(e) {
      e.preventDefault();
      var form = $(this.$el).find('#note-form');

      if (form.hasClass('active')) {
        return false;
      }

      form
        .removeClass('small')
        .addClass('active')
        .find('.controls a:first img').attr('src', 'dist/img/m_minus.png');
    }
  }
});