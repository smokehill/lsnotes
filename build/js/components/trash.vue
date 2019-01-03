<template>
  <div id="content">
    <div class="content-header">
      <h4 class="title">Trash</h4>
      <ol class="breadcrumb">
        <li><a href="#" class="breadcrumb-checkbox" v-on:click="selectAll($event)" title="Select all"></a></li>
        <li><a href="#" class="breadcrumb-restore" v-on:click="restoreSelected($event)" title="Restore selected"></a></li>
        <li><a href="#" class="breadcrumb-trash" v-on:click="deleteSelected($event)" title="Delete selected"></a></li>
      </ol>
    </div>
    <div class="content-body">
      <ul class="list" v-if="notes.length > 0">
        <li v-for="note in notes" :data-id="note.id">
          <span class="checkbox" v-on:click="select($event)"></span>
          <span class="title" v-on:click="edit($event, note.id)">{{ note.title }}</span>
          <span class="date">{{ note.created_at }}</span>
        </li>
      </ul>
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
        
        let selected = [];
        let list = $('.list').find('li');
        let lsNotes = lsGet('notes');

        list.each(function(index, li) {
          if ($(li).find('.checkbox').hasClass('on')) {
            selected.push($(li).data('id'));
          }
        });

        if (selected.length > 0 && lsNotes != null) {
          for (let i = 0; i < lsNotes.length; i++) {
            if ($.inArray(lsNotes[i].id, selected) != -1) {
              lsNotes[i].type = 'notes';

              // change note type in form header
              if (lsNotes[i].id == this.$parent.$refs.form.note.id) {
                $('.form-header .text').text('Type [ notes ]');
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
      deleteSelected(e) {
        e.preventDefault();
        
        let selected = [];
        let list = $('.list').find('li');
        let lsNotes = lsGet('notes');

        list.each(function(index, li) {
          if ($(li).find('.checkbox').hasClass('on')) {
            selected.push($(li).data('id'));
          }
        });

        if (selected.length > 0 && lsNotes != null) {
          for (let i = lsNotes.length - 1; i >= 0; i--) {
            if ($.inArray(lsNotes[i].id, selected) != -1) {
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

        $('.breadcrumb-checkbox').removeClass('on');
        
        list.each(function(index, li) {
          $(li).find('.checkbox').removeClass('on');
        });
      }
    }
  }
</script>