<script>
	import Login from './Login.svelte';
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
				<h1>Logged in</h1>
				<button on:click={() => logged_in = false}>Logout</button>
				<button on:click={() => playing = true}>Play</button>
			{/if}
		</section>
	{:else}
		<h1>Playing</h1>
		<button on:click={() => playing = false}>Back</button>
	{/if}
</div>

<style lang='postcss'>

</style>
