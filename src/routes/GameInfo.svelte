<script>
	import Modal from '$lib/components/Modal.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	/**
	 * @param {KeyboardEvent} e
	 */
	function onKeyDown(e) {
		if(e.key === "Escape") {
			closeModal();
		}
	}

</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<div
	class='background h-screen w-screen'
	on:click={closeModal}
	on:keydown={closeModal}
	aria-hidden='true'
>
	<Modal>
		<div
			class='flex flex-col justify-center items-center h-full w-full'
			on:click|stopPropagation={() => {}}
			on:keydown|stopPropagation={closeModal}
			aria-hidden='true'
		>
			<div class='flex flex-col pb-3'>
				<h1 class='text-center'>What is Slasher</h1>
				<p>
					Slasher is a hack-and-slash 2D game, about who can slash the most entities
					within the time limit.
				</p>
			</div>
			<div class='flex flex-col pb-3'>
				<h2 class='text-center'>How to Play</h2>
				<p>&#x2022; Join a new game and wait for the game to start.</p>
				<p>&#x2022; Use the arrow keys or WASD to move your player around.</p>
				<p>&#x2022; When an entity is within striking range, press SPACE to slash it.</p>
				<p>&#x2022; The player who has gained the most points win!</p>
			</div>
			<button on:click={closeModal}>Back</button>
		</div>
	</Modal>
</div>

<style lang='postcss'>
    .background {
        /*	Dim the background */
        background-color: rgba(0, 0, 0, 0.5);
        transition: background-color 0.5s ease-in-out;
        position: absolute;
        left: 0;
        top: 0;
    }
</style>
