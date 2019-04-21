<!-- components/PostPreview.vue -->
<template>
  <div>
    <div ref="popup" class="ol-popup">
      <a ref="popup-closer" href="#" class="ol-popup-closer"></a>
      <OLMapPopup :features="this.selectedFeatures"></OLMapPopup>
    </div>
    <div ref="mapContainer" class="mapContainer"></div>
  </div>
</template>

<style>
.mapContainer {
  height: 100%;
  width: 100%;
  position: fixed;
}
.ol-popup {
  position: absolute;
  background-color: white;
  color: black;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  color: red;
  content: '✖';
}
</style>

<script lang="ts">
// import axios from 'axios'
import { Map, View, Feature } from 'ol'
import { Point } from 'ol/geom'
import * as control from 'ol/control'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Cluster, OSM, Vector as VectorSource } from 'ol/source'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'
import { click } from 'ol/events/condition'
import Select from 'ol/interaction/Select'
import Overlay from 'ol/Overlay'
import { Component, Vue } from 'vue-property-decorator'
import { getPlaces } from '~/lib/api';
import OLMapPopup from './ol-map-popup.vue';
import { Action } from 'vuex-class';

@Component({
  components: {
    OLMapPopup
  }
})

export default class OLMap extends Vue {

  private vectorLayer: VectorLayer
  private styleCache: any
  private overlay: Overlay
  private interaction: Select
  private map: Map

  @Action('clearSelectedPlace', { namespace: 'modules/map' }) clearSelectedPlace: Function;

  selectedFeatures: Feature[] = [];



  mounted() {
    // Prepare the ol map obejct
    this.styleCache = {}
    this.vectorLayer = new VectorLayer({
      source: new Cluster({
        distance: 10,
        source: new VectorSource()
      }),
      style: this.getCachedStyleForFeature.bind(this)
    })

    const container = this.$refs.popup
    const closer: any = this.$refs['popup-closer']

    // Since the overlay "stopEvent" is set to true,
    // if we bind the onClick event at the render method,
    // it won't be fire.
    closer.onclick = this.onPopupCloseClicked.bind(this)

    this.overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    })

    this.map = new Map({
      target: this.$refs.mapContainer,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      overlays: [this.overlay],
      controls: control.defaults({
        attribution: false,
        zoom: false,
        rotate: false
      }),
      view: new View({
        center: [114.0282350963625, 22.446477450926306],
        projection: 'EPSG:4326',
        zoom: 19
      })
    })

    this.map.on('moveend', this.onMoveEnd.bind(this))

    // select interaction working on "click"
    this.interaction = new Select({
      condition: click
    })

    this.map.addInteraction(this.interaction)
    this.interaction.on('select', this.onFeatureSelected.bind(this))
  }

  private clearPopup() {
    this.overlay.setPosition(undefined);

    // clear also the state
    this.clearSelectedPlace();
  }

  private showPopup(coordinates, features) {
    this.selectedFeatures = features
    this.overlay.setPosition(coordinates)
  }

  private onPopupCloseClicked(evt) {
    evt.preventDefault()
    evt.stopPropagation()

    this.clearPopup()
    return false
  }

  /**
   * fired by openlayer map's Interaction:Select
   * @param evt
   */
  private onFeatureSelected(evt) {
    const select: Select = evt.target
    if (select === undefined) {
      return
    }
    const features: Feature[] = select.getFeatures().getArray()
    if (features && features.length > 0) {
      const clusteredFeatures: Feature[] = features[0].get('features')

      // Set the popup location
      const coordinates = features[0].getGeometry().getCoordinates()

      // set the features
      this.showPopup(coordinates, clusteredFeatures)
    } else {
      this.clearPopup()
    }
  }

  /**
   * For caching the styles used for clustered feature
   * @param feature
   */
  private getCachedStyleForFeature(feature) {
    const size = feature.get('features').length
    let style = this.styleCache[size]
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: '#fff'
          }),
          fill: new Fill({
            color: '#3399CC'
          })
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff'
          })
        })
      })
      this.styleCache[size] = style
    }
    return style
  }

  /**
   * On map relocated.
   * @param evt MapEvent
   */
  private async onMoveEnd(evt) {
    // reset the popup
    this.clearPopup()
    const map = evt.map
    const center = map.getView().getCenter()
    const places = await getPlaces(center[1], center[0], 10000)
    const features = places.map(
      place =>
        new Feature({
          geometry: new Point([place.location.lng, place.location.lat]),
          name: place.name.zh_hk,
          id: place.id,
          place,
        })
    )
    const source: VectorSource = this.vectorLayer.getSource().getSource()
    source.clear()
    source.addFeatures(features)
  }
}


</script>
