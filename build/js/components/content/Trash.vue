<template>
  <div id="content">
    <div class="content-header fixed">
      <h4 class="title">Trash</h4>
      <ol class="breadcrumb">
        <li><a href="#" class="breadcrumb-checkbox" v-on:click="selectAll($event)" v-bind:class="{ on: selectedAll }" title="Select all"></a></li>
        <li><a href="#" class="breadcrumb-restore" v-on:click="restoreSelected($event)" title="Restore selected"></a></li>
        <li><a href="#" class="breadcrumb-trash" v-on:click="deleteSelected($event)" title="Delete selected"></a></li>
      </ol>
    </div>
    <div class="content-body fixed">
      <ul class="list" v-if="notes.length > 0">
        <li v-for="(note, index) in notes" :data-id="note.id">
          <span class="checkbox" v-on:click="select($event, index)" v-bind:class="{ on: note.checked }"></span>
          <span class="title" v-on:click="edit($event, note.id)">{{ note.title }}</span>
          <span class="date">{{ note.created_at }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { lsGet, lsSet } from './../../helpers.js';
  
  export default {
    name: 'trash',
    data() {
      return {
        notes: [],
        selectedAll: false
      }
    },
    mounted: function() {
      this.$parent.$refs.sidebarMenu.highlight();
      this.init();
    },
    methods: {
      /**
       * Initialize base params
       */
      init() {
        let lsNotes = lsGet('notes');
        this.notes = [];
        if (lsNotes != null) {
          for (let i = 0; i < lsNotes.length; i++) {
            if (lsNotes[i].type == 'trash') {
              this.notes.push(lsNotes[i]);
            }
          }
        }
      },
      /**
       * Edit note
       */
      edit(e, id) {
        e.preventDefault();
        if (e.target.classList.contains('checkbox')) {
          return;
        }
        this.$parent.$refs.form.show(id);
      },
      /**
       * Select single note
       */
      select(e, index) {
        this.notes[index].checked = (!this.notes[index].checked) ? true : false;
      },
      /**
       * Select all notes
       */
      selectAll(e) {
        e.preventDefault();
        let status = 'on';
        this.selectedAll = (!this.selectedAll) ? true : false;
        if (!this.selectedAll) {
          status = 'off';
        }
        // reset checked values
        for (let i = 0; i < this.notes.length; i++) {
          if (status == 'on' && !this.notes[i].checked) {
            this.notes[i].checked = true;
          } else if (status == 'off' && this.notes[i].checked) {
            this.notes[i].checked = false;
          }
        }
      },
      /**
       * Restore selected notes
       */
      restoreSelected(e) {
        e.preventDefault();
        let selected = [];
        let lsNotes = lsGet('notes');
        for (let i = 0; i < this.notes.length; i++) {
          if (this.notes[i].checked) {
            selected.push(this.notes[i].id);
          }
        }
        if (selected.length > 0 && lsNotes != null) {
          for (let i = 0; i < lsNotes.length; i++) {
            if (selected.indexOf(lsNotes[i].id) != -1) {
              lsNotes[i].type = 'notes';
              // change note type in form header
              if (lsNotes[i].id == this.$parent.$refs.form.note.id) {
                this.$parent.$refs.form.__setHeaderType('notes');
              }
            }
          }
          lsSet('notes', lsNotes);
          this.init();
        }
        this.selectedAll = false;
      },
      /**
       * Drop selected notes from LS
       */
      deleteSelected(e) {
        e.preventDefault();
        let selected = [];
        let lsNotes = lsGet('notes');
        for (let i = 0; i < this.notes.length; i++) {
          if (this.notes[i].checked) {
            selected.push(this.notes[i].id);
          }
        }
        if (selected.length > 0 && lsNotes != null) {
          for (let i = lsNotes.length - 1; i >= 0; i--) {
            if (selected.indexOf(lsNotes[i].id) != -1) {
              if (lsNotes[i].id == this.$parent.$refs.form.note.id) {
                this.$parent.$refs.form.close(e);
              }
              // TODO: fix
              lsNotes.splice(i, 1);
            }
          }
          lsSet('notes', lsNotes);
          this.init();
        }
        this.selectedAll = false;
      }
    }
  }
</script>