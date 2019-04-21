<template>
  <div className="popup-content">
    <li v-for="feature in features.filter((_, i) => i < 5)" :key="feature.get('id')">
      <a @click="setSelectedPlace(feature.get('place'))">{{ feature.get('name') }}</a>
      <!-- <nuxt-link :to="`/place/${feature.get('name')}/${feature.get('id')}`">
        {{ feature.get('name') }}
      </nuxt-link> -->
    </li>
    {{
      features.length > 5 ? `...(${features.length})` : ''
    }}
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Feature } from 'ol';
import { Action } from 'vuex-class';


@Component
export default class OLMapPopup extends Vue {

    @Prop({ type: Array, required: true })
    features!: Feature[];

    @Action('setSelectedPlace', { namespace: 'modules/map' }) setSelectedPlace: Function;

    constructor() {
      super();
      console.log(this.features);
    }
}
</script>