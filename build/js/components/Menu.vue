<template>
  <ul class="menu">
    <li v-for="item in items" v-bind:class="{ active: item.isActive }">
      <a :href="item.path">
        <img :src="item.image" :alt="item.name" />
        <span class="text">{{ item.name }}</span>
      </a>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'sidebar-menu',
    data() {
      return {
        items: [
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
    methods: {
      /**
       * Highlight active item
       */
      highlight() {
        const routeName = this.$router.currentRoute.name;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].name.toLowerCase() == routeName) {
            this.items[i].isActive = true;
          } else {
            this.items[i].isActive = false;
          }
        }
      }
    }
  }
</script>