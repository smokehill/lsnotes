<template>
  <div class="form" v-bind:class="{ 'hidden': classes.isHidden, 'sm': classes.isMini, 'lg': classes.isFullScreen  }" ref="form" v-fix-form>
    <div class="form-wrapper">
      <div class="form-header">
        <span class="text">{{ headerType }}</span>
        <ul class="controls">
          <li v-on:click="changeSize($event, 'height')">
            <i class="fa" v-bind:class="{ 'fa-show-hide-o': classes.controls.isMini, 'fa-show-hide': !classes.controls.isMini }"></i>
          </li>
          <li v-on:click="changeSize($event, 'width')">
            <i class="fa" v-bind:class="{ 'fa-full-screen-o': classes.controls.isFullScreen, 'fa-full-screen': !classes.controls.isFullScreen }"></i>
          </li>
          <li v-on:click="close($event)">
              <i class="fa fa-close"></i>
          </li>
        </ul>
      </div>
      <div class="form-body">
        <input type="text" v-model="note.title" autocomplete="off" v-bind:class="{ 'invalid': classes.inputs.isTitleInvalid }" v-bind:style="{ 'width': styles.titleWidth + 'px' }">
        <textarea v-model="note.content" v-bind:class="{ 'invalid': classes.inputs.isContentInvalid }"  v-bind:style="{ 'width': styles.contentWidth + 'px', 'height': styles.contentHeight + 'px' }"></textarea>
        <input type="hidden" v-model="note.id">
        <input type="hidden" v-model="note.type">
        <input type="hidden" v-model="note.created_at">
      </div>
      <div class="form-footer-wrapper"></div>
    </div>
    <div class="form-footer" ref="formFooter">
      <a href="#" class="btn-primary" v-on:click="save($event)">Save</a>
      <span id="process">{{ processText }}</span>
    </div>
  </div>
</template>

<script>
  import { lsGet, lsSet } from './../../helpers.js';
  export default {
    name: 'form-modal',
    data() {
      return {
        classes: {
          isHidden: true,
          isMini: false,
          isFullScreen: false,
          controls: {
            isMini: false,
            isFullScreen: false
          },
          inputs: {
            isTitleInvalid: false,
            isContentInvalid: false
          },
        },
        styles: {
          titleWidth: 0,
          contentHeight: 0,
          contentWidth: 0
        },
        types: {
          new: 'New',
          notes: 'Notes',
          trash: 'Trash'
        },
        headerType: '',
        processText: '',
        note: {
          id: '',
          type: 'notes',
          title: '',
          content: '',
          created_at: '',
          updated_at: '',
          checked: false
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
          let width = vnode.context.$refs.form.offsetWidth - 50;
          let height = vnode.context.$refs.formFooter.offsetTop - 140;
          // fix title & content sizes
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
        this.classes.isHidden = false;
        this.classes.controls.isMini = false;
        if (this.classes.controls.isFullScreen) {
          this.classes.isFullScreen = true;
          this.$parent.$refs.formOverlay.classes.isHidden = false;
        }
      },
      /**
       * Close form
       */
      close(e) {
        e.preventDefault();
        this.classes.isHidden = true;
        this.classes.isMini = false;
        this.classes.isFullScreen = false;
        this.classes.controls.isMini = false;
        this.classes.controls.isFullScreen = false;
        this.$parent.$refs.formOverlay.classes.isHidden = true;
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
            self.classes.inputs.isTitleInvalid = true;
            setTimeout(function() {
              self.classes.inputs.isTitleInvalid = false;
            }, 1000);
          }
          if (self.note.content == '') {
            self.classes.inputs.isContentInvalid = true;
            setTimeout(function() {
             self.classes.inputs.isContentInvalid = false;
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
            checked: false
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
        setTimeout(function() {
          lsSet('notes', notes);
          for (let i = 0; i < components.length; i++) {
            if (components[i].$options.name == 'notes-list' || components[i].$options.name == 'trash-list') {
              components[i].$refs.list.init();
            }
          }
          self.__setHeaderType(self.note.type);
          self.__setProcessText(`Last edit: ${date}`);
        }, 1000);
      },
      /**
       * Handle form size
       */
      changeSize(e, type) {
        e.preventDefault();
        if (type == 'height') {
          if (this.classes.isMini) {
            // size: normal
            this.classes.isMini = false;
            this.classes.isFullScreen = false;
            this.classes.controls.isMini = false;
            this.classes.controls.isFullScreen = false;
            this.$parent.$refs.formOverlay.classes.isHidden = true;
          } else {
            // size: mini
            this.classes.isMini = true;
            this.classes.isFullScreen = false;
            this.classes.controls.isMini = true;
            this.classes.controls.isFullScreen = false;
            this.$parent.$refs.formOverlay.classes.isHidden = true;
          }
        } else if (type == 'width') {
          if (this.classes.isFullScreen) {
            // size: normal
            this.classes.isMini = false;
            this.classes.isFullScreen = false;
            this.classes.controls.isMini = false;
            this.classes.controls.isFullScreen = false;
            this.$parent.$refs.formOverlay.classes.isHidden = true;
          } else {
            // size: full-screen
            this.classes.isMini = false;
            this.classes.isFullScreen = true;
            this.classes.controls.isMini = false;
            this.classes.controls.isFullScreen = true;
            this.$parent.$refs.formOverlay.classes.isHidden = false;
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
        this.note.created_at = '';
        this.note.updated_at = '';
        this.note.checked = false;
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