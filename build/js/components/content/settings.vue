<template>
  <div id="content">
    <div class="content-header">
      <h4 class="title">Settings</h4>
    </div>
    <div class="content-body">
        <div class="storage-info">
          <span class="storage-info-title">Local Storage</span>
          <span class="storage-info-text"><b>Total:</b> {{ storage.total }} MB, <b>Usage:</b> {{ storage.used }} MB</span>
          <div class="storage-info-progress">
            <div class="storage-info-progress-bar" :style="'width:'+storage.progress+'%'"></div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { lsGet, lsSet } from './../../helpers.js';

  export default {
    name: 'settings',
    data() {
      return {
        storage: {
          total: '',
          used: '',
          progress: 0
        }
      }
    },
    mounted: function() {
      this.$parent.highlightMenu();
      this.initStorageInfo();
    },
    methods: {
      /**
       * Prepare LS usage info
       */
      initStorageInfo() {
        // approximate Chrome LS size is 10 MB
        this.storage.total = 10;
        this.storage.used = this.__calcUsedSpace();
        this.storage.progress = this.__calcProgress();
      },
      /**
       * @internal
       * Calculate LS usaged space
       */
      __calcUsedSpace() {
        let total = JSON.stringify(localStorage).length;
        total = (total * 2) / 1024 / 1024;
        return total.toFixed(2);
      },
      /**
       * @internal
       * Calculate LS usaged space in perc
       */
      __calcProgress() {
        let total = (10 * this.__calcUsedSpace()) / 100;
        total = total * 100;
        return total;
      }
    }
  }
</script>