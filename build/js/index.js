import Vue from 'vue';
import VueRouter from 'vue-router';

import { lsGet, lsSet } from './helpers.js';

import Menu from './components/Menu.vue';
import Notes from './components/content/Notes.vue';
import Trash from './components/content/Trash.vue';
import Settings from './components/content/Settings.vue';
import Form from './components/form/Form.vue';
import FormOverlay from './components/form/FormOverlay.vue';

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
    'sidebar-menu': Menu,
    'form-modal': Form,
    'form-modal-overlay': FormOverlay,
  },
  created: function() {
    if (lsGet('notes') == null) {
      // init Local Storage base params
      lsSet('notes', []);
    }
  },
  methods: {
    /**
     * @external
     * Open form
     */
    compose(e) {
      e.preventDefault();
      this.$refs.form.show();
    }
  }
});