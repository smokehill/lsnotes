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
      <div class="storage-management">
        <ul>
          <li>
            <a href="#" id="export-btn">
              <img src="dist/img/icons/settings_storage_export.png" alt="export" />
              <span>Export</span>
            </a>
          </li>
          <li>
            <div class="import-block">
              <label for="import-file" id="import-btn">
                <img src="dist/img/icons/settings_storage_import.png" alt="import" />
                <span>Import</span>
              </label>
              <input type="file" name="photo" id="import-file" accept="application/json" v-import-file />
              <a href="#" id="import-start-btn" v-on:click="importNotes($event)">Go</a>
              <span>No file</span>
            </div>
          </li>
        </ul>
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
      this.initExport();
    },
    directives: {
      'import-file': {
        update: (el, binding, vnode) => {
          $(el).on('change', function() {
            let reader = new FileReader();
            let file = $(this)[0].files[0];
            if (file.type == 'application/json') {
              reader.onload = function() {
                let data = JSON.parse(reader.result);
                console.log(data);
                // TODO validate data
                // TODO make import
              };
              reader.readAsText(file);
            } else {
              // TODO disiplay error
              console.log('Error. Incorrect file format.');
            }
          });
        }
      }
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
       * Export notes from LS into json file
       */
      initExport() {
        let lsNotes = JSON.stringify(lsGet('notes'));
        // save the file contents as a DataURI and write it as the href for the link
        $('#export-btn').attr('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(lsNotes));
        $('#export-btn').attr('download', 'ms_notes.json');
      },
      /**
       * Import notes into LS from json file
       */
      importNotes(e) {
        e.preventDefault();
        console.log('import');
        // TODO
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