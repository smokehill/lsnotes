import Vue from 'vue';
import VueRouter from 'vue-router';
import $ from 'jquery';
// components
import InboxComponent from './components/inbox.vue';
import TrashComponent from './components/trash.vue';
import FormComponent from './components/form.vue';

Vue.use(VueRouter);

Vue.filter('tolowercase', function (str) {
  return str.toLowerCase();
})

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'inbox',
      component: InboxComponent
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: InboxComponent
    },
    {
      path: '/trash',
      name: 'trash',
      component: TrashComponent
    },
  ]
});

const app = new Vue({
  el: '#app',
  router: router,
  data: {
    menu: [
      {
        name: 'Inbox',
        path: '#/inbox',
        image: 'dist/img/sidebar_inbox.png'
      },
      // {
      //   name: 'Drafts',
      //   path: '#/drafts',
      //   image: 'dist/img/sidebar_draft.png'
      // },
      {
        name: 'Trash',
        path: '#/trash',
        image: 'dist/img/sidebar_trash.png'
      }
    ]
  },
  components: {
    'form-component': FormComponent,
  },
  mounted: function() {
    const name = this.$router.currentRoute.name;
    const items = $('.menu').find('li');
    // highlight active menu
    $.each(items, function(i, item) {
      if ($(item).data('name') == name) {
        $(item).addClass('active');
      }
    });
  },
  methods: {
    compose() {
      this.$refs.form.show();
    }
  }
});