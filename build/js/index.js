import Vue from 'vue';
import VueRouter from 'vue-router';

import $ from 'jquery';
import { lsGet, lsSet } from './helpers.js';

import Notes from './components/content/notes.vue';
import Trash from './components/content/trash.vue';
import Settings from './components/content/settings.vue';
import Form from './components/form.vue';


Vue.use(VueRouter);

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
      name: 'notes',
      component: Notes
    },
    {
      path: '/notes',
      name: 'notes',
      component: Notes
    },
    {
      path: '/trash',
      name: 'trash',
      component: Trash
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
});

const app = new Vue({
  el: '#app',
  router: router,
  data: {
    bus: new Vue(),
    menu: [
      {
        name: 'Notes',
        path: '#/notes',
        image: 'dist/img/icons/sidebar_notes.png'
      },
      {
        name: 'Trash',
        path: '#/trash',
        image: 'dist/img/icons/sidebar_trash.png'
      },
      {
        name: 'Settings',
        path: '#/settings',
        image: 'dist/img/icons/sidebar_settings.png'
      },
    ]
  },
  components: {
    'form-component': Form,
  },
  created: function() {
    if (lsGet('notes') == null) {
      // init Local Storage base params
      lsSet('notes', []);
    }
  },
  mounted: function() {
    this.highlightMenu();
  },
  methods: {
    /**
     * Highlight active menu
     */
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
    /**
     * @external
     * Open form
     */
    compose() {
      this.$refs.form.show();
    }
  }
});