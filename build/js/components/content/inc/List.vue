<template>
  <ul class="list" v-if="items.length > 0">
    <li v-for="(item, index) in items" v-bind:key="item.id" v-on:click="edit($event, item.id)" :data-id="item.id" v-bind:class="{ 'hidden': item.is_hidden, 'active': item.is_active }">
      <i class="fa" v-on:click="select($event, index)" v-bind:class="{ 'fa-checkbox-o': item.is_checked, 'fa-checkbox': !item.is_checked }"></i>
      <span class="title">{{ item.title }}</span>
      <span class="date">{{ item.created_at | listing_date_format }}</span>
    </li>
  </ul>
</template>

<script>
  import { lsGet } from './../../../helpers.js';
  
  export default {
    props: ['type'],
    data() {
      return {
        items: []
      }
    },
    mounted: function () {
      const self = this;
      self.init();

      // track list update
      self.$eventBus.$on('list.update', () => {
        self.init();
      });

      // track clear active note
      self.$eventBus.$on('list.clearActive', () => {
        for (let i = 0; i < self.items.length; i++) {
          self.items[i].is_active = false;
        }
      });
    },
    methods: {
      /**
       * Initialize notes by type.
       */
      init() {
        const lsNotes = lsGet('notes');
        this.items = [];
        if (lsNotes != null) {
          lsNotes.reverse();
          for (let i = 0; i < lsNotes.length; i++) {
            if (lsNotes[i].type == this.type) {
              if (lsNotes[i].id == this.$store.state.noteId) {
                lsNotes[i].is_active = true;
              }
              this.items.push(lsNotes[i]);
            }
          }
        }
      },
      /**
       * Search notes.
       * @param {string} value
       */
      search(value) {
        value = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        if (value == '') {
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].is_hidden = false;
            this.items[i].is_checked = false;
          }
          return false;
        } else {
          var reg = new RegExp(`${value}(.*)`, 'gi');
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].is_checked = false;
            if (this.items[i].title.match(reg) !== null) {
              this.items[i].is_hidden = false;
            } else {
              this.items[i].is_hidden = true;
            }
          }
        }
      },
      /**
       * Select note.
       * @param {object} e
       * @param {int} index
       */
      select(e, index) {
        this.items[index].is_checked = (!this.items[index].is_checked) ? true : false;
      },
      /**
       * Edit note.
       * @param {object} e
       * @param {int} id
       */
      edit(e, id) {
        if (e.target.classList.contains('fa')) {
          return;
        }
        this.$store.commit('rememberNoteId', id);
        this.$eventBus.$emit('modal.open');
        // highlight active
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].id == id) {
            this.items[i].is_active = true;
          } else {
            this.items[i].is_active = false;
          }
        }
      },
      /**
       * Count total notes.
       */
      count() {
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
          if (!this.items[i].is_hidden) {
            total = total + 1;
          }
        }
        return total;
      },
    }
  }
</script>