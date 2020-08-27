<template>
  <div class="sidebar" v-bind:class="{ 'sm': isMini }">
    <div class="compose">
      <a href="#" class="compose-btn" v-on:click="compose">
        <i class="fa fa-compose"></i>
        <span>{{ "sidebar.compose_btn"|i18n }}</span>
      </a>
    </div>
    <ul class="menu">
      <router-link tag="li" v-for="m in menu" :to="m.route" :key="m.title">
        <i :class="'fa fa-'+m.icon"></i>
        <span class="text">{{ m.title|i18n }}</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import { lsGet, lsSet } from './../helpers.js';

  export default {
    name: 'sidebar',
    data() {
      return {
        isMini: false,
        menu: [
          {
            route: '/notes',
            title: 'sidebar.menu_notes',
            icon: 'notes'
          },
          {
            route: '/trash',
            title: 'sidebar.menu_trash',
            icon: 'trash'
          },
          {
            route: '/settings',
            title: 'sidebar.menu_settings',
            icon: 'settings'
          },
        ]
      }
    },
    mounted: function() {
      this.isMini = lsGet('sidebar_mini');
    },
    methods: {
      /**
       * Open form
       */
      compose(e) {
        e.preventDefault();
        this.$parent.$refs.form.show();
      }
    }
  }
</script>