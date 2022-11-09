<!-- Reusable component representing a single event and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
	<div class="freeter">
		<h5 class="item">@{{ freeter }}</h5>
	</div>
</template>

<script>
export default {
	name: "FreeterComponent",
	props: {
		// Data from the stored freet
		freeter: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped>
.freeter {
	padding: 10px 25px;
	width: min-content;
	margin-right: 10px;
	background-color: lightgray;
	border-style: none;
	border-radius: 15px;
}

.item {
	margin: 0px;
}
</style>
