<script>
	/**
	 * @type {[{name: string, score: number}]}
	 */
	export let players;

	// Sort the players by score
	$: {
		players.sort((a, b) => b.score - a.score);
	}
</script>

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
		{#each players as { name, score }, i}
			<tr>
				<td class="border border-slate-700 ...">{i+1}</td>
				<td class="border border-slate-700 ...">{name}</td>
			</tr>
		{/each}
		</tbody>
	</table>
</div>
<div class="grow col-span-5 sm:col-span-2 bg-indigo-500/75">
	<table
		class="border-collapse border border-slate-500 table-auto mx-auto w-full"
	>
		<thead>
		<tr>
			<th colspan="2" class="border border-slate-600">Score</th>
		</tr>
		</thead>
		<tbody>
		{#each players as { name, score }, i}
			<tr>
				<td class="border border-slate-700 text-center ...">{score}</td>
			</tr>
		{/each}
		</tbody>
	</table>
</div>