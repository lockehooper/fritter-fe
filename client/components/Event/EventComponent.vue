<!-- Reusable component representing a single event and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
	<article class="event">
		<header>
			<input v-if="editing" class="editArea" :value="draftName" @input="draftName = $event.target.value" />
			<h2 class="topItem" v-else>{{ event.name }}</h2>
		</header>
		<h5 class="item">By @{{ event.owner }} | {{ event.start }} to {{ event.end }}</h5>
		<h4 class="desc" v-if="editing">Event Description:</h4>
		<textarea v-if="editing" class="editArea" :value="draftDesc" @input="draftDesc = $event.target.value" />
		<h3 v-else class="desc">
			{{ event.description }}
		</h3>
		<h4 class="item">Freeters:</h4>
		<input v-if="editing" class="editArea" :value="draftFreeters" @input="draftFreeters = $event.target.value" />
		<FreeterComponent v-else v-for="freeter in event.freeters" :key="freeter" :freeter="freeter" />
		<div v-if="$store.state.username === event.owner" class="actions">
			<button v-if="editing" @click="submitEdit" class="editButton">✅ Save changes</button>
			<button v-if="editing" @click="stopEditing" class="editButton">🚫 Discard changes</button>
			<button v-if="!editing" @click="startEditing" class="editButton">✏️ Edit</button>
			<button @click="deleteEvent" class="editButton">🗑️ Delete</button>
		</div>
		<section class="alerts">
			<article v-for="(status, alert, index) in alerts" :key="index" :class="status">
				<p>{{ alert }}</p>
			</article>
		</section>
		<section v-if="$store.state.freets.length">
			<p>Freets:</p>
			<FreetComponent v-for="freet in event.freets" :key="freet.id" :freet="freet" />
		</section>
		<article v-else>
			<h3>No freets for event.</h3>
		</article>
		<p class="info">Posted at {{ event.dateModified }}</p>
	</article>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import FreeterComponent from "@/components/Event/FreeterComponent.vue";

export default {
	name: "EventComponent",
	components: {
		FreetComponent,
		FreeterComponent,
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
.event {
	border: 1px solid #111;
	padding: 20px;
	position: relative;
	margin-bottom: 20px;
	border-radius: 15px;
	background-color: whitesmoke;
	border-style: none;
}

.item {
	margin: 10px 0px;
}

.desc {
	margin-top: 20px;
	margin-bottom: 10px;
	font-weight: 400;
}

.topItem {
	margin-bottom: 5px;
}

.editArea {
	border-style: none;
	border-radius: 10px;
	background-color: white;
	width: 400px;
	padding: 5px;
}

.editButton {
	margin-right: 10px;
	padding: 10px 30px;
	border: none;
	border-radius: 10px;
	background-color: cornflowerblue;
}

.editButton:hover {
	cursor: pointer;
}

.actions {
	margin-top: 10px;
}
</style>
