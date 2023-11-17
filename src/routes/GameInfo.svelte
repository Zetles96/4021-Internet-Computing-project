<script>
	import Modal from '$lib/components/Modal.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

<div class='background h-screen w-screen' on:click={closeModal} on:keydown={closeModal} aria-hidden='true'>
	<Modal>
		<div class="flex flex-col justify-center items-center h-full w-full" on:click|stopPropagation={() => {}} on:keydown|stopPropagation={closeModal} aria-hidden='true'>
			<h1>How to Play</h1>
			<p>Use the arrow keys to move the snake around the board.</p>
			<p>Collect the red apples to grow your snake.</p>
			<p>Don't run into the walls or yourself!</p>
			<button on:click={closeModal}>Back</button>
		</div>
	</Modal>
</div>

<style lang='postcss'>
	.background {
		/*	Dim the background */
		background-color: rgba(0, 0, 0, 0.5);
		transition: background-color 0.5s ease-in-out;
	}
</style>