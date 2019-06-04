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
        <input type="text" v-model="note.title" autocomplete="off" v-bind:class="{ 'invalid': classes.inputs.isTitleInvalid }" v-bind:style="{ 'width': styles.titleWidth + 'px' }" spellcheck="false" />
        <textarea v-model="note.content" v-bind:class="{ 'invalid': classes.inputs.isContentInvalid }"  v-bind:style="{ 'width': styles.contentWidth + 'px', 'height': styles.contentHeight + 'px' }" spellcheck="false"></textarea>
        <input type="hidden" v-model="note.id">
        <input type="hidden" v-model="note.type">
        <input type="hidden" v-model="note.created_at">
      </div>
    </div>
    <div class="form-footer" ref="formFooter">
      <a href="#" class="btn-primary" v-on:click="save($event)">{{ "form.save_btn"|i18n }}</a>
      <span id="process">{{ processText }}</span>
    </div>
  </div>
</template>

<script>
  import { lsGet, lsSet, formDateFormat, i18n } from './../../helpers.js';
  
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
          let width = vnode.context.$refs.form.offsetWidth - 48;
          let height = vnode.context.$refs.form.offsetHeight - 184;
          // fix title & content sizes
          vnode.context.styles.titleWidth = width;
          vnode.context.styles.contentHeight = height;
          vnode.context.styles.contentWidth = width;
        }
      },
    },
    mounted: function() {
      this.__setHeaderType(i18n('form.title_new'));
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
              this.__setHeaderType(i18n(`form.title_${notes[i].type}`));
              this.__setProcessText(formDateFormat(this.note.updated_at));
              break;
            }
          }
        } else {
          this.__setHeaderType(i18n('form.title_new'));
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
        this.__setHeaderType(i18n('form.title_new'));
        this.__empty();
      },
      /**
       * Save form data
       */
      save(e) {
        e.preventDefault();
        const self = this;
        const date = new Date().getTime();
        const id = Math.floor(Date.now() / 1000);
        self.__setProcessText('');
        if (self.note.title == '' || self.note.content == '') {
          // validate form data (title, content)
          if (self.note.title == '') {
            self.classes.inputs.isTitleInvalid = true;
            setTimeout(function() {
              self.classes.inputs.isTitleInvalid = false;
            }, self.$timeout);
          }
          if (self.note.content == '') {
            self.classes.inputs.isContentInvalid = true;
            setTimeout(function() {
             self.classes.inputs.isContentInvalid = false;
            }, self.$timeout);
          }
          return false;
        } else if (self.note.content.length > 102400) {
          // validate content size (max: 100kb)
          self.classes.inputs.isContentInvalid = true;
          setTimeout(function() {
            self.classes.inputs.isContentInvalid = false;
          }, self.$timeout);
          self.__setProcessText(i18n(`form.status_сontent_size_limit`));
          return false;
        } else {
          // validate LS total size
          let lsTotal = JSON.stringify(localStorage).length;
          let tmpNote = {
            id: id,
            type: 'notes',
            title: self.note.title,
            content: self.note.content,
            created_at: date,
            updated_at: date,
            checked: false
          }
          lsTotal = lsTotal + JSON.stringify(tmpNote).length;
          lsTotal = (lsTotal * 2) / 1024;
          lsTotal = Number(lsTotal.toFixed(0));
          if (lsTotal > 10240) {
            self.classes.inputs.isTitleInvalid = true;
            self.classes.inputs.isContentInvalid = true;
            setTimeout(function() {
              self.classes.inputs.isTitleInvalid = false;
              self.classes.inputs.isContentInvalid = false;
            }, self.$timeout);
            self.__setProcessText(i18n(`form.status_storage_size_limit`));
            return false;
          }
        }
        // update notes
        let notes = lsGet('notes');
        self.__setProcessText(i18n(`form.status_processing`));
        if (self.note.id == '') {
          // add new
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
          // update old
          for (let i = 0; i < notes.length; i++) {
            if (notes[i].id == self.note.id) {
              notes[i].title = self.note.title;
              notes[i].content = self.note.content;
              notes[i].updated_at = date;
              break;
            }
          }
        }
        // save notes and update list
        const components = self.$parent.$children;
        setTimeout(function() {
          lsSet('notes', notes);
          for (let i = 0; i < components.length; i++) {
            if (components[i].$options.name == 'notes-list' || components[i].$options.name == 'trash-list') {
              components[i].$refs.list.init();
            }
          }
          self.__setHeaderType(i18n(`form.title_${self.note.type}`));
          self.__setProcessText(formDateFormat(date));
        }, self.$timeout);
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
       * Set form header type
       */
      __setHeaderType(value) {
        this.headerType = value;
      },
      /**
       * @internal
       * Set form process text
       */
      __setProcessText(text) {
        this.processText = text;
      }
    }
  }
</script>