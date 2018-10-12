<template>
  <div id="note-form" v-form-size>
    <div class="wrapper">
      <div class="header">
        <span class="text">Note</span>
        <ul class="controls">
          <li><a href="#" v-on:click="change"><img src="dist/img/form_minus.png" alt="change"></a></li>
          <li><a href="#" v-on:click="close"><img src="dist/img/form_close.png" alt="close"></a></li>
        </ul>
      </div>
      <div class="body">
        <input type="text" name="title" autocomplete="off">
        <textarea name="text"></textarea>
      </div>
      <div class="footer-wrapper"></div>
    </div>
    <div class="footer">
      <a href="#" class="btn-save">Save</a>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  export default {
    name: 'note-form',
    data() {
      return {}
    },
    directives: {
      'form-size': {
        // TODO
        bind: function(el) {
          window.addEventListener('resize', function(){
            if ($(el).hasClass('active')) {
              $(el).addClass('small');
              $(el).find('.controls a:first img').attr('src', 'dist/img/form_plus.png');
            }
          });
        },
        unbind: function (el) {
          window.removeEventListener('resize', function(){
            $(el).removeClass('small');
            $(el).find('.controls a:first img').attr('src', 'dist/img/form_minus.png');
          });
        },
      }
    },
    methods: {
      show(){
        $(this.$el).addClass('active');
        this.__fixInputs();
      },
      close(e) {
        e.preventDefault();
        $(this.$el)
          .removeClass('active')
          .removeClass('small')
          .find('.controls a:first img').attr('src', 'dist/img/form_minus.png');
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
        this.__fixInputs();
      },
      __fixInputs(){
        // TODO
        var width = $(this.$el).width() - 50;
        var height = $(this.$el).find('textarea').offset().top - $(this.$el).find('.footer').offset().top;
        $(this.$el).find('input').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'width': width+'px'});
        $(this.$el).find('textarea').css({'height': (Math.abs(height) - 52) +'px'});
      },
    }
  }
</script>