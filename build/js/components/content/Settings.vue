<template>
  <div class="content" v-bind:class="{ 'lg': sidebarWidth == 'sm' }">
    <div class="content-header">
      <h4 class="title">Settings</h4>
    </div>
    <div class="content-body">
      <div class="storage-info">
        <span class="storage-info-title">Local Storage</span>
        <span class="storage-info-text">{{ storageInfo.used }} MB of {{ storageInfo.total }} MB used</span>
        <div class="storage-info-progress">
          <div class="storage-info-progress-bar" :style="'width:'+storageInfo.progress+'%'"></div>
        </div>
      </div>
      <div class="sidebar-settings">
        <i class="fa" v-bind:class="{ 'fa-sidebar-sm': sidebarWidth == 'sm', 'fa-sidebar-lg': sidebarWidth == 'lg' }" v-on:click="toggleSidebarWidth($event)"></i>
        <span>Toggle sidebar</span>
      </div>
      <div class="storage-management">
        <ul>
          <li>
            <a href="#" id="export-btn" v-on:click="exportNotes($event)">
              <i class="fa fa-export"></i>
              <span>Export</span>
            </a>
            <a :href="exportData.href" :download="exportData.download" id="export-content" ref="exportBtn"></a>
          </li>
          <li>
            <div class="import-block">
              <label for="import-file" id="import-btn">
                <i class="fa fa-import"></i>
                <span>Import</span>
              </label>
              <input type="file" name="photo" id="import-file" accept="application/json" v-import-file />
              <a href="#" id="import-start-btn" v-on:click="importNotes($event)">Go</a>
              <span>{{ importData.name }}</span>
            </div>
          </li>
        </ul>
        <p v-if="message.on" :class="'sm-message ' + message.type">{{message.text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { lsGet, lsSet } from './../../helpers.js';
  export default {
    name: 'settings',
    data() {
      return {
        sidebarWidth: 'lg',
        storageInfo: {
          total: '',
          used: '',
          progress: 0
        },
        importData: {
          name: 'No file',
          data: {},
        },
        exportData: {
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
      this.$parent.$refs.sidebar.highlightMenu();
      this.initStorageInfo();
      this.initExport();
      this.sidebarWidth = lsGet('sidebar_width');
    },
    directives: {
      'import-file': {
        update: (el, binding, vnode) => {
          el.addEventListener('change', function() {
            let reader = new FileReader();
            let file = this.files[0];
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
      toggleSidebarWidth() {
        this.sidebarWidth = (this.sidebarWidth == 'sm') ? 'lg' : 'sm';
        this.$parent.$refs.sidebar.width = this.sidebarWidth;
        lsSet('sidebar_width', this.sidebarWidth);
      },
      /**
       * Prepare LS usage info
       */
      initStorageInfo() {
        // approximate Chrome LS size is 10 MB
        this.storageInfo.total = 10;
        this.storageInfo.used = this.__calcUsedSpace();
        this.storageInfo.progress = this.__calcProgress();
      },
      /**
       * Export notes from LS into json file
       */
      initExport() {
        let lsNotes = JSON.stringify(lsGet('notes'));
        // save the file contents as a DataURI and write it as the href for the link
        this.exportData.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(lsNotes);
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
        let data = this.importData.data;
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
          this.__enableMessage('danger', 'Import has been failed.');
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
        this.importData.name = name;
        this.importData.data = data;
      },
      /**
       * @internal
       * Clear import data
       */
      __clearImportData() {
        this.importData.name = 'No file';
        this.importData.data = {};
      },
      /**
       * @internal
       * Validate import data
       */
      __validateImport() {
          let isValid = true;
          const noteKeys = ['id', 'type', 'title', 'content', 'created_at', 'updated_at', 'checked'];
          const noteTypes = ['notes', 'trash'];
          const data = this.importData.data;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (Object.keys(data[i]).length == 7
                  && data[i][noteKeys[0]] != undefined && data[i][noteKeys[0]] != '' && typeof(data[i][noteKeys[0]]) === 'number'
                  && data[i][noteKeys[1]] != undefined && data[i][noteKeys[1]] != '' && typeof(data[i][noteKeys[1]]) === 'string' && noteTypes.indexOf(data[i][noteKeys[1]]) != -1
                  && data[i][noteKeys[2]] != undefined && data[i][noteKeys[2]] != '' && typeof(data[i][noteKeys[2]]) === 'string'
                  && data[i][noteKeys[3]] != undefined && data[i][noteKeys[3]] != '' && typeof(data[i][noteKeys[3]]) === 'string'
                  && data[i][noteKeys[4]] != undefined && data[i][noteKeys[4]] != '' && typeof(data[i][noteKeys[4]]) === 'string'
                  && data[i][noteKeys[5]] != undefined && data[i][noteKeys[5]] != '' && typeof(data[i][noteKeys[5]]) === 'string'
                  && data[i][noteKeys[6]] != undefined && typeof(data[i][noteKeys[6]]) === 'boolean') {
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