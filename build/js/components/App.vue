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
    created: function() {
      if (lsGet('notes') == null) {
        // init LS base params
        lsSet('notes', []);
        lsSet('language', 'en');
        lsSet('sidebar_mini', false);
        lsSet('text_format', 'small');
      }
    }
  }
</script>