<template>
  <div>
    <sidebar></sidebar>
    <router-view></router-view>
    <modal></modal>
  </div>
</template>

<script>
  import Sidebar from './Sidebar.vue';
  import Modal from './Modal.vue';
  import { lsGet, lsSet } from '../helpers.js';
  
  export default {
    components: {
      'sidebar': Sidebar,
      'modal': Modal
    },
    created: () => {
      if (lsGet('notes') == null) {
        // init Local Storage base params
        lsSet('notes', []);
        lsSet('language', 'en');
        lsSet('sidebar_mini', false);
        lsSet('text_format', 'small');
      }
    }
  }
</script>