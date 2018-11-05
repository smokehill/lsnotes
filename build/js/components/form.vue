<template>
  <div id="note-form" v-form-size>
    <div class="wrapper">
      <div class="header">
        <span class="text">Note</span>
        <ul class="controls">
          <li>
            <a href="#" v-on:click="change">
              <img src="dist/img/form_minus.png" alt="change" />
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
        <textarea v-model="text"></textarea>
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

  export default {
    name: 'note-form',
    data() {
      return {
        title: '',
        text: ''
      }
    },
    directives: {
      'form-size': {
        // TODO
        bind: (el) => {
          window.addEventListener('resize', () => {
            if ($(el).hasClass('active')) {
              $(el).addClass('small');
              $(el).find('.controls a:first img').attr('src', 'dist/img/form_plus.png');
            }
          });
        },
        unbind: (el) => {
          window.removeEventListener('resize', () => {
            $(el).removeClass('small');
            $(el).find('.controls a:first img').attr('src', 'dist/img/form_minus.png');
          });
        },
      }
    },
    methods: {
      show() {
        $(this.$el).addClass('active');
        this.__fixInput();
      },
      close(e) {
        e.preventDefault();
        $(this.$el)
          .removeClass('active')
          .removeClass('small')
          .find('.controls a:first img').attr('src', 'dist/img/form_minus.png');
        this.title = '';
        this.text = '';
      },
      save(e) {
        e.preventDefault();

        if (this.title == '' || this.text == '') {
          return false;
        }

        console.log(this.title);
        console.log(this.text);
      },
      change(e) {
        e.preventDefault();
        if ($(this.$el).hasClass('small')) {
          $(this.$el).removeClass('small');
          $(this.$el).find('.controls a:first img').attr('src', 'dist/img/form_minus.png');
        } else {
          $(this.$el).addClass('small');
          $(this.$el).find('.controls a:first img').attr('src', 'dist/img/form_plus.png');
        }
        this.__fixInput();
      },
      __fixInput() {
        // TODO
        let width = $(this.$el).width() - 50;
        let height = $(this.$el).find('textarea').offset().top - $(this.$el).find('.footer').offset().top;
        $(this.$el).find('input').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'height': (Math.abs(height) - 52) +'px'});
      }
    }
  }
</script>