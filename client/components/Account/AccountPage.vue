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
			<div class="optionButtons">
				<div @click="toggleShowSettings" class="buttonSetting">Show Account Settings</div>
				<div @click="toggleManageAccount" class="buttonSetting">Manage Account</div>
			</div>
		</section>
		<section>
			<ChangeUsernameForm v-if="showSettings" />
			<ChangePasswordForm v-if="showSettings" />
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
			this.showManagement = false;
		},
		toggleManageAccount() {
			this.showManagement = !this.showManagement;
			this.showSettings = false;
		},
	},
};
</script>

<style>
.optionButtons {
	margin-top: 20px;
	margin-bottom: 20px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
}

.buttonSetting {
	padding: 10px 20px;
	border-radius: 10px;
	background-color: cornflowerblue;
	font-size: inherit;
	font-weight: inherit;
	margin-right: 10px;
}
</style>
