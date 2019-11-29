<template>
	<div style='display: flex; flex: 1 1 1px'>
		<div style='flex: 0.9 1 auto'>
			<MapGL ref='map'
				   :selection='mapSelection'
				   :themes='mapThemes'
				   :themeParams='themeParams'
				   @load='onMapLoad'
				   @zoomend='onZoomEnd'
				   @featureClick='onFeatureClick'></MapGL>
		</div>
		<div style='flex: 0 0 auto; width:10px' />
		<RoadConditionPanel style='flex: 0.1 1 auto'
							:photo1Url='photo1Url'
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
import RoadConditionPanel from "./RoadConditionPanel.vue";

@Component({ components: { MapGL, RoadConditionPanel } })
export default class MapView extends Vue {
	map?: mapboxgl.Map;
	mapSelection: mapboxgl.MapboxGeoJSONFeature[] = [];
	mapTheme: string = 'IMQS.Roads.Photos';
	themeParams: map.ThemeParamBundle = new map.ThemeParamBundle();
	photo1Url: string = '';

	get mapThemes(): string[] {
		return [this.mapTheme];
	}

	onChangeMapTheme(t: string) {
		// console.log(`MapView: onChangeMapTheme`);
		// this.mapcx.setScenario('04');
		this.themeParams.main.setScenario('04'); // just for illustration/testing of ThemeParams system
		this.mapTheme = t;
		// this.mapcx.setScenario('Stands (General)');
		// this.mapcx.setTheme(t).catch(err => alert(err));
	}

	onMapLoad(map: mapboxgl.Map) {
		// richards bay roads:
		map.easeTo({
			center: [31.8828, -28.7747],
			zoom: 17.0,
		});

		this.map = map;
	}

	onZoomEnd() {
		let c = this.map!.getCenter();
		console.log(`zoom: ${this.map!.getZoom()}, lng: ${c.lng}, lat: ${c.lat}`);
	}

	onFeatureClick(f: mapboxgl.MapboxGeoJSONFeature) {
		this.showPhoto(f);
	}

	showPhoto(f: mapboxgl.MapboxGeoJSONFeature) {
		this.mapSelection = [Object.freeze(f)];
		if (f.geometry.type === "Point") {
			this.photo1Url = this.makePhotoUrl(f.properties!['url'], 2);
		} else if (f.geometry.type === "LineString") {
			// this.mapCtrl().loadFeature()
			this.mapCtrl().loadRecord('ImqsServerRoad', 'photo', f.properties!['photo_1_id']).then((rec: geojson.Feature) => {
				this.photo1Url = this.makePhotoUrl(rec.properties!['url'], 2);
			}).catch((err) => {
				alert(err);
			});
		}
	}

	makePhotoUrl(url: string, resolution: number): string {
		if (url.indexOf('http') === 0)
			return url;
		if (url.indexOf("gs://") === 0) {
			url = "http://" + url.substr(5);
			if (resolution !== 0) {
				// DST gs://roadphoto.imqs.co.za/za.nl.um.--/2019/2019-02-26/138GOPRO/G0015465.JPG
				// SRC gs://roadphoto.imqs.co.za/thumbs/za.nl.um.--/2019/2019-02-26/138GOPRO/G0015465_2x.JPG
				let suffix = resolution === 1 ? "_2x.JPG" : "_8x.JPG";
				url = url.replace('roadphoto.imqs.co.za/', 'roadphoto.imqs.co.za/thumbs/');
				url = url.replace('.JPG', suffix);
			}
			return url;
		}
		throw `"Unrecognized URL schema '${url}'`;
	}

	mapCtrl(): MapGL {
		return this.$refs.map as MapGL;
	}

	mounted() {
	}
}
</script>

<style lang="less">
@import "../../css/common.less";
</style>
