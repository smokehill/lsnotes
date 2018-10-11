<template>
  <div id="note-form">
    <div class="header">
      <span class="text">Note</span>
      <ul class="controls">
        <li><a href="#" v-on:click="resize"><img src="dist/img/m_minus.png" alt="resize"></a></li>
        <li><a href="#" v-on:click="close"><img src="dist/img/m_close.png" alt="close"></a></li>
      </ul>
    </div>
    <div class="body">
      <form action="#">
        <div class="form-group">
          <input type="text" name="title" class="form-control" autocomplete="off">
        </div>
        <div class="form-group">
          <textarea name="text" class="form-control"></textarea>
        </div>
      </form>
    </div>
    <div class="footer">
      <a href="#" class="btn btn-primary btn-md">Save</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'note-form',
    data() {
      return {}
    },
    mounted() {},
    methods: {
      close(e) {
        e.preventDefault();
        $(this.$el).removeClass('active');
      },
      resize(e) {
        e.preventDefault();
        var resizeBtn = $(this.$el).find('.controls a:first');
        if ($(this.$el).hasClass('small')) {
          $(this.$el).removeClass('small');
          resizeBtn.find('img').attr('src', 'dist/img/m_minus.png');
        } else {
          $(this.$el).addClass('small');
          resizeBtn.find('img').attr('src', 'dist/img/m_plus.png');
        }
      }
    }
  }
</script>