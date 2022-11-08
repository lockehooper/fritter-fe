<!-- Default page that also displays freets -->

<template>
	<main>
		<section v-if="$store.state.username">
			<header>
				<h2>Welcome @{{ $store.state.username }}</h2>
			</header>
			<div class="formsContainer">
				<div class="formButton" @click="toggleShowCreateFreet">Create Freet</div>
				<div
					class="formButton"
					@click="toggleShowCreateEvent"
					v-if="$store.state.userClassification === 'VERIFIED'">
					Create Event
				</div>
				<div class="formButton" @click="toggleShowFollowUser">Follow a User</div>
			</div>
			<CreateFreetForm v-if="showCreateFreet" />
			<FollowUserForm v-if="showFollowUser" />
			<CreateEventForm v-if="showCreateEvent" />
		</section>
		<section v-else>
			<header>
				<h2>Welcome to Fritter!</h2>
			</header>
			<article>
				<h3>
					<router-link to="/login"> Sign in </router-link>
					to create, edit, and delete freets.
				</h3>
			</article>
		</section>
		<section>
			<header>
				<div class="left">
					<h2>
						Viewing {{ $store.state.timelineType.toLowerCase() }} timeline
						<!-- <span v-if="$store.state.filter"> by @{{ $store.state.filter }} </span> -->
					</h2>
				</div>
				<div class="right">
					<GetFreetsForm
						ref="getFreetsForm"
						value="author"
						placeholder="🔍 Filter by author (optional)"
						button="🔄 Get freets" />
				</div>
			</header>
			<section>
				<div class="timelineType">
					<div id="Featured" @click="setTimeline">Featured</div>
					<div id="Following" @click="setTimeline">Following</div>
				</div>
			</section>
			<section v-if="$store.state.freets.length">
				<FreetComponent v-for="freet in $store.state.freets" :key="freet.id" :freet="freet" />
			</section>
			<article v-else>
				<h3>No freets found.</h3>
			</article>
		</section>
	</main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
import FollowUserForm from "@/components/Account/FollowUserForm.vue";
import CreateEventForm from "@/components/Event/CreateEventForm.vue";
import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";
import GetTimelineFreetsForm from "@/components/Timeline/GetTimelineForm.vue";

export default {
	name: "FreetPage",
	components: {
		FreetComponent,
		GetTimelineFreetsForm,
		GetFreetsForm,
		CreateFreetForm,
		FollowUserForm,
		CreateEventForm,
	},
	mounted() {
		//this.$refs.GetFreetsForm.submit();
	},
	data() {
		return {
			showCreateFreet: false,
			showCreateEvent: false,
			showFollowUser: false,
		};
	},
	methods: {
		setTimeline: async function (event) {
			const options = {
				method: this.method,
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin", // Sends express-session credentials with request,
				body: JSON.stringify({ type: this.value }),
			};
			const targetId = event.currentTarget.id;
			this.$store.commit("updateTimelineFilter", targetId.toUpperCase());
			const url = `/api/timeline?type=${targetId.toUpperCase()}`;
			try {
				const r = await fetch(url);
				const res = await r.json();
				if (!r.ok) {
					throw new Error(res.error);
				}
				console.log(res);

				this.$store.commit("updateFreets", res.freets);
			} catch (e) {
				this.$store.commit("updateTimelineFilter", "FEATURED");
				this.$store.commit("refreshTimelineFreets");

				this.$set(this.alerts, e, "error");
				setTimeout(() => this.$delete(this.alerts, e), 3000);
			}
		},
		toggleShowCreateFreet() {
			this.showCreateFreet = !this.showCreateFreet;
			this.showCreateEvent = false;
			this.showFollowUser = false;
		},
		toggleShowCreateEvent() {
			this.showCreateEvent = !this.showCreateEvent;
			this.showCreateFreet = false;
			this.showFollowUser = false;
		},
		toggleShowFollowUser() {
			this.showFollowUser = !this.showFollowUser;
			this.showCreateEvent = false;
			this.showCreateFreet = false;
		},
	},
};
</script>

<style scoped>
section {
	display: flex;
	flex-direction: column;
}

header,
header > * {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

button {
	margin-right: 10px;
}

section .scrollbox {
	flex: 1 0 50vh;
	padding: 3%;
	overflow-y: scroll;
}

.formsContainer {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	padding-bottom: 10px;
}

.formButton {
	padding: 10px 40px;
	border-radius: 15px;
	background-color: cornflowerblue;
}

.formButton:hover {
	cursor: pointer;
}

.timelineType {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	margin-bottom: 10px;
}
</style>
