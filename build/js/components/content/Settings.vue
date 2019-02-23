<template>
  <div id="content">
    <div class="content-header">
      <h4 class="title">Settings</h4>
    </div>
    <div class="content-body">
      <div class="storage-info">
        <span class="storage-info-title">Local Storage</span>
        <span class="storage-info-text"><b>Total:</b> {{ storage_info.total }} MB, <b>Usage:</b> {{ storage_info.used }} MB</span>
        <div class="storage-info-progress">
          <div class="storage-info-progress-bar" :style="'width:'+storage_info.progress+'%'"></div>
        </div>
      </div>
      <div class="storage-management">
        <ul>
          <li>
            <a href="#" id="export-btn" v-on:click="exportNotes($event)">
              <img src="dist/img/icons/settings_storage_export.png" alt="export" />
              <span>Export</span>
            </a>
            <a :href="export_data.href" :download="export_data.download" id="export-content" ref="exportBtn"></a>
          </li>
          <li>
            <div class="import-block">
              <label for="import-file" id="import-btn">
                <img src="dist/img/icons/settings_storage_import.png" alt="import" />
                <span>Import</span>
              </label>
              <input type="file" name="photo" id="import-file" accept="application/json" v-import-file />
              <a href="#" id="import-start-btn" v-on:click="importNotes($event)">Go</a>
              <span>{{ import_data.name }}</span>
            </div>
          </li>
        </ul>
        <p v-if="message.on" :class="'sm-message ' + message.type">{{message.text}}</p>
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
        storage_info: {
          total: '',
          used: '',
          progress: 0
        },
        import_data: {
          name: 'No file',
          data: {},
        },
        export_data: {
          href: '',
          download: 'ms_notes.json'
        },
        message: {
          on: false,
          type: '', // success|danger
          text: ''
        },
      }
    },
    mounted: function() {
      this.$parent.$refs.sidebarMenu.highlight();
      this.initStorageInfo();
      this.initExport();
    },
    directives: {
      'import-file': {
        update: (el, binding, vnode) => {
          el.addEventListener('change', function() {
            let reader = new FileReader();
            let file = $(this)[0].files[0];
            vnode.context.__clearImportData();
            vnode.context.__disableMessage();
            if (file.type == 'application/json') {
              reader.onload = function() {
                vnode.context.__setImportData(file.name, JSON.parse(reader.result));
                vnode.context.__enableMessage('success', 'File is ready for upload. Press "Go" to continue.');
              };
              reader.readAsText(file);
            } else {
              vnode.context.__enableMessage('danger', 'Unable to upload a file.');
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
        this.storage_info.total = 10;
        this.storage_info.used = this.__calcUsedSpace();
        this.storage_info.progress = this.__calcProgress();
      },
      /**
       * Export notes from LS into json file
       */
      initExport() {
        let lsNotes = JSON.stringify(lsGet('notes'));
        // save the file contents as a DataURI and write it as the href for the link
        this.export_data.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(lsNotes);
      },
      /**
       * Export notes from LS into json file
       */
      exportNotes(e) {
        e.preventDefault();
        const self = this;
        self.__disableMessage();
        self.__enableMessage('warning', 'Processing...');
        setTimeout(function() {
          self.$refs.exportBtn.click();
          self.__enableMessage('success', 'Export successfully finished.');
        }, 2000);
      },
      /**
       * Import notes into LS from json file
       */
      importNotes(e) {
        e.preventDefault();
        let lsNotes = [];
        let data = this.import_data.data;
        if (data.length == undefined || data.length == 0) {
          return false;
        }
        this.__enableMessage('warning', 'Processing...');
        if (this.__validateImport()) {
          for (let i = 0; i < data.length; i++) {
            lsNotes.push(data[i]);
          }
          lsSet('notes', lsNotes);
          this.__enableMessage('success', 'Import successfully finished.');
        } else {
          this._enableMessage('danger', 'Import has been failed.');
        }
        this.__clearImportData();
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
      },
      /**
       * @internal
       * Enable import/export Message message
       */
      __enableMessage(type, text) {
        this.message.type = type;
        this.message.text = text;
        this.message.on = true;
      },
      /**
       * @internal
       * Disable import/export Message message
       */
      __disableMessage() {
        this.message.type = '';
        this.message.text = '';
        this.message.on = false;
      },
      /**
       * @internal
       * Set import data
       */
      __setImportData(name, data) {
        this.import_data.name = name;
        this.import_data.data = data;
      },
      /**
       * @internal
       * Clear import data
       */
      __clearImportData() {
        this.import_data.name = 'No file';
        this.import_data.data = {};
      },
      /**
       * @internal
       * Validate import data
       */
      __validateImport() {
          let isValid = true;
          const noteKeys = ['id', 'type', 'title', 'content', 'created_at', 'updated_at'];
          const noteTypes = ['notes', 'trash'];
          const data = this.import_data.data;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (Object.keys(data[i]).length == 6
                  && data[i][noteKeys[0]] != undefined && data[i][noteKeys[0]] != '' && typeof(data[i][noteKeys[0]]) === 'number'
                  && data[i][noteKeys[1]] != undefined && data[i][noteKeys[1]] != '' && typeof(data[i][noteKeys[1]]) === 'string' && noteTypes.indexOf(data[i][noteKeys[1]]) != -1
                  && data[i][noteKeys[2]] != undefined && data[i][noteKeys[2]] != '' && typeof(data[i][noteKeys[2]]) === 'string'
                  && data[i][noteKeys[3]] != undefined && data[i][noteKeys[3]] != '' && typeof(data[i][noteKeys[3]]) === 'string'
                  && data[i][noteKeys[4]] != undefined && data[i][noteKeys[4]] != '' && typeof(data[i][noteKeys[4]]) === 'string'
                  && data[i][noteKeys[5]] != undefined && data[i][noteKeys[5]] != '' && typeof(data[i][noteKeys[5]]) === 'string') {
                    continue;
              } else {
                isValid = false;
              }
            }
          }
          return isValid;
      }
    }
  }
</script>