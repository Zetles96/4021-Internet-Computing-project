<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function doLogout() {
		dispatch('logout', {});
	}
	function doPlay() {
		dispatch('play', {});
	}
</script>

<div>
	<h1>Logged in</h1>
	<button on:click={doLogout}>Logout</button>
	<button on:click={doPlay}>Play</button>
</div>
