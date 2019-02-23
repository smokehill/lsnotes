<template>
  <div class="form-overlay" v-bind:class="{ hidden: classes.isHidden }"></div>
</template>

<script>
  export default {
    name: 'form-modal-overlay',
    data() {
      return {
        classes: {
          isHidden: true
        }
      }
    },
  }
</script>