<!-- Form for creating freets (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
	name: "AccountClassificationForm",
	mixins: [BlockForm],
	data() {
		return {
			url: "/api/classification",
			method: "POST",
			updateClassification: true,
			fields: [
				{ id: "value", label: "Status you're requesting (BOT, HUMAN, VERIFIED)", value: "" },
				{ id: "validation", label: "Classification verification", value: "" },
			],
			title: "Request an account classification",
			setUser: true,
			hasBody: true,
			callback: () => {
				const message = "Successfully got account classification!";
				this.$set(this.alerts, message, "success");
				setTimeout(() => this.$delete(this.alerts, message), 3000);
			},
		};
	},
};
</script>
