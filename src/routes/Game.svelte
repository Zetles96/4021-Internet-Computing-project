<script>
	import { createEventDispatcher, onMount } from 'svelte';


	const dispatch = createEventDispatcher();

	function toMenu() {
		dispatch('back');
	}

	// onmount set canvas size
	onMount(() => {
		const canvas = document.querySelector('canvas');
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const context = canvas.getContext("2d");
		if (!context) return;

		// fill background
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
	});
</script>

<div>
	<div class='gamecontainer w-screen h-screen'>
		<canvas></canvas>
	</div>
	<div class='overlay w-screen h-screen flex flex-col justify-between items-center'>
		<p class='status'>Playing...</p>
		<button class='backbutton' on:click={toMenu}>Back to Menu</button>
	</div>
</div>

<style lang='postcss'>
	.overlay {
		position: absolute;
		right: 0;
		top: 0;
	}
</style>