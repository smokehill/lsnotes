<template>
  <div class="content-wrapper">
    <h4 class="title">Trash</h4>
    <ul class="list" v-if="notes.length > 0">
      <li v-for="note in notes">
        <a href="#">
          <img src="dist/img/list_checkbox1.png" alt="">{{ note.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery';
  
  export default {
    name: 'trash',
    data() {
      return {
        notes: []
      }
    },
    methods: {
      init() {
        
      }
    }
  }
</script>