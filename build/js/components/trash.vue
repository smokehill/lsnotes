<template>
  <div class="content-wrapper">
    <h4 class="title">Trash</h4>
    <ol class="breadcrumb">
      <li><a href="#" v-on:click="restoreSelected($event)">Restore selected</a></li>
      <li><a href="#" v-on:click="openModal($event)">Clear trash</a></li>
    </ol>
    <ul class="list" v-if="notes.length > 0">
      <li v-for="note in notes" :data-id="note.id">
        <input type="checkbox" />
        <span class="title" v-on:click="edit($event, note.id)">{{ note.title }}</span>
        <span class="date">{{ note.created_at }}</span>
      </li>
    </ul>
    <div id="trash-modal" class="modal hidden">
      <div class="modal-content">
        <div class="modal-header">
          <a href="#" v-on:click="closeModal($event)">
            <img src="dist/img/form_close.png" alt="close" />
          </a>
        </div>
        <div class="modal-body">
          <p>All data will be deleted from the trash forever! Do You really want to continue?</p>
        </div>
        <div class="modal-footer">
          <a href="#" class="btn-primary">Yes</a>
          <a href="#" class="btn-default" v-on:click="closeModal($event)">No</a>
        </div>
      </div>
    </div>
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
      },
      openModal(e) {
        e.preventDefault();
        $('#trash-modal').removeClass('hidden');
        this.$parent.$refs.form.close(e);
      },
      closeModal(e) {
        e.preventDefault();
        $('#trash-modal').addClass('hidden');
      },
      clearTrash(e) {
        e.preventDefault();
        // TODO: delete trash data
      }
    }
  }
</script>