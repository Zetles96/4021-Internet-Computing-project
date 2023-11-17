<script>
	import { createEventDispatcher } from 'svelte';
	import GameInfo from './GameInfo.svelte';

	const dispatch = createEventDispatcher();

	function toMenu() {
		dispatch('back');
	}

	let show_how_to_play = false;
</script>

<div>
	{#if show_how_to_play}
		<GameInfo on:close={() => show_how_to_play = false} />
	{/if}
	<h1>Playing</h1>
	<button on:click={toMenu}>Back to menu</button>
	<button on:click={() => show_how_to_play = true}>How to Play</button>
</div>
