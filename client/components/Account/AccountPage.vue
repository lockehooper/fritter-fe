<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
	<main>
		<section>
			<header>
				<h2>Account details for @{{ $store.state.username }}</h2>
				<div>Following: {{ $store.state.following.length }}</div>
				<div>Account Classification: {{ $store.state.userClassification }}</div>
			</header>
			<header>
				<h2>Account settings for @{{ $store.state.username }}</h2>
			</header>
			<div @click="toggleShowSettings">
				<slot name="toggleSettings">
					<button>Show Account Settings</button>
				</slot>
			</div>
			<ChangeUsernameForm v-if="showSettings" />
			<ChangePasswordForm v-if="showSettings" />
		</section>
		<section>
			<header>
				<h2>Account management</h2>
			</header>
			<div @click="toggleManageAccount">
				<slot name="toggleManage">
					<button>Toggle Account Management</button>
				</slot>
			</div>
			<AccountClassificationForm v-if="showManagement" />
			<LogoutForm v-if="showManagement" />
			<DeleteAccountForm v-if="showManagement" />
		</section>
	</main>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import AccountClassificationForm from "@/components/Account/AccountClassificationForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";

export default {
	name: "AccountPage",
	components: {
		ChangeUsernameForm,
		ChangePasswordForm,
		DeleteAccountForm,
		LogoutForm,
		AccountClassificationForm,
	},
	data() {
		return {
			showSettings: false,
			showManagement: false,
		};
	},
	methods: {
		toggleShowSettings() {
			this.showSettings = !this.showSettings;
		},
		toggleManageAccount() {
			this.showManagement = !this.showManagement;
		},
	},
};
</script>
