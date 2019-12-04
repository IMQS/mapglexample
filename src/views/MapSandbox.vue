<template>
	<div style='display: flex; flex: 1 1 1px'>
		<div style='flex: 0.9 1 auto'>
			<MapGL ref='map'
				   :selection='mapSelection'
				   :themes='mapThemes'
				   :themeParams='themeParams'
				   @load='onMapLoad'
				   @zoomend='onZoomEnd'
				   @featureClickPrefetch='onFeatureClickPrefetch'
				   @featureClick='onFeatureClick'></MapGL>
		</div>
		<div style='flex: 0 0 auto; width:10px' />
		<ThemePicker style='flex: 0.1 1 auto'
					 :mapTheme='mapTheme'
					 @changeMapTheme='onChangeMapTheme' />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import * as map from "@imqs/map";
import * as geojson from 'geojson';
import * as mapboxgl from 'mapbox-gl';
import * as style from "@imqs/map/style";
import { MapGL } from "@imqs/mapgl";
import ThemePicker from "./ThemePicker.vue";

@Component({ components: { MapGL, ThemePicker } })
export default class MapView extends Vue {
	map?: mapboxgl.Map;
	mapSelection: mapboxgl.MapboxGeoJSONFeature[] = [];
	mapTheme: string = 'IMQS.Water Demand.Stand Suburb Category!.Order=1!.Scenario=Stands (General)';
	themeParams: map.ThemeParamBundle = new map.ThemeParamBundle();

	get mapThemes(): string[] {
		return [this.mapTheme];
	}

	onChangeMapTheme(t: string) {
		this.themeParams.main.setScenario('Stands (General)');
		this.mapTheme = t;
	}

	onMapLoad(map: mapboxgl.Map) {
		// ekurhuleni:
		map.easeTo({
			center: [28.13281, -26.29509],
			zoom: 16.0,
		});

		this.map = map;
	}

	onZoomEnd() {
		let c = this.map!.getCenter();
		console.log(`zoom: ${this.map!.getZoom()}, lng: ${c.lng}, lat: ${c.lat}`);
	}

	onFeatureClickPrefetch(f: mapboxgl.MapboxGeoJSONFeature) {
		this.mapSelection = [f];
	}

	onFeatureClick(f: mapboxgl.MapboxGeoJSONFeature) {
		// this.mapSelection = [Object.freeze(f)];
	}

	mapCtrl(): MapGL {
		return this.$refs.map as MapGL;
	}
}
</script>

<style lang="less">
@import "../../css/common.less";
</style>
