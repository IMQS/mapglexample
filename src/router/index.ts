import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import MapView from '../views/MapView.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/roadai',
		name: 'home',
		component: Home
	},
	{
		path: '/roadai/map',
		name: 'map',
		component: MapView
	},
	{
		path: '/roadai/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		// component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
		// BUT.. we haven't enabled that in our config
		component: About
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
