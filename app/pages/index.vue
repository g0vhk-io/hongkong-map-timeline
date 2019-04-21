<template>
  <v-layout>
    <no-ssr>
      <OLMap/>
    </no-ssr>
  </v-layout>
</template>

<script>
let OLMap
if (process.client) {
  OLMap = require('~/components/ol-map.vue').default
}

export default {
  layout: 'map',
  components: {
    OLMap
  }
}
</script>
