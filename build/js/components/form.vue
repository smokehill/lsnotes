<template>
  <section>
    <div class="form-overlay" v-bind:class="{ hidden: classes.formOverlay.isHidden }"></div>
    <div class="form" v-bind:class="{ hidden: classes.form.isHidden, sm: classes.form.isSmall, lg: classes.form.isBig  }" v-fix-form ref="modal">
      <div class="form-wrapper">
        <div class="form-header">
          <span class="text">{{ headerType }}</span>
          <ul class="controls">
            <li><a href="#" class="form-show-hide" v-bind:class="{ on: classes.formControls.isSmall }" v-on:click="changeSize($event, 'height')"></a></li>
            <li><a href="#" class="form-full-screen" v-bind:class="{ on: classes.formControls.isFullScreen }" v-on:click="changeSize($event, 'width')"></a></li>
            <li><a href="#" class="form-close" v-on:click="close($event)"></a></li>
          </ul>
        </div>
        <div class="form-body">
          <input type="text" v-model="note.title" autocomplete="off" v-bind:class="{ invalid: classes.title.isInvalid }" v-bind:style="{ width: styles.titleWidth + 'px' }">
          <textarea v-model="note.content" v-bind:class="{ invalid: classes.content.isInvalid }"  v-bind:style="{ width: styles.contentWidth + 'px', height: styles.contentHeight + 'px' }"></textarea>
          <input type="hidden" name="id" v-model="note.id">
          <input type="hidden" name="type" v-model="note.type">
          <input type="hidden" name="created_at" v-model="note.created_at">
        </div>
        <div class="form-footer-wrapper"></div>
      </div>
      <div class="form-footer" ref="modalFooter">
        <a href="#" class="btn-primary" v-on:click="save($event)">Save</a>
        <span id="process">{{ processText }}</span>
      </div>
    </div>
  </section>
</template>

<script>
  import { lsGet, lsSet } from './../helpers.js';

  export default {
    name: 'note-form',
    data() {
      return {
        classes: {
          form: { isHidden: true, isSmall: false, isBig: false },
          formOverlay: { isHidden: true },
          formControls: { isSmall: false, isFullScreen: false },
          title: { isInvalid: false },
          content: { isInvalid: false }
        },
        styles: { titleWidth: 0, contentHeight: 0, contentWidth: 0 },
        types: { new: 'New', notes: 'Notes', trash: 'Trash'},
        headerType: '',
        processText: '',
        note: {
          id: '',
          type: 'notes',
          title: '',
          content: '',
          is_deleted: false,
          created_at: '',
          updated_at: ''
        }
      }
    },
    filters: {
      strupFirst: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    },
    directives: {
      'fix-form': {
       update: (el, binding, vnode) => {
          let width = vnode.context.$refs.modal.offsetWidth - 50;
          let height = vnode.context.$refs.modalFooter.offsetTop - 140;
          vnode.context.styles.titleWidth = width;
          vnode.context.styles.contentHeight = height;
          vnode.context.styles.contentWidth = width;
        }
      },
    },
    mounted: function() {
      this.__setHeaderType('new');
    },
    methods: {
      /**
       * Show form
       */
      show(id = null) {
        if (id != null) {
          const notes = lsGet('notes');
          for (let i = 0; i < notes.length; i++) {
            if (notes[i].id == id) {
              this.note.id = notes[i].id;
              this.note.type = notes[i].type;
              this.note.title = notes[i].title;
              this.note.content = notes[i].content;
              this.note.created_at = notes[i].created_at;
              this.note.updated_at = notes[i].updated_at;
              this.__setHeaderType(notes[i].type);
              this.__setProcessText(`Last edit: ${this.note.updated_at}`);
              break;
            }
          }
        } else {
          this.__setHeaderType('new');
          this.__empty();
        }
        // handle classes
        this.classes.form.isHidden = false;
        this.classes.formControls.isSmall = false;
        if (this.classes.formControls.isFullScreen) {
          this.classes.form.isBig = true;
          this.classes.formOverlay.isHidden = false;
        }
        // this.__fixInput();
      },
      /**
       * Close form
       */
      close(e) {
        e.preventDefault();
        // handle classes
        this.classes.formOverlay.isHidden = true;
        this.classes.form.isHidden = true;
        this.classes.form.isSmall = false;
        this.classes.form.isBig = false;
        this.classes.formControls.isSmall = false;
        this.classes.formControls.isFullScreen = false;
        this.__setHeaderType('new');
        this.__empty();
      },
      /**
       * Save form data
       */
      save(e) {
        e.preventDefault();
        const self = this;
        if (self.note.title == '' || self.note.content == '') {
          if (self.note.title == '') {
            self.classes.title.isInvalid = true;
            setTimeout(function() {
              self.classes.title.isInvalid = false;
            }, 1000);
          }
          if (self.note.content == '') {
            self.classes.content.isInvalid = true;
            setTimeout(function() {
             self.classes.content.isInvalid = false;
            }, 1000);
          }
          return false;
        }
        let notes = lsGet('notes');
        const date = self.__setDate();
        self.__setProcessText('Saving...');
        if (self.note.id == '') {
          const id = self.__setId();
          notes.push({
            id: id,
            type: 'notes',
            title: self.note.title,
            content: self.note.content,
            created_at: date,
            updated_at: date,
          });
          self.note.id = id;
          self.note.type = 'notes';
          self.note.title = self.note.title;
          self.note.content = self.note.content;
          self.note.created_at = date;
        } else {
          for (let i = 0; i < notes.length; i++) {
            if (notes[i].id == self.note.id) {
              notes[i].title = self.note.title;
              notes[i].content = self.note.content;
              notes[i].updated_at = date;
              break;
            }
          }
        }
        const components = self.$parent.$children;
        self.__setHeaderType('notes');
        setTimeout(function() {
          lsSet('notes', notes);
          for (let i = 0; i < components.length; i++) {
            if (components[i].$options.name == 'notes' || components[i].$options.name == 'trash') {
              components[i].init();
            }
          }
          self.__setProcessText(`Last edit: ${date}`);
        }, 2000);
      },
      /**
       * Handle form size
       */
      changeSize(e, type) {
        e.preventDefault();
        if (type == 'height') {
          if (this.classes.form.isSmall) {
            // size: normal
            this.classes.form.isSmall = false;
            this.classes.form.isBig = false;
            this.classes.formControls.isSmall = false;
            this.classes.formControls.isFullScreen = false;
            this.classes.formOverlay.isHidden = true;
          } else {
            // size: mini
            this.classes.form.isSmall = true;
            this.classes.form.isBig = false;
            this.classes.formControls.isSmall = true;
            this.classes.formControls.isFullScreen = false;
            this.classes.formOverlay.isHidden = true;
          }
        } else if (type == 'width') {
          if (this.classes.form.isBig) {
            // size: normal
            this.classes.form.isSmall = false;
            this.classes.form.isBig = false;
            this.classes.formControls.isSmall = false;
            this.classes.formControls.isFullScreen = false;
            this.classes.formOverlay.isHidden = true;
          } else {
            // size: full-screen
            this.classes.form.isSmall = false;
            this.classes.form.isBig = true;
            this.classes.formControls.isSmall = false;
            this.classes.formControls.isFullScreen = true;
            this.classes.formOverlay.isHidden = false;
          }
        }
      },
      /**
       * @internal
       * Reset form data
       */
      __empty() {
        this.note.id = '';
        this.note.type = 'notes';
        this.note.title = '';
        this.note.content = '';
        this.note.is_deleted = false;
        this.note.created_at = '';
        this.note.updated_at = '';
        this.__setProcessText('');
      },
      /**
       * @internal
       * Generate ID for a note
       */
      __setId() {
        return Math.floor(Date.now() / 1000);
      },
      /**
       * @internal
       * Convert UTC to local
       */
      __setDate() {
        let date = new Date().toLocaleString() + ' UTC';
        date = new Date(date);
        date = date.toISOString();
        date = date.replace('T', ' ');
        return date.replace(/\.([a-zA-Z0-9]+)/, '');
      },
      /**
       * @internal
       */
      __setHeaderType(key) {
        this.headerType = this.types[key];
      },
      /**
       * @internal
       */
      __setProcessText(text) {
        this.processText = text;
      }
    }
  }
</script>