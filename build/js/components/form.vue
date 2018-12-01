<template>
  <div id="form" v-form-size>
    <div class="wrapper">
      <div class="header">
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
      <div class="body">
        <input v-model="note.title" autocomplete="off">
        <textarea v-model="note.content"></textarea>
        <input type="hidden" v-model="note.id">
        <input type="hidden" v-model="note.type">
        <input type="hidden" v-model="note.date">
      </div>
      <div class="footer-wrapper"></div>
    </div>
    <div class="footer">
      <a href="#" class="btn-save" v-on:click="save($event)">Save</a>
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
          type: 'inbox', // [inbox, draft]
          date: ''
        }
      }
    },
    directives: {
      'form-size': {
        // TODO: code review
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
        },
      }
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
              this.note.date = notes[i].date;

              this.type = notes[i].type;
              break;
            }
          }
        }
  
        $(this.$el).addClass('active');
        this.__fixInput();
      },
      close(e) {
        e.preventDefault();

        $(this.$el)
          .removeClass('active')
          .removeClass('small')
          .find('.controls a:first img').attr('src', 'dist/img/form_minimize.png');

        this.__empty();
      },
      save(e) {
        e.preventDefault();

        if (this.title == '' || this.content == '') {
          return false;
        }

        let notes = lsGet('notes');

        if (this.id == '') {
          notes.push({
            id: this.__setId(),
            type: 'inbox',
            title: this.title,
            content: this.content,
            date: this.__setDate(),
          });
        } else {
          for (let i = 0; i < notes.length; i++) {
            if (notes[i].id == this.note.id) {
              notes[i].type = this.note.type;
              notes[i].title = this.note.title;
              notes[i].content = this.note.content;
              break;
            }
          }
        }

        lsSet('notes', notes);

        // TODO: find better solution
        const components = this.$parent.$children;

        for (let i = 0; i < components.length; i++) {
          if (components[i].$options.name == 'inbox'
            || components[i].$options.name == 'trash'
            || components[i].$options.name == 'draft') {
              components[i].init();
          }
        }

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
        let height = $(this.$el).find('textarea').offset().top - $(this.$el).find('.footer').offset().top;
        $(this.$el).find('input').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'height': (Math.abs(height) - 32) +'px'});
      },
      __empty() {
        this.note.id = '';
        this.note.type = '';
        this.note.title = '';
        this.note.content = '';
        this.note.date = '';
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