<template>
  <div class="content-wrapper">
    <h4 class="title">Inbox</h4>
    <ul class="list" v-if="notes.length > 0">
      <li v-for="note in notes">
        <a href="#" v-on:click="edit" :data-id="note.id">
          <img src="dist/img/list_checkbox1.png" alt="">{{ note.title }}
          <span class="date">{{ note.date }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { lsGet } from './../helpers.js';

  export default {
    name: 'inbox',
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
            if (lsNotes[i].type == 'inbox') {
              this.notes.push(lsNotes[i]);
            }
          }
        }

      },
      edit(e) {
        e.preventDefault();
        const id = $(e.target).data('id');
        this.$parent.$refs.form.show(id);

      }
    }
  }
</script>