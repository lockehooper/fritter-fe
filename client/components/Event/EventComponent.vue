<!-- Reusable component representing a single event and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
	<article class="event">
		<header>
			<input v-if="editing" class="name" :value="draftName" @input="draftName = $event.target.value" />
			<h3 v-else class="name">{{ event.name }}</h3>
		</header>
		<h5 class="">Event owner: @{{ event.owner }}</h5>
		<h5 class="">Event time: {{ event.start }} to {{ event.end }}</h5>
		<p v-if="editing">Event Description:</p>
		<textarea v-if="editing" class="description" :value="draftDesc" @input="draftDesc = $event.target.value" />
		<p v-else class="description">
			{{ event.description }}
		</p>
		<p v-if="editing">Event Freeters:</p>
		<input v-if="editing" class="freeters" :value="draftFreeters" @input="draftFreeters = $event.target.value" />
		<p v-else class="freeters">Featured Freeters: {{ event.freeters.reduce((a, b) => a + ", " + b, "") }}</p>
		<p class="info">Posted at {{ event.dateModified }}</p>
		<div v-if="$store.state.username === event.owner" class="actions">
			<button v-if="editing" @click="submitEdit">✅ Save changes</button>
			<button v-if="editing" @click="stopEditing">🚫 Discard changes</button>
			<button v-if="!editing" @click="startEditing">✏️ Edit</button>
			<button @click="deleteEvent">🗑️ Delete</button>
		</div>
		<section class="alerts">
			<article v-for="(status, alert, index) in alerts" :key="index" :class="status">
				<p>{{ alert }}</p>
			</article>
		</section>
		<section v-if="$store.state.freets.length">
			<FreetComponent v-for="freet in event.freets" :key="freet.id" :freet="freet" />
		</section>
		<article v-else>
			<h3>No freets for event.</h3>
		</article>
	</article>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
	name: "EventComponent",
	components: {
		FreetComponent,
	},
	props: {
		// Data from the stored freet
		event: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			editing: false, // Whether or not this freet is in edit mode
			draftName: this.event.name, // Potentially-new content for this freet
			draftDesc: this.event.description,
			draftFreeters: this.event.freeters,
			alerts: {}, // Displays success/error messages encountered during freet modification
		};
	},
	methods: {
		startEditing() {
			/**
			 * Enables edit mode on this freet.
			 */
			this.editing = true; // Keeps track of if a freet is being edited
			this.draftName = this.event.name; // The content of our current "draft" while being edited
			this.draftDesc = this.event.description;
			this.draftFreeters = this.event.freeters;
		},
		stopEditing() {
			/**
			 * Disables edit mode on this freet.
			 */
			this.editing = false;
			this.draftName = this.event.name; // The content of our current "draft" while being edited
			this.draftDesc = this.event.description;
			this.draftFreeters = this.event.freeters;
		},
		deleteEvent() {
			/**
			 * Deletes this freet.
			 */
			const params = {
				method: "DELETE",
				callback: () => {
					this.$store.commit("alert", {
						message: "Successfully deleted event!",
						status: "success",
					});
				},
			};
			this.request(params);
		},
		submitEdit() {
			/**
			 * Updates freet to have the submitted draft content.
			 */
			const params = {
				method: "PUT",
				message: "Successfully edited freet!",
				body: JSON.stringify({
					name: this.draftName,
					description: this.draftDesc,
					freeters: this.draftFreeters.reduce((a, b) => a + ", " + b, ""),
				}),
				callback: () => {
					this.$set(this.alerts, params.message, "success");
					setTimeout(() => this.$delete(this.alerts, params.message), 3000);
				},
			};
			this.request(params);
		},
		async request(params) {
			/**
			 * Submits a request to the freet's endpoint
			 * @param params - Options for the request
			 * @param params.body - Body for the request, if it exists
			 * @param params.callback - Function to run if the the request succeeds
			 */
			const options = {
				method: params.method,
				headers: { "Content-Type": "application/json" },
			};
			if (params.body) {
				options.body = params.body;
			}

			try {
				const r = await fetch(`/api/events/${this.event._id}`, options);
				if (!r.ok) {
					const res = await r.json();
					throw new Error(res.error);
				}
				console.log(r);

				this.editing = false;
				this.$store.commit("refreshEvents");

				params.callback();
			} catch (e) {
				this.$set(this.alerts, e, "error");
				setTimeout(() => this.$delete(this.alerts, e), 3000);
			}
		},
	},
};
</script>

<style scoped>
.freet {
	border: 1px solid #111;
	padding: 20px;
	position: relative;
}
</style>
