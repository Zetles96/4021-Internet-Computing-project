<script>
	import Modal from '$lib/components/Modal.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	/**
	 *
	 * @param {string} cheat
	 */
	function useCheat(cheat) {
		dispatch('useCheat', {
			cheat
		});
	}

	// IDEA
	// conditional events + stop prop in game
	/**
	 * @param {KeyboardEvent} e
	 */
	function onKeyDown(e) {
		console.debug('cheats.svelte: ', e.key);

		switch (e.key) {
			case 'Escape':
				console.debug('cheats.svelte: CLOSING esc');
				closeModal();
				break;
			case 'c': // FIX: closes cheats page + game page
				console.debug('cheats.svelte: CLOSING c');
				closeModal();
				break;
			case '1':
				useCheat('inc_spd');
				break;
			case '2':
				useCheat('inc_hp');
				break;
			case '3':
				useCheat('inc_dmg');
				break;
			case '4':
				useCheat('instakill');
				break;
			case '5':
				useCheat('inc_range');
				break;
			case '6':
				useCheat('godmode');
				break;
			default:
				break;
		}
	}
</script>

<svelte:window on:keydown|preventDefault|stopPropagation={onKeyDown} />

<div class="background h-screen w-screen" on:click={closeModal} aria-hidden="true">
	<Modal>
		<div
			class="flex flex-col h-full w-full"
			on:click|stopPropagation={() => {}}
			aria-hidden="true"
		>
			<h1 class="text-center pt-10 p-5">CHEATS</h1>
			<div class="text-center px-10">
				<table class="border-collapse border border-slate-500 table-auto mx-auto w-full">
					<thead>
						<tr>
							<th class="border border-slate-600">Key</th>
							<th class="border border-slate-600">Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="border border-slate-700 ...">1</td>
							<td class="border border-slate-700 ...">Increase speed</td>
						</tr>
						<tr>
							<td class="border border-slate-700 ...">2</td>
							<td class="border border-slate-700 ...">Increase health</td>
						</tr>
						<tr>
							<td class="border border-slate-700 ...">3</td>
							<td class="border border-slate-700 ...">Increase damage</td>
						</tr>
						<tr>
							<td class="border border-slate-700 ...">4</td>
							<td class="border border-slate-700 ...">Instant kill</td>
						</tr>
						<tr>
							<td class="border border-slate-700 ...">5</td>
							<td class="border border-slate-700 ...">Increase range</td>
						</tr>
						<tr>
							<td class="border border-slate-700 ...">6</td>
							<td class="border border-slate-700 ...">(Almost-)Godmode</td>
						</tr>
					</tbody>
				</table>
			</div>
			<button on:click={closeModal}>Back</button>
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
