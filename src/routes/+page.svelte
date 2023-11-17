<script>
	import Login from './Login.svelte';
	import Menu from './Menu.svelte';
	import Game from './Game.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	let logged_in = false;
	let playing = false;
</script>

<svelte:head>
	<title>Slasher</title>
	<meta name='description' content='A Slashing game' />
</svelte:head>

<div class='flex flex-col'>
	{#if !playing}
		<section class='flex flex-col h-screen'>
			<!-- Header showing title of the game on main menu -->
			<h1 class='title flex justify-center'>
				SLASHER
			</h1>

			<Modal>
				{#if !logged_in}
					<Login on:login={(e) => logged_in = e.detail.success}/>
				{:else}
					<Menu on:play={() => playing = true} on:logout={() => logged_in = false}/>
				{/if}
			</Modal>
		</section>
	{:else}
		<Game on:back={() => playing = false} />
	{/if}
</div>

<style lang='postcss'>
	.title {
		font-size: 5rem;
		text-align: center;
		padding-top: 1rem;
        padding-bottom: 1rem;
	}
</style>
