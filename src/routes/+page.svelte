<script>
	import Login from './Login.svelte';
	import Menu from './Menu.svelte';
	import Game from './Game.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	let logged_in = false;
	let playing = false;
</script>

<svelte:head>
	<title>Slasher</title>
	<meta name='description' content='A Slashing game' />
</svelte:head>

<div>
	{#if !playing}
		<section>
			<!-- Header showing title of the game on main menu -->
			<h1>
				<span class='title'>
					<picture>
						<source srcset={welcome} type='image/webp' />
						<img src={welcome_fallback} alt='Slasher' />
					</picture>
				</span>
			</h1>

			{#if !logged_in}
				<Login on:login={(e) => logged_in = e.detail.success}/>
			{:else}
				<Menu on:play={() => playing = true} on:logout={() => logged_in = false}/>
			{/if}
		</section>
	{:else}
		<Game on:back={() => playing = false} />
	{/if}
</div>

<style lang='postcss'>

</style>
