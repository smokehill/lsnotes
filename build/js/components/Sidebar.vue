<template>
  <div class="sidebar" v-bind:class="{ 'sm': isMini }">
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
        isMini: false,
        menu: [
          {
            name: 'Notes',
            path: '#/notes',
            isActive: false
          },
          {
            name: 'Trash',
            path: '#/trash',
            isActive: false
          },
          {
            name: 'Settings',
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
          if (this.menu[i].name.toLowerCase() == routeName) {
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