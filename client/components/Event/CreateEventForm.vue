<!-- Form for creating freets (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
	name: "CreateEventForm",
	mixins: [BlockForm],
	data() {
		return {
			url: "/api/events",
			method: "POST",
			hasBody: true,
			convertTime: true,
			fields: [
				{ id: "name", label: "Event Name", value: "" },
				{ id: "description", label: "Event Description", value: "" },
				{ id: "freeters", label: "Freeters (usernames comma separated)", value: "" },
				{ id: "startMonth", label: "Month Event Starts (1-12)", value: "" },
				{ id: "startDay", label: "Day Event Starts (1-31)", value: "" },
				{ id: "startHours", label: "Hour Event Starts (1-23)", value: "" },
				{ id: "endMonth", label: "Month Event Ends (1-12)", value: "" },
				{ id: "endDay", label: "Day Event Ends (1-31)", value: "" },
				{ id: "endHours", label: "Hour Event Ends (1-23)", value: "" },
			],
			title: "Create a new event",
			refreshFreets: true,
			callback: () => {
				const message = "Successfully created event!";
				this.$set(this.alerts, message, "success");
				setTimeout(() => this.$delete(this.alerts, message), 3000);
			},
		};
	},
};
</script>
