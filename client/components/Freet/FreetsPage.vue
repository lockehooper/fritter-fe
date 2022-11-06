<!-- Default page that also displays freets -->

<template>
	<main>
		<section v-if="$store.state.username">
			<header>
				<h2>Welcome @{{ $store.state.username }}</h2>
			</header>
			<CreateFreetForm />
			<FollowUserForm />
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
						Viewing {{ $store.state.filter }} timeline
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
import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";
import GetTimelineFreetsForm from "@/components/Timeline/GetTimelineForm.vue";

export default {
	name: "FreetPage",
	components: { FreetComponent, GetTimelineFreetsForm, GetFreetsForm, CreateFreetForm, FollowUserForm },
	mounted() {
		this.$refs.GetFreetsForm.submit();
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

				this.$store.commit("updateFreets", res.freets);
			} catch (e) {
				this.$store.commit("updateTimelineFilter", "FEATURED");
				this.$store.commit("refreshTimelineFreets");

				this.$set(this.alerts, e, "error");
				setTimeout(() => this.$delete(this.alerts, e), 3000);
			}
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

.timelineType {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	margin-bottom: 10px;
}
</style>
