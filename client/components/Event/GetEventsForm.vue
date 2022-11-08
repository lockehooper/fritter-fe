<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from "@/components/common/InlineForm.vue";

export default {
	name: "GetEventsForm",
	mixins: [InlineForm],
	methods: {
		async submit() {
			const url = "/api/events";
			try {
				const r = await fetch(url);
				const res = await r.json();
				if (!r.ok) {
					throw new Error(res.error);
				}
				console.log(res);
				this.$store.commit("updateEvents", res);
			} catch (e) {
				this.$set(this.alerts, e, "error");
				setTimeout(() => this.$delete(this.alerts, e), 3000);
			}
		},
	},
};
</script>
