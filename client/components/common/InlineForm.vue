<!-- Reusable component for a form in an inline style (input and button on same line) -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
	<form @submit.prevent="submit">
		<input v-model="value" type="text" :placeholder="placeholder" />
		<button type="submit">
			{{ button }}
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
	name: "InlineForm",
	props: {
		placeholder: {
			type: String,
			default: "",
		},
		button: {
			type: String,
			default: "Submit",
		},
	},
	data() {
		return { value: "", alerts: {} };
	},
};
</script>

<style scoped>
form {
	display: flex;
	position: relative;
}

input {
	padding: 10px;
	min-width: 200px;
	border-style: none;
	border-radius: 10px;
	background-color: lightgray;
	font-style: inherit;
	margin-right: 10px;
}

button {
	border-radius: 10px;
	padding: 10px 15px;
	border-style: none;
	background-color: cornflowerblue;
}
button:hover {
	cursor: pointer;
}
</style>
