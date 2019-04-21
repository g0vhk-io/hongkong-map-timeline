<template>
  <v-app dark>
    <v-navigation-drawer
      :mini-variant="selectedPlace === null"
      mini-variant-width="0"
      clipped
      permanent
      app
    >
      <PlaceLinkagePanel />
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class';
import IPlace from '../lib/models/place';
import PlaceLinkagePanel from '~/components/place-linkage/place-linkage-panel.vue';

@Component({
  components: {
    PlaceLinkagePanel
  }
})
export default class MapLayout extends Vue {
  @State('selectedPlace', { namespace: 'modules/map' }) selectedPlace:IPlace;


  data() {
    return {
      clipped: true,
      fixed: true,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
};


</script>
