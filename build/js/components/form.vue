<template>
  <div class="form hidden">
    <div class="form-wrapper">
      <div class="form-header">
        <span class="text">New</span>
        <ul class="controls">
          <li><a href="#" class="form-show-hide" v-on:click="changeSize($event, 'height')" title="Minimize"></a></li>
          <li><a href="#" class="form-full-screen" v-on:click="changeSize($event, 'width')" title="Full scree"></a></li>
          <li><a href="#" class="form-close" v-on:click="close($event)" title="Close"></a></li>
        </ul>
      </div>
      <div class="form-body">
        <input type="text" v-model="note.title" autocomplete="off">
        <textarea v-model="note.content" v-auto-save></textarea>
        <input type="hidden" name="id" v-model="note.id">
        <input type="hidden" name="type" v-model="note.type">
        <input type="hidden" name="created_at" v-model="note.created_at">
      </div>
      <div class="form-footer-wrapper"></div>
    </div>
    <div class="form-footer">
      <a href="#" class="btn-primary" v-on:click="save($event)">Save</a>
      <span id="process"></span>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { lsGet, lsSet } from './../helpers.js';

  export default {
    name: 'note-form',
    data() {
      return {
        note: {
          id: '',
          type: 'notes',
          title: '',
          content: '',
          is_deleted: false,
          created_at: '',
          updated_at: ''
        },
        typingTimer: '',
        typingInterval: 2000
      }
    },
    filters: {
      strupFirst: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    },
    directives: {
      'auto-save': {
        // TODO: fix autosave
        update: (el, binding, vnode) => {
          $(el).on('keyup', function() {
            if (vnode.context.note.id != '') {
              $('#process').text('Saving...');
              clearTimeout(vnode.context.typingTimer);
              vnode.context.typingTimer = setTimeout(function() {
                let notes = lsGet('notes');
                const updatedAt = vnode.context.__setDate();
                for (let i = 0; i < notes.length; i++) {
                  if (notes[i].id == vnode.context.note.id) {
                    notes[i].title = vnode.context.note.title;
                    notes[i].content = vnode.context.note.content;
                    notes[i].updated_at = updatedAt;
                    break;
                  }
                }
                $('#process').text(`Last edit: ${updatedAt}`);
                lsSet('notes', notes);
              }, vnode.context.typingInterval);
            }
          }).on('keydown', function() {
            clearTimeout(vnode.context.typingTimer);
          });
        }
      },
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
              const type = (notes[i].type == 'notes') ? 'Notes' : 'Trash';
              this.__setType(type);
              $('#process').text(`Last edit: ${this.note.updated_at}`);
              break;
            }
          }
        } else {
          this.__setType('New');
          this.__empty();
        }
        $(this.$el).removeClass('hidden');
        $(this.$el).removeClass('sm');
        const li1 = $(this.$el).find('.controls li:nth-child(1) a');
        const li2 = $(this.$el).find('.controls li:nth-child(2) a');
        li1.removeClass('on');
        if (li2.hasClass('on')) {
          $(this.$el).addClass('lg');
          $('.form-overlay').removeClass('hidden');
        }
        this.__fixInput();
      },
      /**
       * Close form
       */
      close(e) {
        e.preventDefault();
        $(this.$el)
          .addClass('hidden')
          .removeClass('sm')
          .removeClass('lg');
        $(this.$el).find('.controls li:nth-child(1) a').removeClass('on')
        $(this.$el).find('.controls li:nth-child(2) a').removeClass('on');
        $('.form-overlay').addClass('hidden');
        this.__setType('New');
        this.__empty();
      },
      /**
       * Save form data
       */
      save(e) {
        e.preventDefault();
        if (this.note.title == '' || this.note.content == '') {
          if (this.note.title == '') {
            $('.form').find('input[type="text"]').addClass('invalid');
            setTimeout(function() {
              $('.form').find('input[type="text"]').removeClass('invalid');
            }, 1000);
          }
          if (this.note.content == '') {
            $('.form').find('textarea').addClass('invalid');
            setTimeout(function() {
              $('.form').find('textarea').removeClass('invalid');
            }, 1000);
          }
          return false;
        }
        let notes = lsGet('notes');
        const date = this.__setDate();
        $('#process').text('Saving...');
        if (this.note.id == '') {
          const id = this.__setId();
          notes.push({
            id: id,
            type: 'notes',
            title: this.note.title,
            content: this.note.content,
            created_at: date,
            updated_at: date,
          });
          this.note.id = id;
          this.note.type = 'notes';
          this.note.title = this.note.title;
          this.note.content = this.note.content;
          this.note.created_at = date;
        } else {
          for (let i = 0; i < notes.length; i++) {
            if (notes[i].id == this.note.id) {
              notes[i].title = this.note.title;
              notes[i].content = this.note.content;
              notes[i].updated_at = date;
              break;
            }
          }
        }
        const components = this.$parent.$children;
        this.__setType('Notes');
        setTimeout(function() {
          lsSet('notes', notes);
          for (let i = 0; i < components.length; i++) {
            if (components[i].$options.name == 'notes' || components[i].$options.name == 'trash') {
              components[i].init();
            }
          }
          $('#process').text(`Last edit: ${date}`);
        }, 2000);
      },
      /**
       * Handle form window size
       */
      changeSize(e, type) {
        e.preventDefault();
        if (type == 'height') {
          const li1 = $(this.$el).find('.controls li:nth-child(1) a');
          const li2 = $(this.$el).find('.controls li:nth-child(2) a');
          if ($(this.$el).hasClass('sm')) {
            $(this.$el).removeClass('sm');
            if (li2.hasClass('on')) {
              $(this.$el).addClass('lg');
              $('.form-overlay').removeClass('hidden');
            }
            li1.attr('title', 'Minimize');
            li1.removeClass('on');
          } else {
            if ($(this.$el).hasClass('lg')) {
              $(this.$el).removeClass('lg');
              $('.form-overlay').addClass('hidden');
            }
            $(this.$el).addClass('sm');
            li1.attr('title', 'Maximize');
            li1.addClass('on');
          }
        } else if (type == 'width') {
          const li1 = $(this.$el).find('.controls li:nth-child(2) a');
          if ($(this.$el).hasClass('lg')) {
            $(this.$el).removeClass('lg');
            li1.attr('title', 'Full screen');
            li1.removeClass('on');
            $('.form-overlay').addClass('hidden');
          } else {
            if ($(this.$el).hasClass('sm')) {
              $(this.$el).removeClass('sm');
            }
            $(this.$el).addClass('lg');
            li1.attr('title', 'Exit full screen');
            li1.addClass('on');
            $('.form-overlay').removeClass('hidden');
          }
        }
        this.__fixInput();
      },
      /**
       * @internal
       * {...}
       */
      __fixInput() {
        // TODO: code review
        let width = $(this.$el).width() - 50;
        let height = $(this.$el).find('textarea').offset().top - $(this.$el).find('.form-footer').offset().top;
        $(this.$el).find('input').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'height': (Math.abs(height) - 32) +'px'});
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
        $('#process').text('');
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
       * Set note type in header
       */
      __setType(name) {
        $('.form-header .text').text(name);
      }
    }
  }
</script>