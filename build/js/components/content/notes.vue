<template>
  <div id="content">
    <div class="content-header fixed">
      <h4 class="title">Notes</h4>
      <ol class="breadcrumb">
        <li><a href="#" class="breadcrumb-checkbox" v-on:click="selectAll($event)" title="Select all"></a></li>
        <li><a href="#" class="breadcrumb-trash" v-on:click="deleteSelected($event)" title="Delete selected"></a></li>
      </ol>
    </div>
    <div class="content-body fixed">
      <ul class="list" v-if="notes.length > 0">
        <li v-for="note in notes" v-on:click="edit($event, note.id)" :data-id="note.id" >
          <span class="checkbox" v-on:click="select($event)"></span>
          <span class="title">{{ note.title }}</span>
          <span class="date">{{ note.created_at }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { lsGet, lsSet } from './../../helpers.js';

  export default {
    name: 'notes',
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
      /**
       * Initialize base params
       */
      init() {
        const lsNotes = lsGet('notes');
        this.notes = [];
        if (lsNotes != null) {
          for (let i = 0; i < lsNotes.length; i++) {
            if (lsNotes[i].type == 'notes') {
              this.notes.push(lsNotes[i]);
            }
          }
        }
      },
      /**
       * Edit note
       */
      edit(e, id) {
        if ($(e.target).hasClass('checkbox')) {
          return;
        }
        this.$parent.$refs.form.show(id);
      },
      /**
       * Select note
       */
      select(e) {
        $(e.target).hasClass('on') ? $(e.target).removeClass('on') : $(e.target).addClass('on');
      },
      /**
       * Select all notes
       */
      selectAll(e) {
        e.preventDefault();
        let status = 'on';
        $(e.target).hasClass('on') ? $(e.target).removeClass('on') : $(e.target).addClass('on');
        if (!$(e.target).hasClass('on')) {
          status = 'off';
        }
        // reset checked values
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
      /**
       * Move selected notes to trash
       */
      deleteSelected(e) {
        e.preventDefault();
        let deleted = [];
        let list = $('.list').find('li');
        let lsNotes = lsGet('notes');
        list.each(function(index, li) {
          if ($(li).find('.checkbox').hasClass('on')) {
            deleted.push($(li).data('id'));
          }
        });
        if (deleted.length > 0 && lsNotes != null) {
          for (let i = 0; i < lsNotes.length; i++) {
            if ($.inArray(lsNotes[i].id, deleted) != -1) {
              lsNotes[i].type = 'trash';
              // change note type in form header
              if (lsNotes[i].id == this.$parent.$refs.form.note.id) {
                $('.form-header .text').text('Note [ trash ]');
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
      }
    }
  }
</script>