<template>
  <div class="content" v-bind:class="{ 'lg': isSidebarMini }">
    <div class="content-header fixed">
      <h4 class="title">{{ "list.title_notes"|i18n }}</h4>
      <div class="controls">
        <ol class="breadcrumb">
          <li v-on:click="selectAll($event)" :data-tooltip="'list.breadcrumb_select'|i18n">
            <i class="fa" v-bind:class="{ 'fa-checkbox-o': selectedAll, 'fa-checkbox': !selectedAll }"></i>
          </li>
          <li v-on:click="deleteSelected($event)" :data-tooltip="'list.breadcrumb_delete'|i18n">
            <i class="fa fa-trash"></i>
          </li>
        </ol>
        <span class="total">{{ "list.breadcrumb_total"|i18n }}: {{ total }}</span>
      </div>
    </div>
    <div class="content-body fixed">
      <list ref="list" v-bind:type="type"></list>
    </div>
  </div>
</template>

<script>
  import List from './inc/List.vue';
  import { lsGet, lsSet, i18n } from './../../helpers.js';
  
  export default {
    name: 'notes-list',
    data() {
      return {
        type: 'notes',
        total: 0,
        selectedAll: false,
        isSidebarMini: false
      }
    },
    components: {
      'list': List
    },
    mounted: function() {
      this.$parent.$refs.sidebar.highlightMenu();
      this.isSidebarMini = lsGet('sidebar_mini');
      this.total = this.$refs.list.count(this.type);
    },
    methods: {
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
        for (let i = 0; i < this.$refs.list.items.length; i++) {
          if (status == 'on' && !this.$refs.list.items[i].checked) {
            this.$refs.list.items[i].checked = true;
          } else if (status == 'off' && this.$refs.list.items[i].checked) {
            this.$refs.list.items[i].checked = false;
          }
        }
      },
      /**
       * Move selected notes to trash
       */
      deleteSelected(e) {
        e.preventDefault();
        let selected = [];
        let lsNotes = lsGet('notes');
        for (let i = 0; i < this.$refs.list.items.length; i++) {
          if (this.$refs.list.items[i].checked) {
            selected.push(this.$refs.list.items[i].id);
          }
        }
        if (selected.length > 0 && lsNotes != null) {
          for (let i = 0; i < lsNotes.length; i++) {
            if (selected.indexOf(lsNotes[i].id) != -1) {
              lsNotes[i].type = 'trash';
              lsNotes[i].checked = false;
              // change note type in form header
              if (lsNotes[i].id == this.$parent.$refs.form.note.id) {
                this.$parent.$refs.form.note.type = lsNotes[i].type;
                this.$parent.$refs.form.__setHeaderType(i18n('form.title_trash'));
              }
            }
          }
          lsSet('notes', lsNotes);
          this.$refs.list.init();
        }
        this.selectedAll = false;
        this.total = this.$refs.list.count(this.type);
      }
    }
  }
</script>