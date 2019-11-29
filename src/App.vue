<template>
	<div id="app">
		<div class="nav">
			<router-link to="/roadai">Home</router-link> |
			<router-link to="/roadai/map">Map</router-link> |
			<router-link to="/roadai/about">About</router-link>
		</div>
		<router-view />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

// Allow debugging with "Vue Devtool" and "Vue Performance" Chrome plugins.
Vue.config.devtools = true;
Vue.config.performance = true;

@Component({ components: {} })
export default class App extends Vue {
	mounted() {
	}
}
</script>

<style lang="less" scoped>
@import "../css/common.less";

#app {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.nav {
	display: flex;
	justify-content: center;
	margin-bottom: 8px;
	flex: 0 1 auto;
}
</style>
