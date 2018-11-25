<template>
  <div id="form" v-form-size>
    <div class="wrapper">
      <div class="header">
        <span class="text">Note</span>
        <ul class="controls">
          <li>
            <a href="#" v-on:click="change">
              <img src="dist/img/form_minimize.png" alt="change" />
            </a>
          </li>
          <li>
            <a href="#" v-on:click="close">
              <img src="dist/img/form_close.png" alt="close" />
            </a>
          </li>
        </ul>
      </div>
      <div class="body">
        <input v-model="title" autocomplete="off">
        <textarea v-model="content"></textarea>
        <input type="hidden" v-model="id">
        <input type="hidden" v-model="type">
        <input type="hidden" v-model="date">
      </div>
      <div class="footer-wrapper"></div>
    </div>
    <div class="footer">
      <a href="#" class="btn-save" v-on:click="save">Save</a>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { setId, setDate, lsGet, lsSet } from './../helpers.js';

  export default {
    name: 'note-form',
    data() {
      return {
        id: '',
        type: '',
        title: '',
        content: '',
        date: ''
      }
    },
    directives: {
      'form-size': {
        // TODO
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
          const list = lsGet('list');
          for (let i = 0; i < list.length; i++) {
            if (list[i].id == id) {
              this.id = list[i].id;
              this.type = list[i].type;
              this.title = list[i].title;
              this.content = list[i].content;
              this.date = list[i].date;
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

        let list = lsGet('list');

        if (this.id == '') {
          list.push({
            id: setId(),
            type: 'inbox',
            title: this.title,
            content: this.content,
            date: setDate(),
          });
        } else {
          for (let i = 0; i < list.length; i++) {
            if (list[i].id == this.id) {
              list[i].type = this.type;
              list[i].title = this.title;
              list[i].content = this.content;
              break;
            }
          }
        }

        lsSet('list', list);

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
        // TODO
        let width = $(this.$el).width() - 50;
        let height = $(this.$el).find('textarea').offset().top - $(this.$el).find('.footer').offset().top;
        $(this.$el).find('input').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'height': (Math.abs(height) - 32) +'px'});
      },
      __empty() {
        this.id = '';
        this.type = '';
        this.title = '';
        this.content = '';
        this.date = '';
      }
    }
  }
</script>