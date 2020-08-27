<template>
  <div class="sidebar" v-bind:class="{ 'sm': isMini }">
    <div class="compose">
      <a href="#" class="compose-btn" v-on:click="compose">
        <i class="fa fa-compose"></i>
        <span>{{ "sidebar.compose_btn"|i18n }}</span>
      </a>
    </div>
    <ul class="menu">
      <router-link
        tag="li" v-for="m in menu" :to="m.path" :key="m.title">
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
            path: '/notes',
            title: 'sidebar.menu_notes',
            icon: 'notes'
          },
          {
            path: '/trash',
            title: 'sidebar.menu_trash',
            icon: 'trash'
          },
          {
            path: '/settings',
            title: 'sidebar.menu_settings',
            icon: 'settings'
          },
        ]
      }
    },
    mounted: function() {
      const self = this;
      self.isMini = lsGet('sidebar_mini');
      self.$eventBus.$on('sidebar_mini', function() {
        self.isMini = lsGet('sidebar_mini');
      });
    },
    methods: {
      /**
       * Open form
       */
      compose() {
        this.$eventBus.$emit('form_open');
      }
    }
  }
</script>