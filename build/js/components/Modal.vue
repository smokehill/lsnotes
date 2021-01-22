<template>
  <div>
    <div class="modal-overlay" v-bind:class="{ hidden: classes.overlayIsHidden }"></div>
    <div class="modal" v-bind:class="{ 'hidden': classes.isHidden, 'sm': classes.isMini, 'lg': classes.isFullScreen  }" ref="modal" v-fix-modal>
      <div class="modal-wrapper">
        <div class="modal-header">
          <span class="text">{{ headerType }}</span>
          <ul class="controls">
            <li v-on:click="changeSize($event, 'height')">
              <i class="fa" v-bind:class="{ 'fa-show-hide-o': classes.controls.isMini, 'fa-show-hide': !classes.controls.isMini }"></i>
            </li>
            <li v-on:click="changeSize($event, 'width')">
              <i class="fa" v-bind:class="{ 'fa-full-screen-o': classes.controls.isFullScreen, 'fa-full-screen': !classes.controls.isFullScreen }"></i>
            </li>
            <li v-on:click="close()">
              <i class="fa fa-close"></i>
            </li>
          </ul>
        </div>
        <div class="modal-body">
          <input type="text" v-model="note.title" autocomplete="off" :placeholder="'modal.input_title_placeholder'|i18n" v-bind:style="{ 'width': styles.titleWidth + 'px' }" spellcheck="false" />
          <textarea v-model="note.content" v-bind:style="{ 'width': styles.contentWidth + 'px', 'height': styles.contentHeight + 'px' }" v-bind:class="{ 'text-small': textFormat == 'small', 'text-normal': textFormat == 'normal', 'text-big': textFormat == 'big' }" spellcheck="false"></textarea>
          <input type="hidden" v-model="note.id">
          <input type="hidden" v-model="note.type">
          <input type="hidden" v-model="note.created_at">
        </div>
      </div>
      <div class="modal-footer" ref="modalFooter">
        <a href="#" class="btn-primary" v-on:click="save($event)">{{ "modal.save_btn"|i18n }}</a>
        <a href="#" class="btn-text-format fa fa-text-format" v-on:click="toogleTextFormatList($event)">
          <ul v-bind:class="{ 'hidden': classes.textFormatList.isHidden }">
            <li v-bind:class="{ 'active': textFormat == 'small' }" v-on:click="setTextFormat('small')">{{ "modal.text_format_small"|i18n }}</li>
            <li v-bind:class="{ 'active': textFormat == 'normal' }" v-on:click="setTextFormat('normal')">{{ "modal.text_format_normal"|i18n }}</li>
            <li v-bind:class="{ 'active': textFormat == 'big' }" v-on:click="setTextFormat('big')">{{ "modal.text_format_big"|i18n }}</li>
          </ul>
        </a>
        <span id="process">{{ processText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { lsGet, lsSet, modalDateFormat, i18n } from './../helpers.js';
  
  export default {
    data() {
      return {
        classes: {
          overlayIsHidden: true,
          isHidden: true,
          isMini: false,
          isFullScreen: false,
          controls: { isMini: false, isFullScreen: false },
          textFormatList: { isHidden: true }
        },
        styles: { titleWidth: 0, contentHeight: 0, contentWidth: 0 },
        types: { new: 'New', notes: 'Notes', trash: 'Trash' },
        headerType: '',
        processText: '',
        textFormat: 'small',
        note: {
          id: '',
          type: 'notes',
          title: '',
          content: '',
          created_at: '',
          updated_at: ''
        }
      }
    },
    filters: {
      strupFirst: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    },
    directives: {
      'fix-modal': {
       update: (el, binding, vnode) => {
          let width = vnode.context.$refs.modal.offsetWidth - 28;
          let height = vnode.context.$refs.modal.offsetHeight - 159;
          // fix title & content sizes
          vnode.context.styles.titleWidth = width;
          vnode.context.styles.contentHeight = height;
          vnode.context.styles.contentWidth = width;
        }
      },
    },
    mounted: function () {
      const self = this;

      window.addEventListener('resize', self.minimize);
      window.addEventListener('click', (e) => {
        // check if click was outside text-format popup
        if (!e.target.classList.contains('fa-text-format')) {
          if (!self.classes.textFormatList.isHidden) {
            self.classes.textFormatList.isHidden = true;
          }
        }
      });

      self.setHeaderType(i18n('modal.title_new'));
      self.textFormat = lsGet('text_format');

      // track open event
      self.$eventBus.$on('modal.open', () => {
        self.show();
      });

      // track close event
      self.$eventBus.$on('modal.close', () => {
        self.close();
      });

      // track notes type changes
      self.$eventBus.$on('modal.changeHeader', (value) => {
        self.setHeaderType(i18n(`modal.title_${value}`));
      });
    },
    methods: {
      /**
       * Show modal.
       */
      show() {
        const id = this.$store.state.noteId;
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
              this.setHeaderType(i18n(`modal.title_${notes[i].type}`));
              this.setProcessText(modalDateFormat(this.note.updated_at));
              break;
            }
          }
        } else {
          this.setHeaderType(i18n('modal.title_new'));
          this.empty();
        }
        if (this.classes.isHidden) {
          this.classes.isHidden = false;
          if (this.classes.controls.isFullScreen) {
            this.classes.isFullScreen = true;
            this.classes.overlayIsHidden = false;
          }
        }
      },
      /**
       * Close modal.
       */
      close() {
        this.classes.isHidden = true;
        this.classes.isMini = false;
        this.classes.isFullScreen = false;
        this.classes.controls.isMini = false;
        this.classes.controls.isFullScreen = false;
        this.classes.overlayIsHidden = true;

        this.setHeaderType(i18n('modal.title_new'));
        this.empty();

        this.$store.commit('rememberNoteId', null);
        this.$eventBus.$emit('list.clearActive');
      },
      /**
       * Save modal data.
       * @param {object} e
       */
      save(e) {
        e.preventDefault();
        const self = this;
        const date = new Date().getTime();
        const id = Math.floor(Date.now() / 1000);
        self.setProcessText('');

        if (self.note.title == '') {
          // validate modal data
          self.setProcessText(i18n(`modal.status_title_required`));
          return false;
        } else if (self.note.content.length > 102400) {
          // validate content size (max: 100kb)
          self.setProcessText(i18n(`modal.status_сontent_size_limit`));
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
            is_checked: false,
            is_hidden: false,
            is_active: false
          }

          lsTotal = lsTotal + JSON.stringify(tmpNote).length;
          lsTotal = (lsTotal * 2) / 1024;
          lsTotal = Number(lsTotal.toFixed(0));

          if (lsTotal > chrome.storage.local.QUOTA_BYTES) {
            self.setProcessText(i18n(`modal.status_storage_size_limit`));
            return false;
          }
        }

        // update notes
        let notes = lsGet('notes');
        self.setProcessText(i18n(`modal.status_processing`));

        if (self.note.id == '') {
          // add new
          notes.push({
            id: id,
            type: 'notes',
            title: self.note.title,
            content: self.note.content,
            created_at: date,
            updated_at: date,
            is_checked: false,
            is_hidden: false,
            is_active: false
          });

          self.note.id = id;
          self.note.type = 'notes';
          self.note.title = self.note.title;
          self.note.content = self.note.content;
          self.note.created_at = date;
          self.$store.commit('rememberNoteId', id);
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
        setTimeout(() => {
          lsSet('notes', notes);
          self.setHeaderType(i18n(`modal.title_${self.note.type}`));
          self.setProcessText(modalDateFormat(date));
          self.$eventBus.$emit('list.update');
        }, self.$timeout);
      },
      /**
       * Handle modal size.
       * @param {object} e
       * @param {string} type
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
            this.classes.overlayIsHidden = true;
          } else {
            // size: mini
            this.classes.isMini = true;
            this.classes.isFullScreen = false;
            this.classes.controls.isMini = true;
            this.classes.controls.isFullScreen = false;
            this.classes.overlayIsHidden = true;
          }
        } else if (type == 'width') {
          if (this.classes.isFullScreen) {
            // size: normal
            this.classes.isMini = false;
            this.classes.isFullScreen = false;
            this.classes.controls.isMini = false;
            this.classes.controls.isFullScreen = false;
            this.classes.overlayIsHidden = true;
          } else {
            // size: full-screen
            this.classes.isMini = false;
            this.classes.isFullScreen = true;
            this.classes.controls.isMini = false;
            this.classes.controls.isFullScreen = true;
            this.classes.overlayIsHidden = false;
          }
        }
      },
      /**
      * Toogle text formats in footer.
      * @param {object} e
      */
      toogleTextFormatList(e) {
        e.preventDefault();
        if (e.target.classList.contains('fa-text-format')) {
          if (this.classes.textFormatList.isHidden) {
            this.classes.textFormatList.isHidden = false;
          } else {
            this.classes.textFormatList.isHidden = true;
          }
        }
      },
      /**
      * Set text format for a note content.
      * @param {string} type
      */
      setTextFormat(type) {
        this.textFormat = type;
        this.classes.textFormatList.isHidden = true;
        lsSet('text_format', type);
      },
      /**
      * Minimize on browser window resize.
      */
      minimize() {
        if (this.classes.isHidden == false) {
          this.classes.isMini = true;
          this.classes.isFullScreen = false;
          this.classes.controls.isMini = true;
          this.classes.controls.isFullScreen = false;
          this.classes.overlayIsHidden = true;
        }
      },
      /**
       * Reset modal data.
       */
      empty() {
        this.note.id = '';
        this.note.type = 'notes';
        this.note.title = '';
        this.note.content = '';
        this.note.created_at = '';
        this.note.updated_at = '';
        this.setProcessText('');
      },
      /**
       * Set modal header type.
       * @param {string} value
       */
      setHeaderType(value) {
        this.headerType = value;
      },
      /**
       * Set modal process text.
       * @param {string} text
       */
      setProcessText(text) {
        this.processText = text;
      }
    }
  }
</script>