<template>
  <div className="popup-content">
    <NodeTree v-for="node in selectedPlaceLinkageNodes" :node="node" :key="node.place.id" />
  </div>
</template>

<style>
.popup-content {
  color: black;
}
a {
  color: black;
}

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class';
import { IPlaceLinkageNode } from '~/lib/models/place-linkage';
import NodeTree from './place-linkage-node.vue';

@Component({
  components: {
    NodeTree
  }
})

export default class PlaceLinkagePanel extends Vue {

    @State('selectedPlaceLinkageNodes', { namespace: 'modules/map' }) selectedPlaceLinkageNodes:IPlaceLinkageNode[];

    constructor() {
      super();
    }
}
</script>