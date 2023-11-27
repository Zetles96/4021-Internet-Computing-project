<script>
	import Login from './Login.svelte';
	import Menu from './Menu.svelte';
	import Game from './Game.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let playing = false;

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let logged_in = !!data.user;

	function doLogout() {
		// Send a logout request to the server with dummy form-encoded data
		// We do this to remove the cookie with the token properly using actions - document.cookie doesn't work
		fetch('?/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'logout=1'
		}).then(() => {
			// Redirect to the homepage
			window.location.href = '/';
		});
	}
</script>

<svelte:head>
	<title>Slasher</title>
	<meta name="description" content="A Slashing game" />
</svelte:head>

<div class="flex flex-col">
	{#if !playing}
		<section class="flex flex-col h-screen">
			<!-- Header showing title of the game on main menu -->
			<h1 class="title flex justify-center">SLASHER</h1>

			<div class="flex flex-col h-full pb-2">
				<Modal>
					{#if !logged_in}
						<Login {form} />
					{:else}
						<Menu
							user={data.user}
							on:play={() => (playing = true)}
							on:logout={doLogout}
						/>
					{/if}
				</Modal>
			</div>
		</section>
	{:else}
		<Game token={data.token} on:back={() => (playing = false)} />
	{/if}
</div>

<style lang="postcss">
	.title {
		font-size: 5rem;
		text-align: center;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}
</style>
