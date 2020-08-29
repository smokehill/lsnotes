import Vue from 'vue';
import Vuex from 'vuex'
import VueRouter from 'vue-router';
import App from './components/App.vue';
import Notes from './components/content/Notes.vue';
import Trash from './components/content/Trash.vue';
import Settings from './components/content/Settings.vue';
import { listingDateFormat, i18n } from './helpers.js';

Vue.prototype.$eventBus = new Vue(); // events
Vue.prototype.$timeout = 500; // setTimeout delay

Vue.filter('tolowercase', (str) => str.toLowerCase());
Vue.filter('json_stringify', (obj) => JSON.stringify(obj));
Vue.filter('listing_date_format', (time) => listingDateFormat(time));
Vue.filter('i18n', (str) => i18n(str));

Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store({
  state: {
    noteId: null // active note id
  },
  mutations: {
    rememberNoteId(state, id) {
      state.noteId = id;
    }
  }
});

const router = new VueRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: '',
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
  store: store,
  render: v => v(App)
});