import Vue from 'vue';
import VueRouter from 'vue-router';
import $ from 'jquery';

import InboxComponent from './components/inbox.vue';
import DraftsComponent from './components/drafts.vue';
import TrashComponent from './components/trash.vue';
import FormComponent from './components/form.vue';

import { lsGet, lsSet } from './helpers.js';


Vue.use(VueRouter);

// filters 
Vue.filter('tolowercase', function (str) {
  return str.toLowerCase();
});
Vue.filter('json_stringify', function (obj) {
  return JSON.stringify(obj);
});

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
      path: '/drafts',
      name: 'drafts',
      component: DraftsComponent
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
    bus: new Vue(),
    menu: [
      {
        name: 'Inbox',
        path: '#/inbox',
        image: 'dist/img/sidebar_inbox.png'
      },
      {
        name: 'Drafts',
        path: '#/drafts',
        image: 'dist/img/sidebar_draft.png'
      },
      {
        name: 'Trash',
        path: '#/trash',
        image: 'dist/img/sidebar_trash.png'
      },
      // {
      //   name: 'Settings',
      //   path: '#/settings',
      //   image: 'dist/img/sidebar_settings.png'
      // },
    ]
  },
  components: {
    'form-component': FormComponent,
  },
  created: function() {
    if (lsGet('list') == null) {
      // init Local Storage base params
      lsSet('list', []);
    }
  },
  mounted: function() {
    this.highlightMenu();
  },
  methods: {
    highlightMenu() {
      const name = this.$router.currentRoute.name;
      const items = $('.menu').find('li');
    
      // highlight active menu
      $.each(items, function(i, item) {
        if ($(item).data('name') == name) {
          $(item).addClass('active').siblings().removeClass('active');
        }
      });
    },
    compose() {
      this.$refs.form.show();
    }
  }
});