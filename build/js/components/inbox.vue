<template>
  <div class="content-wrapper">
    <h4 class="title">Inbox</h4>
    <div class="controls">
      <a href="#" v-on:click="deleteSelected($event)">Delete</a>
    </div>
    <ul class="list" v-if="notes.length > 0">
      <li v-for="note in notes" v-on:click="edit($event, note.id)" :data-id="note.id" >
        <input type="checkbox"/>
        <span class="title">{{ note.title }}</span>
        <span class="date">{{ note.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { lsGet, lsSet } from './../helpers.js';

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
      edit(e, id) {
        // e.preventDefault();
        const el = $(e.target);

        if (el.attr('type') != undefined && el.attr('type') == 'checkbox') {
          return;
        }

        this.$parent.$refs.form.show(id);
      },
      deleteSelected(e) {
        e.preventDefault();
      
        let deleted = [];
        const list = $('.list').find('li');
        const lsNotes = lsGet('notes');

        list.each(function(index, li) {
            if ($(li).find('input[type=checkbox]').is(':checked')) {
              deleted.push($(li).data('id'));
            }
        });

        if (deleted.length > 0 && lsNotes != null) {

          for (let i = 0; i < lsNotes.length; i++) {
            if ($.inArray(lsNotes[i].id, deleted) != -1) {
              lsNotes[i].type = 'trash';
            }
          }

          lsSet('notes', lsNotes);
          this.init();
        }
      }
    }
  }
</script>