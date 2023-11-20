<script>
	import { createEventDispatcher } from 'svelte';
	import GameInfo from './GameInfo.svelte';

	const dispatch = createEventDispatcher();

	function doLogout() {
		dispatch('logout', {});
	}
	function doPlay() {
		dispatch('play', {});
	}

	let show_how_to_play = false;
</script>

<div class='flex flex-col justify-center items-center'>
	{#if show_how_to_play}
		<GameInfo on:close={() => show_how_to_play = false} />
	{/if}
	<h1>Logged in</h1>
	<div class='flex flex-col p-4'>
		<button on:click={doLogout}>Logout</button>
		<button on:click={() => show_how_to_play = true}>How to Play</button>
		<button on:click={doPlay}>Play</button>
	</div>
</div>
