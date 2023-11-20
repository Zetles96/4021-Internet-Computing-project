<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function toMenu() {
		dispatch('back');
	}
</script>

<div>
	<h1>Playing</h1>
	<button on:click={toMenu}>Back to menu</button>
</div>
