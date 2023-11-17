<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function doLogin() {
		dispatch('login', {
			success: true
		});
	}

</script>

<div class="login">
<!--	Design Login and Sign up modal here -->
	<button on:click={doLogin}>Login</button>
</div>

<style lang='postcss'>

</style>