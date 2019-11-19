<template>
  <ul class="list" v-if="items.length > 0">
    <li v-for="(item, index) in items" v-on:click="edit($event, item.id)" :data-id="item.id" v-bind:class="{ 'hidden': item.is_hidden, '': !item.is_hidden }">
      <i class="fa" v-on:click="select($event, index)" v-bind:class="{ 'fa-checkbox-o': item.is_checked, 'fa-checkbox': !item.is_checked }"></i>
      <span class="title">{{ item.title }}</span>
      <span class="date">{{ item.created_at | listing_date_format }}</span>
    </li>
  </ul>
</template>

<script>
  import { lsGet } from './../../../helpers.js';
  
  export default {
    name: 'list',
    props: ['type'],
    data() {
      return {
        items: []
      }
    },
    mounted: function() {
      this.init();
    },
    methods: {
      /**
       * Initialize notes
       */
      init() {
        const lsNotes = lsGet('notes');
        this.items = [];
        if (lsNotes != null) {
          lsNotes.reverse();
          for (let i = 0; i < lsNotes.length; i++) {
            if (lsNotes[i].type == this.type) {
              this.items.push(lsNotes[i]);
            }
          }
        }
      },
      /**
       * Select note
       */
      select(e, index) {
        this.items[index].is_checked = (!this.items[index].is_checked) ? true : false;
      },
      /**
       * Edit note
       */
      edit(e, id) {
        if (e.target.classList.contains('fa')) {
          return;
        }
        this.$parent.$root.$refs.form.show(id);
      },
      /**
       * Count total notes by type
       */
      count(type) {
        const lsNotes = lsGet('notes');
        let total = 0;
        if (lsNotes != null) {
          for (let i = 0; i < lsNotes.length; i++) {
            if (lsNotes[i].type == type) {
              total = total + 1;
            }
          }
        }
        return total;
      },
    }
  }
</script>