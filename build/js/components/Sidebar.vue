<template>
  <div class="sidebar" v-bind:class="{ 'sm': isMini }">
    <div class="compose">
      <a href="#" class="compose-btn" v-on:click="compose">
        <i class="fa fa-compose"></i>
        <span>{{ "sidebar.compose_btn"|i18n }}</span>
      </a>
    </div>
    <ul class="menu">
      <li v-for="m in menu" v-bind:class="{ active: m.isActive }">
        <a :href="m.path">
          <i :class="'fa fa-'+m.icon"></i>
          <span class="text">{{ m.iKey|i18n }}</span>
        </a>
      </li>
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
            iKey: 'sidebar.menu_notes',
            icon: 'notes',
            path: '#/notes',
            isActive: false
          },
          {
            iKey: 'sidebar.menu_trash',
            icon: 'trash',
            path: '#/trash',
            isActive: false
          },
          {
            iKey: 'sidebar.menu_settings',
            icon: 'settings',
            path: '#/settings',
            isActive: false
          },
        ]
      }
    },
    mounted: function() {
      this.isMini = lsGet('sidebar_mini');
    },
    methods: {
      /**
       * Highlight active item
       */
      highlightMenu() {
        const routeName = this.$router.currentRoute.name;
        for (let i = 0; i < this.menu.length; i++) {
          if (this.menu[i].icon == routeName) {
            this.menu[i].isActive = true;
          } else {
            this.menu[i].isActive = false;
          }
        }
      },
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