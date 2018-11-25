<template>
  <div class="content-wrapper">
    <h4 class="title">Trash</h4>
    <ul class="list" v-if="list.length > 0">
      <li v-for="item in list">
        <a href="#">
          <img src="dist/img/list_checkbox1.png" alt="">{{ item.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { lsGet } from './../helpers.js';
  
  export default {
    name: 'trash',
    data() {
      return {
        list: []
      }
    },
    mounted: function() {
      this.$parent.highlightMenu();
      this.init();
    },
    methods: {
      init() {
        const lsList = lsGet('list');

        this.list = [];

        if (lsList != null) {

          for (let i = 0; i < lsList.length; i++) {

            if (lsList[i].type == 'trash') {

              this.list.push(lsList[i]);
            }
          }
        }
      }
    }
  }
</script>