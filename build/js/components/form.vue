<template>
  <div class="form" v-resize>
    <div class="form-wrapper">
      <div class="form-header">
        <span class="text">Note [ {{type}} ]</span>
        <ul class="controls">
          <li>
            <a href="#" v-on:click="change($event)">
              <img src="dist/img/form_minimize.png" alt="change" />
            </a>
          </li>
          <li>
            <a href="#" v-on:click="close($event)">
              <img src="dist/img/form_close.png" alt="close" />
            </a>
          </li>
        </ul>
      </div>
      <div class="form-body">
        <input v-model="note.title" autocomplete="off">
        <textarea v-model="note.content" v-auto-save></textarea>
        <input type="hidden" name="id" v-model="note.id">
        <input type="hidden" name="type" v-model="note.type">
        <input type="hidden" name="created_at" v-model="note.created_at">
      </div>
      <div class="form-footer-wrapper"></div>
    </div>
    <div class="form-footer">
      <a href="#" class="btn-primary" v-on:click="save($event)">Save</a>
      <span id="process" class="hidden">Saving...</span>
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
        type: 'new',
        note: {
          id: '',
          type: '',
          title: '',
          content: '',
          is_deleted: false,
          type: 'inbox', // available types [inbox, trash]
          created_at: ''
        }
      }
    },
    directives: {
      'auto-save': {
        update: (el, binding, vnode) => {
          var typingTimer;
          var typingInterval = 3000;

          $(el).on('keyup', function() {

            if (vnode.context.note.id != '') {
              $('#process').removeClass('hidden');
              clearTimeout(typingTimer);

              typingTimer = setTimeout(function() {
                $('#process').addClass('hidden');
                let notes = lsGet('notes');

                for (let i = 0; i < notes.length; i++) {
                  if (notes[i].id == vnode.context.note.id) {
                    notes[i].title = vnode.context.note.title;
                    notes[i].content = vnode.context.note.content;
                    break;
                  }
                }

                lsSet('notes', notes);
              }, typingInterval);
            }
          }).on('keydown', function() {
            clearTimeout(typingTimer);
          });
        }
      },
      'resize': {
        bind: (el) => {
          window.addEventListener('resize', () => {
            if ($(el).hasClass('active')) {
              $(el).addClass('small');
              $(el).find('.controls a:first img').attr('src', 'dist/img/form_maximize.png');
            }
          });
        },
        unbind: (el) => {
          window.removeEventListener('resize', () => {
            $(el).removeClass('small');
            $(el).find('.controls a:first img').attr('src', 'dist/img/form_minimize.png');
          });
        }
      },
    },
    methods: {
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

              this.type = notes[i].type;
              break;
            }
          }
        }
  
        $(this.$el).addClass('active');
        $(this.$el).removeClass('small');
        $(this.$el).find('.controls a:first img').attr('src', 'dist/img/form_minimize.png');
        this.__fixInput();
      },
      close(e) {
        e.preventDefault();

        $(this.$el)
          .removeClass('active')
          .removeClass('small')
          .find('.controls a:first img').attr('src', 'dist/img/form_minimize.png');
        
        this.type = 'new';
        this.__empty();
      },
      save(e) {
        e.preventDefault();

        if (this.note.title == '' || this.note.content == '') {
          return false;
        }

        let notes = lsGet('notes');

        $('#process').removeClass('hidden');

        if (this.note.id == '') {
          notes.push({
            id: this.__setId(),
            type: 'inbox',
            title: this.note.title,
            content: this.note.content,
            created_at: this.__setDate(),
            updated_at: this.__setDate(),
          });
        } else {
          for (let i = 0; i < notes.length; i++) {
            if (notes[i].id == this.note.id) {
              notes[i].title = this.note.title;
              notes[i].content = this.note.content;
              notes[i].updated_at = this.__setDate();
              break;
            }
          }
        }

        const components = this.$parent.$children;

        setTimeout(function() {
          lsSet('notes', notes);

          for (let i = 0; i < components.length; i++) {
            if (components[i].$options.name == 'inbox'
              || components[i].$options.name == 'trash') {
                components[i].init();
            }
          }
          $('#process').addClass('hidden');
        }, 3000);


      },
      change(e) {
        e.preventDefault();
        if ($(this.$el).hasClass('small')) {
          $(this.$el).removeClass('small');
          $(this.$el).find('.controls a:first img').attr('src', 'dist/img/form_minimize.png');
        } else {
          $(this.$el).addClass('small');
          $(this.$el).find('.controls a:first img').attr('src', 'dist/img/form_maximize.png');
        }
        this.__fixInput();
      },
      __fixInput() {
        // TODO: code review
        let width = $(this.$el).width() - 50;
        let height = $(this.$el).find('textarea').offset().top - $(this.$el).find('.form-footer').offset().top;
        $(this.$el).find('input').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'height': (Math.abs(height) - 32) +'px'});
      },
      __empty() {
        this.note.id = '';
        this.note.type = '';
        this.note.title = '';
        this.note.content = '';
        this.note.created_at = '';
        this.note.updated_at = '';
      },
      __setId() {
        return Math.floor(Date.now() / 1000);
      },
      __setDate() {
        let date = new Date().toISOString();
        date = date.replace('T', ' ');

        return date.replace(/\.([a-zA-Z0-9]+)/, '');
      }
    }
  }
</script>