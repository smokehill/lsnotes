<template>
  <div class="form" v-resize>
    <div class="form-wrapper">
      <div class="form-header">
        <span class="text">Type [ {{ type }} ]</span>
        <ul class="controls">
          <li><a href="#" class="form-show-hide" v-on:click="change($event, 'height')" title="Minimize"></a></li>
          <li><a href="#" class="form-full-screen" v-on:click="change($event, 'width')" title="Full-screen"></a></li>
          <li><a href="#" class="form-close" v-on:click="close($event)" title="Close"></a></li>
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
        type: 'new',
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
        typingInterval: 3000
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
                
                $('#process').text(`Last edit was: ${updatedAt}`);
                lsSet('notes', notes);
              }, vnode.context.typingInterval);
            }
          }).on('keydown', function() {
            clearTimeout(vnode.context.typingTimer);
          });
        }
      },
      'resize': {
        bind: (el) => {
          window.addEventListener('resize', () => {
            if ($(el).hasClass('active')) {
              $(el).addClass('small');
              $(el).find('.controls li:nth-child(1) a').attr('title', 'Maximize');
              $(el).find('.controls li:nth-child(1) a').addClass('on');
              $(el).css({'width': '300px'});
            }
          });
        },
        unbind: (el) => {
          window.removeEventListener('resize', () => {
            $(el).removeClass('small');
            $(el).find('.controls li:nth-child(1) a').attr('title', 'Minimize');
            $(el).find('.controls li:nth-child(1) a').removeClass('on');
            $(el).css({'width': '500px'});
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
              this.note.updated_at = notes[i].updated_at;

              this.type = notes[i].type;
              $('.form-header .text').text(`Type [ ${notes[i].type} ]`);
              $('#process').text(`Last edit was: ${this.note.updated_at}`);
              break;
            }
          }
        } else {
          $('.form-header .text').text('Type [ new ]');
          this.__empty();
        }
  
        $(this.$el).addClass('active');
        $(this.$el).removeClass('small');
        $(this.$el).find('.controls li:nth-child(1) a').removeClass('on');
        this.__fixInput();
      },
      close(e) {
        e.preventDefault();

        $(this.$el)
          .removeClass('active')
          .removeClass('small')
          .find('.controls li:nth-child(1) a').removeClass('on');
        
        this.type = 'new';
        this.__empty();
      },
      save(e) {
        e.preventDefault();

        if (this.note.title == '' || this.note.content == '') {
          return false;
        }

        let notes = lsGet('notes');
        const date = this.__setDate();

        $('#process').text('Saving...');

        if (this.note.id == '') {
          notes.push({
            id: this.__setId(),
            type: 'notes',
            title: this.note.title,
            content: this.note.content,
            created_at: date,
            updated_at: date,
          });
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

        setTimeout(function() {
          lsSet('notes', notes);
          for (let i = 0; i < components.length; i++) {
            if (components[i].$options.name == 'notes'
              || components[i].$options.name == 'trash') {
                components[i].init();
            }
          }
          $('#process').text('Last edit was: '+date);
        }, 3000);


      },
      change(e, type) {
        e.preventDefault();

        if (type == 'height') {
          if ($(this.$el).hasClass('small')) {
            $(this.$el).removeClass('small');
            $(this.$el).find('.controls li:nth-child(1) a').attr('title', 'Minimize');
            $(this.$el).find('.controls li:nth-child(1) a').removeClass('on');
            $(this.$el).css({'width': '500px'});
          } else {
            $(this.$el).addClass('small');
            $(this.$el).find('.controls li:nth-child(1) a').attr('title', 'Maximize');
            $(this.$el).find('.controls li:nth-child(1) a').addClass('on');
            $(this.$el).css({'width': '300px'});
          }
        }
        else if (type == 'width') {

          if ($(this.$el).hasClass('small')) {
            $(this.$el).removeClass('small');
          }

          if ($(this.$el).hasClass('full_screen')) {
            $(this.$el).removeClass('full_screen');
            $(this.$el).find('.controls li:nth-child(2) a').attr('title', 'Full-screen');
            $(this.$el).find('.controls li:nth-child(2) a').removeClass('on');
            $(this.$el).css({'width': '500px'});
          } else {
            const width = $('#content').width() + 10;

            $(this.$el).addClass('full_screen');
            $(this.$el).find('.controls li:nth-child(2) a').attr('title', 'Exit full-screen');
            $(this.$el).find('.controls li:nth-child(2) a').addClass('on');
            $(this.$el).css({'width': width+'px'});
          }
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
        this.note.type = 'notes';
        this.note.title = '';
        this.note.content = '';
        this.note.is_deleted = false;
        this.note.created_at = '';
        this.note.updated_at = '';

        $('#process').text('');
      },
      __setId() {
        return Math.floor(Date.now() / 1000);
      },
      __setDate() {
        // converts UTC to local
        let date = new Date().toLocaleString() + ' UTC';
        date = new Date(date);
        date = date.toISOString();
        date = date.replace('T', ' ');

        return date.replace(/\.([a-zA-Z0-9]+)/, '');
      }
    }
  }
</script>