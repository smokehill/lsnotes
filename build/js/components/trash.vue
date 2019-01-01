<template>
  <div class="content-wrapper">
    <h4 class="title">Trash</h4>
    <ol class="breadcrumb">
      <li><a href="#" class="breadcrumb-checkbox" v-on:click="selectAll($event)" title="Select all"></a></li>
      <li><a href="#" class="breadcrumb-restore" v-on:click="restoreSelected($event)" title="Restore selected"></a></li>
      <li><a href="#" class="breadcrumb-trash" v-on:click="openModal($event)" title="Clear trash"></a></li>
    </ol>
    <ul class="list" v-if="notes.length > 0">
      <li v-for="note in notes" :data-id="note.id">
        <span class="checkbox" v-on:click="select($event)"></span>
        <span class="title" v-on:click="edit($event, note.id)">{{ note.title }}</span>
        <span class="date">{{ note.created_at }}</span>
      </li>
    </ul>
    <div id="trash-modal" class="modal hidden">
      <div class="modal-content">
        <div class="modal-header">
          <a href="#" class="modal-close" v-on:click="closeModal($event)"></a>
        </div>
        <div class="modal-body">
          <p>All data will be deleted from the trash forever! Do You really want to continue?</p>
        </div>
        <div class="modal-footer">
          <a href="#" class="btn-primary" v-on:click="clearTrash($event)">Yes</a>
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
      select(e) {
        $(e.target).hasClass('on') ? $(e.target).removeClass('on') : $(e.target).addClass('on');
      },
      selectAll(e) {
        e.preventDefault();

        let status = 'on';

        $(e.target).hasClass('on') ? $(e.target).removeClass('on') : $(e.target).addClass('on');

        if (!$(e.target).hasClass('on')) {
          status = 'off';
        }

        // Reset checked values

        const list = $('.list').find('li');

        list.each(function(index, li) {

            let el = $(li).find('.checkbox');

            if (status == 'on' && !el.hasClass('on')) {
              el.addClass('on');
            }

            if (status == 'off' && el.hasClass('on')) {
              el.removeClass('on');
            }
        });
      },
      restoreSelected(e) {
        e.preventDefault();
        
        let restored = [];
        let list = $('.list').find('li');
        let lsNotes = lsGet('notes');

        list.each(function(index, li) {
            if ($(li).find('.checkbox').hasClass('on')) {
              restored.push($(li).data('id'));
            }
        });

        if (restored.length > 0 && lsNotes != null) {

          for (let i = 0; i < lsNotes.length; i++) {
            if ($.inArray(lsNotes[i].id, restored) != -1) {
              lsNotes[i].type = 'inbox';

              // change note type in form header
              if (lsNotes[i].id == this.$parent.$refs.form.note.id) {
                $('.form-header .text').text('Note [ inbox ]');
              }
            }
          }

          lsSet('notes', lsNotes);
          this.init();
        }

        $('.breadcrumb-checkbox').removeClass('on');
        
        list.each(function(index, li) {
            $(li).find('.checkbox').removeClass('on');
        });
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
        let lsNotes = lsGet('notes');

        if (lsNotes != null) {

          for (let i = lsNotes.length - 1; i >= 0; i--) {
            if (lsNotes[i].type == 'trash') {
              lsNotes.splice(i, 1);
            }
          }

          lsSet('notes', lsNotes);
          this.init();
          this.closeModal(e);
        }
      }
    }
  }
</script>