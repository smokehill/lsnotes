<template>
  <div class="content" v-bind:class="{ 'lg': isSidebarMini }">
    <div class="content-header">
      <h4 class="title">{{ "list.title_settings"|i18n }}</h4>
    </div>
    <div class="content-body">
      <div class="settings-items">
        <div class="settings-item-row">
          <div class="settings-item-lable">
            <div>{{ "settings.label_local_storage"|i18n }}:</div>
          </div>
          <div class="settings-item-content">
            <div><span class="text">{{ storageInfo.used }} Mb {{ "settings.local_storage_size_of"|i18n }} {{ storageInfo.total }} Mb {{ "settings.local_storage_size_used"|i18n }}</span></div>
          </div>
        </div>
        <div class="settings-item-row">
          <div class="settings-item-lable">
            <div>{{ "settings.label_sidebar_mini"|i18n }}:</div>
          </div>
          <div class="settings-item-content">
            <div>
              <label class="radio-btn" for="radio-on" v-on:click="toggleIsSidebarMini($event, 'on')">
                <input type="radio" id="radio-on" :checked="isSidebarMini" name="radio"><span>{{ "settings.sidebar_mini_radio_on"|i18n }}</span>
              </label>
            </div>
            <div>
              <label class="radio-btn" for="radio-off" v-on:click="toggleIsSidebarMini($event, 'off')">
                <input type="radio" id="radio-off" :checked="!isSidebarMini" name="radio"><span>{{ "settings.sidebar_mini_radio_off"|i18n }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="settings-item-row">
          <div class="settings-item-lable">
            <div>{{ "settings.label_language"|i18n }}:</div>
          </div>
          <div class="settings-item-content">
            <div>
              <select v-model="sysLang">
                <option v-for="lang in langs" v-bind:key="lang" :checked="sysLang == lang">{{ lang }}</option>
              </select>
            </div>
          </div>
        </div>
        <p class="export-import-info">
          {{ "settings.export_import_info_1"|i18n }}
          <br/>{{ "settings.export_import_info_2"|i18n }}: LSNotes.json
        </p>
        <div class="settings-item-row">
          <div class="settings-item-lable">
            <div>{{ "settings.label_export"|i18n }}:</div>
          </div>
          <div class="settings-item-content">
            <div>
              <button v-on:click="exportNotes($event)">{{ "settings.import_btn_go"|i18n }}</button>
              <a :href="exportData.href" :download="exportData.download" ref="exportBtn"></a>
            </div>
          </div>
        </div>
        <div class="settings-item-row">
          <div class="settings-item-lable">
            <div>{{ "settings.label_import"|i18n }}:</div>
            <div>{{ "settings.import_info"|i18n }}</div>
          </div>
          <div class="settings-item-content">
            <div>
              <button v-on:click="chooseFile($event)">{{ "settings.export_btn_choose_file"|i18n }}</button>
              <input type="file" name="photo" accept="application/json" v-import-file  ref="importFile" />
              <span class="text">{{ importData.name }}</span>
            </div>
            <div>
              <button v-on:click="importNotes($event)">{{ "settings.export_btn_go"|i18n }}</button>
            </div>
          </div>
        </div>
        <p v-if="message.on" class="export-import-process">{{ message.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { lsGet, lsSet, i18n } from './../../helpers.js';

  export default {
    data() {
      return {
        isSidebarMini: false,
        storageInfo: { total: '', used: '' },
        sysLang: 'en',
        langs: ['en', 'ru'],
        importData: { name: '', data: {} },
        exportData: { href: '', download: 'LSNotes.json' },
        message: { on: false, text: '' }
      }
    },
    watch: {
      sysLang: function (val) {
        if (lsGet('language') != val) {
          lsSet('language', val);
          this.sysLang = val;
          location.reload();
        }
      }
    },
    mounted: function () {
      this.sysLang = lsGet('language');
      this.isSidebarMini = lsGet('sidebar_mini');
      this.importData.name = i18n('settings.export_empty_file');
      this.initStorageInfo();
      this.initExport();
    },
    directives: {
      'import-file': {
        update: function (el, binding, vnode) {
          el.addEventListener('change', function () {
            const reader = new FileReader();
            const file = this.files[0];

            vnode.context.clearImportData();
            vnode.context.enableMessage(i18n('settings.status_processing'));

            setTimeout(() => {
              if (file.type == 'application/json') {
                reader.onload = () => {
                  try {
                    vnode.context.setImportData(file.name, JSON.parse(reader.result));
                    vnode.context.enableMessage(i18n('settings.status_import_file_ready'));
                  } catch {
                    vnode.context.enableMessage(i18n('settings.status_import_file_unable'));
                  }
                };
                reader.readAsText(file);
              } else {
                vnode.context.enableMessage(i18n('settings.status_import_file_unable'));
              }
            }, vnode.context.$timeout);
          });
        }
      }
    },
    methods: {
      /**
       * Toggle sidebar.
       */
      toggleIsSidebarMini(e, value) {
        e.preventDefault();
        const self = this;
        if (value == 'on' && self.isSidebarMini == true
          || value == 'off' && self.isSidebarMini == false) {
          return false;
        } else {
          self.isSidebarMini = (self.isSidebarMini) ? false : true;
          lsSet('sidebar_mini', self.isSidebarMini);
          self.$eventBus.$emit('sidebar.mini');
        }
      },
      /**
       * Prepare LS usage info.
       */
      initStorageInfo() {
        this.storageInfo.total = (chrome.storage.local.QUOTA_BYTES / 1024) /1024;
        this.storageInfo.used = this.calcUsedSpace();
      },
      /**
       * Export notes from LS into json file.
       */
      initExport() {
        const lsNotes = JSON.stringify(lsGet('notes'));
        const blobData = new Blob([lsNotes], {type: "octet/stream"});
        this.exportData.href = window.URL.createObjectURL(blobData);
      },
      /**
       * Import notes into LS from json file.
       */
      importNotes(e) {
        e.preventDefault();
        const self = this;
        self.enableMessage(i18n('settings.status_processing'));

        setTimeout(() => {
          if (self.validateImport()) {
            let lsNotes = [];
            let data = self.importData.data;

            for (let i = 0; i < data.length; i++) {
              lsNotes.push(data[i]);
            }

            lsSet('notes', lsNotes);
            self.enableMessage(i18n('settings.status_import_finished'));
          } else {
            self.enableMessage(i18n('settings.status_import_failed'));
          }
          self.clearImportData();
        }, self.$timeout);
      },
      /**
       * Trigger event on file input.
       */
      chooseFile(e) {
        this.$refs.importFile.click();
      },
      /**
       * Export notes from LS into json file.
       */
      exportNotes(e) {
        e.preventDefault();
        const self = this;
        self.enableMessage(i18n('settings.status_processing'));
        setTimeout(() => {
          self.$refs.exportBtn.click();
          self.enableMessage(i18n('settings.status_export_finished'));  
        }, self.$timeout);
      },
      /**
       * Calculate LS usaged space.
       */
      calcUsedSpace() {
        let total = JSON.stringify(localStorage).length;
        total = (total * 2) / 1024 / 1024;
        return total.toFixed(2);
      },
      /**
       * Enable import/export Message message.
       */
      enableMessage(text) {
        this.message.text = text;
        this.message.on = true;
      },
      /**
       * Disable import/export Message message.
       */
      disableMessage() {
        this.message.text = '';
        this.message.on = false;
      },
      /**
       * Set import data
       */
      setImportData(name, data) {
        this.importData.name = name;
        this.importData.data = data;
      },
      /**
       * Clear import data.
       */
      clearImportData() {
        this.importData.name = i18n('settings.export_empty_file');
        this.importData.data = {};
      },
      /**
       * Validate import data.
       */
      validateImport() {
          let isValid = true;
          const noteKeys = ['id', 'type', 'title', 'content', 'created_at', 'updated_at', 'is_checked', 'is_hidden', 'is_active'];
          const noteTypes = ['notes', 'trash'];
          const data = this.importData.data;

          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (Object.keys(data[i]).length == 9
                  && data[i][noteKeys[0]] != undefined && data[i][noteKeys[0]] != '' && typeof(data[i][noteKeys[0]]) === 'number'
                  && data[i][noteKeys[1]] != undefined && data[i][noteKeys[1]] != '' && typeof(data[i][noteKeys[1]]) === 'string' && noteTypes.indexOf(data[i][noteKeys[1]]) != -1
                  && data[i][noteKeys[2]] != undefined && data[i][noteKeys[2]] != '' && typeof(data[i][noteKeys[2]]) === 'string'
                  && data[i][noteKeys[3]] != undefined && data[i][noteKeys[3]] != '' && typeof(data[i][noteKeys[3]]) === 'string'
                  && data[i][noteKeys[4]] != undefined && data[i][noteKeys[4]] != '' && typeof(data[i][noteKeys[4]]) === 'number'
                  && data[i][noteKeys[5]] != undefined && data[i][noteKeys[5]] != '' && typeof(data[i][noteKeys[5]]) === 'number'
                  && data[i][noteKeys[6]] != undefined && typeof(data[i][noteKeys[6]]) === 'boolean'
                  && data[i][noteKeys[7]] != undefined && typeof(data[i][noteKeys[7]]) === 'boolean'
                  && data[i][noteKeys[8]] != undefined && typeof(data[i][noteKeys[8]]) === 'boolean') {
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