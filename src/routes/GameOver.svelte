<script>
	import Modal from '$lib/components/Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import ScoreBoard from './ScoreBoard.svelte';

	/**
	 * The game state
	 * @typedef {{status: string, message: string, game_objects: {[key: string]: {name: string, position: number[], score: number, sprite: string, health: number, animation: string, direction: string}}}} GameState
	 */

	/**
	 * @type {GameState}
	 */
	export let gameState;

	let players = [];
	$: {
		players = [];
		for (const [key, value] of Object.entries(gameState.game_objects)) {
			if (value.score !== -1) {
				players.push({
					name: value.name,
					score: value.score
				});
			}
		}
	}

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	function playAgain() {
		dispatch('playAgain');
	}

	/**
	 * @param {KeyboardEvent} e
	 */
	function onKeyDown(e) {
		if (e.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<div
	class="background h-screen w-screen"
	on:click={closeModal}
	on:keydown={closeModal}
	aria-hidden="true"
>
	<Modal>
		<div
			class="flex flex-col h-full w-full"
			on:click|stopPropagation={() => {}}
			on:keydown|stopPropagation={closeModal}
			aria-hidden="true"
		>
			<div class="grid grid-cols-5 px-10">
				<h1 class="text-center col-span-5 pt-10">GAME OVER</h1>
				<ScoreBoard players={players} />
				<div class="col-span-5 text-center">
					<button class="px-5" on:click={closeModal}>Return to Menu</button>
					<button class="px-5" on:click={playAgain}>Play Again</button>
				</div>
			</div>
		</div>
	</Modal>
</div>

<style lang="postcss">
	.background {
		/*	Dim the background */
		background-color: rgba(0, 0, 0, 0.5);
		transition: background-color 0.5s ease-in-out;
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
