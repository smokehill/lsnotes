<template>
  <ul class="list" v-if="items.length > 0">
    <li v-for="(item, index) in items" v-on:click="edit($event, item.id)" :data-id="item.id">
      <i class="fa" v-on:click="select($event, index)" v-bind:class="{ 'fa-checkbox-o': item.checked, 'fa-checkbox': !item.checked }"></i>
      <span class="title">{{ item.title }}</span>
      <span class="date">{{ item.created_at }}</span>
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
        this.items[index].checked = (!this.items[index].checked) ? true : false;
      },
      /**
       * Edit note
       */
      edit(e, id) {
        if (e.target.classList.contains('fa')) {
          return;
        }
        this.$parent.$root.$refs.form.show(id);
      }
    }
  }
</script>