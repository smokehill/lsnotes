<template>
  <div class="content-wrapper">
    <h4 class="title">Drafts</h4>
    <ul class="list" v-if="notes.length > 0">
      <li v-for="note in notes">
        <a href="#">
          <img src="dist/img/list_checkbox1.png" alt="">{{ note.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { lsGet } from './../helpers.js';
  
  export default {
    name: 'drafts',
    data() {
      return {
        notes: []
      }
    },
    mounted: function() {
      this.$parent.highlightMenu();
      this.init();
    },
    methods: {
      init() {
        const lsNotes = lsGet('notes');

        this.notes = [];

        if (lsNotes != null) {
          for (let i = 0; i < lsNotes.length; i++) {
            if (lsNotes[i].type == 'drafts') {
              this.notes.push(lsNotes[i]);
            }
          }
        }

      }
    }
  }
</script>