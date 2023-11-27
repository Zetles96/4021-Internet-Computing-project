<script>
	import Modal from '$lib/components/Modal.svelte';
	import { createEventDispatcher } from 'svelte';

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
				<h1 class="text-center col-span-5 pt-10">YOU DIED</h1>
				<div class=" col-span-5 sm:col-span-3 text-center bg-sky-500/75">
					<table
						class="border-collapse border border-slate-500 table-auto mx-auto w-full"
					>
						<thead>
							<tr>
								<th colspan="2" class="border border-slate-600">Leaderboard</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="border border-slate-700 ...">1</td>
								<td class="border border-slate-700 ...">Indianapolis</td>
							</tr>
							<tr>
								<td class="border border-slate-700 ...">2</td>
								<td class="border border-slate-700 ...">Washington DC</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="grow col-span-5 sm:col-span-2 bg-indigo-500/75">
					<table
						class="border-collapse border border-slate-500 table-auto mx-auto w-full"
					>
						<thead>
							<tr>
								<th colspan="2" class="border border-slate-600">Stats</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="border border-slate-700 ...">Kills</td>
								<td class="border border-slate-700 ...">100</td>
							</tr>
							<tr>
								<td class="border border-slate-700 ...">Distance traveled</td>
								<td class="border border-slate-700 ...">100m</td>
							</tr>
						</tbody>
					</table>
				</div>
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
