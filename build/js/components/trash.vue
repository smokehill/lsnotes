<template>
  <div class="content-wrapper">
    <h4 class="title">Trash</h4>
    <div class="controls">
      <input type="checkbox" title="Select all" v-on:click="selectAll($event)"/> 
      <a href="#" v-on:click="restoreSelected($event)">Restore selected</a>
    </div>
    <ul class="list" v-if="notes.length > 0">
      <li v-for="note in notes" :data-id="note.id">
        <input type="checkbox">
        <span class="title" v-on:click="edit($event, note.id)">{{ note.title }}</span>
        <span class="date">{{ note.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { lsGet, lsSet } from './../helpers.js';
  
  export default {
    name: 'trash',
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
            if (lsNotes[i].type == 'trash') {
              this.notes.push(lsNotes[i]);
            }
          }
        }
        
      },
      edit(e, id) {
        e.preventDefault();
        this.$parent.$refs.form.show(id);
      },
      selectAll(e) {
        let checkboxes = $('.list').find('input[type=checkbox]');

        checkboxes.each(function(index, checkbox) {
            $(e.target).is(':checked') ? $(checkbox).prop('checked', true) : $(checkbox).prop('checked', false);
        });
      },
      restoreSelected(e) {
        e.preventDefault();
        
        let restored = [];
        const list = $('.list').find('li');
        const lsNotes = lsGet('notes');

        list.each(function(index, li) {
            if ($(li).find('input[type=checkbox]').is(':checked')) {
              restored.push($(li).data('id'));
            }
        });

        if (restored.length > 0 && lsNotes != null) {

          for (let i = 0; i < lsNotes.length; i++) {
            if ($.inArray(lsNotes[i].id, restored) != -1) {
              lsNotes[i].type = 'inbox';
            }
          }

          lsSet('notes', lsNotes);
          this.init();
        }
      }
    }
  }
</script>