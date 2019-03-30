<template>
  <div class="content" v-bind:class="{ 'lg': isSidebarMini }">
    <div class="content-header">
      <h4 class="title">Settings</h4>
    </div>
    <div class="content-body">
      <div class="settings-items">
        <div class="settings-item-row">
          <div class="settings-item-lable">Local storage:</div>
          <div class="settings-item-content"><span class="text">{{ storageInfo.used }} MB of {{ storageInfo.total }} MB used</span></div>
        </div>
        <div class="settings-item-row">
          <div class="settings-item-lable">Sidebar mini:</div>
          <div class="settings-item-content">
            <label class="radio-btn" v-on:click="toggleIsSidebarMini($event)">
              <span class="text">on</span>
              <input type="radio" :checked="isSidebarMini" name="radio">
              <span class="checkmark"></span>
            </label>
            <label class="radio-btn" v-on:click="toggleIsSidebarMini($event)">
              <span class="text">off</span>
              <input type="radio" :checked="!isSidebarMini" name="radio">
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
        <p class="export-import-info">Export, Import options provides notes management via JSON format.<br>NOTE: after Import all previous notes will be removed.</p>
        <div class="settings-item-row">
          <div class="settings-item-lable">Export:</div>
          <div class="settings-item-content">
            <a href="#" class="export-btn" v-on:click="exportNotes($event)">Go</a>
            <a :href="exportData.href" :download="exportData.download" ref="exportBtn"></a>
          </div>
        </div>
        <div class="settings-item-row">
          <div class="settings-item-lable">Import:</div>
          <div class="settings-item-content">
            <div class="import-block">
              <label for="import-file" class="import-btn">Chose file</label>
              <input type="file" name="photo" id="import-file" accept="application/json" v-import-file />
              <a href="#" class="import-start-btn" v-on:click="importNotes($event)">Go</a>
              <span class="text">{{ importData.name }}</span>
            </div>
          </div>
        </div>
        <p v-if="message.on" class="export-import-process">{{ message.text }}</p>
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
        isSidebarMini: false,
        storageInfo: {
          total: '',
          used: ''
        },
        importData: {
          name: 'no file',
          data: {},
        },
        exportData: {
          href: '',
          download: 'ms_notes.json'
        },
        message: {
          on: false,
          text: ''
        },
      }
    },
    mounted: function() {
      this.$parent.$refs.sidebar.highlightMenu();
      this.initStorageInfo();
      this.initExport();
      this.isSidebarMini = lsGet('sidebar_mini');
    },
    directives: {
      'import-file': {
        update: (el, binding, vnode) => {
          el.addEventListener('change', function() {
            let reader = new FileReader();
            let file = this.files[0];
            vnode.context.__clearImportData();
            vnode.context.__enableMessage('Processing...');
            setTimeout(function() {
              if (file.type == 'application/json') {
                reader.onload = function() {
                  try {
                    vnode.context.__setImportData(file.name, JSON.parse(reader.result));
                    vnode.context.__enableMessage('File is ready for import, press "Go" to continue');
                  } catch {
                    vnode.context.__enableMessage('Unable to import a file');
                  }
                };
                reader.readAsText(file);
              } else {
                vnode.context.__enableMessage('Unable to import a file');
              }
            }, vnode.context.$timeout);
          });
        }
      }
    },
    methods: {
      toggleIsSidebarMini(e) {
        e.preventDefault();
        this.isSidebarMini = (this.isSidebarMini) ? false : true;
        this.$parent.$refs.sidebar.isMini = this.isSidebarMini;
        lsSet('sidebar_mini', this.isSidebarMini);
      },
      /**
       * Prepare LS usage info
       */
      initStorageInfo() {
        // approximate Chrome LS size is 10 MB
        this.storageInfo.total = 10;
        this.storageInfo.used = this.__calcUsedSpace();
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
       * Import notes into LS from json file
       */
      importNotes(e) {
        e.preventDefault();
        const self = this;
        self.__enableMessage('Processing...');
        setTimeout(function() {
          if (self.__validateImport()) {
            let lsNotes = [];
            let data = self.importData.data;
            for (let i = 0; i < data.length; i++) {
              lsNotes.push(data[i]);
            }
            lsSet('notes', lsNotes);
            self.__enableMessage('Import finished');
          } else {
            self.__enableMessage('Import failed');
          }
          self.__clearImportData();
        }, self.$timeout);
      },
      /**
       * Export notes from LS into json file
       */
      exportNotes(e) {
        e.preventDefault();
        const self = this;
        self.__enableMessage('Processing...');
        setTimeout(function() {
          self.$refs.exportBtn.click();
          self.__enableMessage('Export finished');  
        }, self.$timeout);
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
       * Enable import/export Message message
       */
      __enableMessage(text) {
        this.message.text = text;
        this.message.on = true;
      },
      /**
       * @internal
       * Disable import/export Message message
       */
      __disableMessage() {
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
        this.importData.name = 'no file';
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
                  && data[i][noteKeys[4]] != undefined && data[i][noteKeys[4]] != '' && typeof(data[i][noteKeys[4]]) === 'number'
                  && data[i][noteKeys[5]] != undefined && data[i][noteKeys[5]] != '' && typeof(data[i][noteKeys[5]]) === 'number'
                  && data[i][noteKeys[6]] != undefined && typeof(data[i][noteKeys[6]]) === 'boolean') {
                    continue;
              } else {
                isValid = false;
              }
            }
          } else {
            isValid = false;
          }
          return isValid;
      }
    }
  }
</script>