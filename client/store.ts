import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
	state: {
		filter: null, // Username to filter shown freets by (null = show all)
		freets: [], // All freets created in the app
		events: [], // All events
		username: null, // Username of the logged in user
		following: [], //All usernames of those a user follows
		userClassification: "None", // Classification of the current user
		timelineType: "FEATURED",
		alerts: {}, // global success/error messages encountered during submissions to non-visible forms
	},
	mutations: {
		alert(state, payload) {
			/**
			 * Add a new message to the global alerts.
			 */
			Vue.set(state.alerts, payload.message, payload.status);
			setTimeout(() => {
				Vue.delete(state.alerts, payload.message);
			}, 3000);
		},
		setUser(state, user) {
			/**
			 * Update the stored username to the specified one.
			 * @param username - new username to set
			 */
			state.username = user?.username;
			state.following = user?.following;
		},
		updateFilter(state, filter) {
			/**
			 * Update the stored freets filter to the specified one.
			 * @param filter - Username of the user to fitler freets by
			 */
			state.filter = filter;
		},
		updateTimelineFilter(state, filter) {
			/**
			 * Update the stored freets filter to the specified one.
			 * @param filter - Username of the user to fitler freets by
			 */
			state.timelineType = filter;
		},
		updateFreets(state, freets) {
			/**
			 * Update the stored freets to the provided freets.
			 * @param freets - Freets to store
			 */
			state.freets = freets;
		},
		updateEvents(state, events) {
			/**
			 * Update the stored events to the provided events.
			 * @param events - Events to store
			 */
			state.events = events;
		},
		async refreshFreets(state) {
			/**
			 * Request the server for the currently available freets.
			 */
			const url = this.filter ? `/api/freets?author=${this.filter}` : "/api/freets";
			const res = await fetch(url).then(async (r) => r.json());
			state.freets = res;
		},
		async refreshEvents(state) {
			/**
			 * Request the server for the currently available freets.
			 */
			const url = "/api/events";
			const res = await fetch(url).then(async (r) => r.json());
			state.events = res;
		},
		async refreshTimelineFreets(state) {
			/**
			 * Request the server for the current timeline freets.
			 */
			const url = "/api/timeline";
			const res = await fetch(url, {
				body: JSON.stringify({
					type: state.timelineType,
				}),
			}).then(async (r) => r.json());
			state.freets = res;
		},
		async refreshClassification(state) {
			/**
			 * Request the server for the currently available freets.
			 */
			const url = `/api/classification`;
			const res = await fetch(url).then(async (r) => r.json());
			state.userClassification = res.type;
		},
	},
	// Store data across page refreshes, only discard on browser close
	plugins: [createPersistedState()],
});

export default store;
