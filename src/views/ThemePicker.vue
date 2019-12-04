<template>
	<div>
		<select v-model='mapThemeInternal'>
			<option v-for='t of sortedThemes'
					:selected='t == mapThemeInternal ? "selected" : ""'
					:key='t'
					v-bind:value='t'>{{t}}</option>
		</select>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import * as mapstyle from "@imqs/map/style";

@Component({ components: {} })
export default class RoadConditionPanel extends Vue {
	@Prop() mapTheme?: string;

	availableThemes: string[] = [];
	mapThemeInternal: string = '';

	@Watch('mapTheme') onThemeChangeExternal(newVal: string) {
		this.mapThemeInternal = newVal;
	}

	@Watch('mapThemeInternal') onThemeChangeInternal(newVal: string) {
		this.$emit('changeMapTheme', newVal);
	}

	get sortedThemes(): string[] {
		return this.availableThemes.sort((a, b) => { return a.localeCompare(b); });
	}

	mounted() {
		this.mapThemeInternal = this.mapTheme == undefined ? '' : this.mapTheme;

		mapstyle.ThemeSet.fetchAvailableThemes().then((themes) => {
			this.availableThemes = themes;
		}).catch((err) => {
			alert(err);
		});
	}
}
</script>

<style lang="less" scoped>
</style>
