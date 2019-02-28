<template>
  <div class="sidebar" v-bind:class="{ 'sm': width == 'sm' }">
    <div class="compose">
      <a href="#" class="compose-btn" v-on:click="compose">
        <i class="fa fa-compose"></i>
        <span>Compose</span>
      </a>
    </div>
    <ul class="menu">
      <li v-for="m in menu" v-bind:class="{ active: m.isActive }">
        <a :href="m.path">
          <i :class="'fa fa-'+m.name|tolowercase"></i>
          <span class="text">{{ m.name }}</span>
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
        width: 'lg',
        menu: [
          {
            name: 'Notes',
            path: '#/notes',
            image: 'dist/img/icons/sidebar_notes.png',
            isActive: false
          },
          {
            name: 'Trash',
            path: '#/trash',
            image: 'dist/img/icons/sidebar_trash.png',
            isActive: false
          },
          {
            name: 'Settings',
            path: '#/settings',
            image: 'dist/img/icons/sidebar_settings.png',
            isActive: false
          },
        ]
      }
    },
    mounted: function() {
      this.width = lsGet('sidebar_width');
    },
    methods: {
      /**
       * Highlight active item
       */
      highlightMenu() {
        const routeName = this.$router.currentRoute.name;
        for (let i = 0; i < this.menu.length; i++) {
          if (this.menu[i].name.toLowerCase() == routeName) {
            this.menu[i].isActive = true;
          } else {
            this.menu[i].isActive = false;
          }
        }
      },
      compose(e) {
        e.preventDefault();
        this.$parent.$refs.form.show();
      }
    }
  }
</script>