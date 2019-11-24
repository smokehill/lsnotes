import Vue from 'vue';
import VueRouter from 'vue-router';

import Sidebar from './components/Sidebar.vue';
import Form from './components/form/Form.vue';
import FormOverlay from './components/form/FormOverlay.vue';
import Notes from './components/content/Notes.vue';
import Trash from './components/content/Trash.vue';
import Settings from './components/content/Settings.vue';

import { lsGet, lsSet, listingDateFormat, i18n } from './helpers.js';

Vue.use(VueRouter);

Vue.prototype.$eventBus = new Vue(); // events
Vue.prototype.$timeout = 500; // setTimeout delay

Vue.filter('tolowercase', function(str) { return str.toLowerCase(); });
Vue.filter('json_stringify', function(obj) { return JSON.stringify(obj); });
Vue.filter('listing_date_format', function(time) { return listingDateFormat(time); });
Vue.filter('i18n', function(str) { return i18n(str); });

const router = new VueRouter({
  routes: [
    { path: '*', redirect: '/' },
    { path: '/', redirect: '/notes' },
    { path: '/notes', name: 'notes', component: Notes },
    { path: '/trash', name: 'trash', component: Trash },
    { path: '/settings', name: 'settings', component: Settings }
  ]
});

const app = new Vue({
  el: '#app',
  router: router,
  components: {
    'sidebar': Sidebar,
    'form-modal': Form,
    'form-modal-overlay': FormOverlay
  },
  created: function() {
    if (lsGet('notes') == null) {
      // init LS base params
      lsSet('notes', []);
      lsSet('language', 'en');
      lsSet('sidebar_mini', false);
      lsSet('text_format', 'small');
    }
  }
});