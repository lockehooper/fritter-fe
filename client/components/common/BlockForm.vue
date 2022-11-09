<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
	<form @submit.prevent="submit">
		<h3>{{ title }}</h3>
		<article v-if="fields.length">
			<div v-for="field in fields" :key="field.id">
				<label :for="field.id">{{ field.label }}:</label>
				<textarea
					v-if="field.id === 'content'"
					:name="field.id"
					:value="field.value"
					@input="field.value = $event.target.value" />
				<input
					v-else
					:type="field.id === 'password' ? 'password' : 'text'"
					:name="field.id"
					:value="field.value"
					@input="field.value = $event.target.value" />
			</div>
		</article>
		<article v-else>
			<p>{{ content }}</p>
		</article>
		<button type="submit">
			{{ title }}
		</button>
		<section class="alerts">
			<article v-for="(status, alert, index) in alerts" :key="index" :class="status">
				<p>{{ alert }}</p>
			</article>
		</section>
	</form>
</template>

<script>
export default {
	name: "BlockForm",
	data() {
		/**
		 * Options for submitting this form.
		 */
		return {
			url: "", // Url to submit form to
			method: "GET", // Form request method
			hasBody: false, // Whether or not form request has a body
			setUser: false, // Whether or not stored username should be updated after form submission
			refreshFreets: false, // Whether or not stored freets should be updated after form submission
			refreshEvents: false,
			alerts: {}, // Displays success/error messages encountered during form submission
			callback: null, // Function to run after successful form submission
		};
	},
	methods: {
		async submit() {
			/**
			 * Submits a form with the specified options from data().
			 */
			const timeFields = ["startMonth", "startDay", "startHours", "endMonth", "endDay", "endHours"];
			const options = {
				method: this.method,
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin", // Sends express-session credentials with request
			};
			let startTime = 0;
			let endTime = 0;
			if (this.convertTime) {
				const startMonth = this.fields.filter((f) => f.id === "startMonth")[0].value;
				const startDay = this.fields.filter((f) => f.id === "startDay")[0].value;
				const startHours = this.fields.filter((f) => f.id === "startHours")[0].value;
				const endMonth = this.fields.filter((f) => f.id === "endMonth")[0].value;
				const endDay = this.fields.filter((f) => f.id === "endDay")[0].value;
				const endHours = this.fields.filter((f) => f.id === "endHours")[0].value;
				const startDate = new Date("2022", parseInt(startMonth - 1), parseInt(startDay), parseInt(startHours));
				const endDate = new Date("2022", parseInt(endMonth - 1), parseInt(endDay), parseInt(endHours));
				startTime = startDate.getTime();
				endTime = endDate.getTime();
			}

			if (this.hasBody) {
				options.body = JSON.stringify(
					Object.fromEntries([
						...this.fields.map((field) => {
							const { id, value } = field;
							field.value = "";
							return [id, value];
						}),
						...["start", "end"]
							.filter((_) => startTime !== 0 && endTime !== 0)
							.map((k) => {
								return [k, k == "start" ? startTime : endTime];
							}),
					])
				);
			}

			try {
				const r = await fetch(this.url, options);
				if (!r.ok) {
					// If response is not okay, we throw an error and enter the catch block
					const res = await r.json();
					throw new Error(res.error);
				}

				if (this.setUser) {
					const text = await r.text();
					const res = text ? JSON.parse(text) : { user: null };
					this.$store.commit("setUser", res.user ? res.user : null);
				}

				if (this.updateClassification) {
					this.$store.commit("refreshClassification");
				}

				if (this.refreshFreets) {
					this.$store.commit("refreshFreets");
				}

				if (this.refreshEvents) {
					this.$store.commit("refreshEvents");
				}

				if (this.callback) {
					this.callback();
				}
			} catch (e) {
				this.$set(this.alerts, e, "error");
				setTimeout(() => this.$delete(this.alerts, e), 3000);
			}
		},
	},
};
</script>

<style scoped>
form {
	padding: 0.5rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-bottom: 14px;
	position: relative;
	padding: 20px;
	border-radius: 20px;
	background-color: lightgray;
}

article > div {
	display: flex;
	flex-direction: column;
}

form > article p {
	margin: 0;
}

form h3,
form > * {
	margin: 0.3em 0;
}

form h3 {
	margin-top: 0;
}

textarea {
	font-family: inherit;
	border-radius: 10px;
	border-style: none;
	min-height: 60px;
	padding: 5px;
}

input {
	font-family: inherit;
	border-radius: 10px;
	border-style: none;
	padding: 10px;
	margin-bottom: 20px;
	margin-top: 5px;
}

button {
	padding: 10px;
	border-radius: 10px;
	background-color: cornflowerblue;
	border-style: none;
	font-family: inherit;
	font-size: inherit;
}

button:hover {
	cursor: pointer;
}
</style>
