<!-- Form for creating freets (block style) -->

<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
	name: "FollowUserForm",
	mixins: [BlockForm],
	data() {
		return {
			url: "/api/users/follow",
			method: "POST",
			hasBody: true,
			fields: [{ id: "followUser", label: "User to Follow", value: "" }],
			title: "Follow a user",
			setUser: true,
			callback: () => {
				const message = "Successfully follower a user!";
				this.$set(this.alerts, message, "success");
				setTimeout(() => this.$delete(this.alerts, message), 3000);
			},
		};
	},
};
</script>
