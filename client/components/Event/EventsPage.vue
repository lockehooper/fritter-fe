<!-- Default page that also displays freets -->

<template>
	<main>
		<section>
			<header>
				<div class="left">
					<h2>Fritter Events</h2>
				</div>
			</header>
			<section v-if="$store.state.events.length">
				<EventComponent v-for="event in $store.state.events" :key="event.id" :event="event" />
			</section>
			<article v-else>
				<h3>No events found.</h3>
			</article>
		</section>
	</main>
</template>

<script>
import EventComponent from "@/components/Event/EventComponent.vue";

export default {
	name: "EventsPage",
	components: {
		EventComponent,
	},
	async mounted() {
		const url = "/api/events";
		try {
			const r = await fetch(url);
			const res = await r.json();
			if (!r.ok) {
				throw new Error(res.error);
			}
			this.$store.commit("updateEvents", res);
		} catch (e) {
			this.$set(this.alerts, e, "error");
			setTimeout(() => this.$delete(this.alerts, e), 3000);
		}
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
