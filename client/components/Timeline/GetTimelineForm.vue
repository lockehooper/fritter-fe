<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from "@/components/common/InlineForm.vue";

export default {
	name: "GetFreetsForm",
	mixins: [InlineForm],
	data() {
		return { value: this.$store.state.filter };
	},
	methods: {
		async submit() {
			const url = `/api/timeline`;
			try {
				const r = await fetch(url, {
					body: JSON.stringify({ type: this.value }),
				});
				const res = await r.json();
				if (!r.ok) {
					throw new Error(res.error);
				}

				this.$store.commit("updateTimelineFilter", this.value);
				this.$store.commit("updateeFreets", res);
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
