<script>
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<!--	Design Login and Sign up modal here -->
<div class='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
	<div class='sm:mx-auto sm:w-full sm:max-w-sm'>
		<h2 class='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
			Log in to your account
		</h2>
		{#if form && form.error}
			<div class='mt-4 text-sm leading-5 text-red-700 text-center'>
				{form.error}
			</div>
		{:else if form && form.success && form.message}
			<div class='mt-4 text-sm leading-5 text-green-700 text-center'>
				{form.message}
			</div>
		{/if}
	</div>

	<div class='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
		<form class='space-y-6' method='POST' action='?/login'>
			<div>
				<label for='username' class='block text-sm font-medium leading-6 text-gray-900'
				>Username</label
				>
				<div class='mt-2'>
					<input
						id='username'
						name='username'
						required
						class='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
					/>
				</div>
			</div>

			<div>
				<div class='flex items-center justify-between'>
					<label for='password' class='block text-sm font-medium leading-6 text-gray-900'
					>Password</label
					>
				</div>
				<div class='mt-2'>
					<input
						id='password'
						name='password'
						type='password'
						autocomplete='current-password'
						required
						class='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
					/>
				</div>
			</div>

			<div class='flex flex-col'>
				<button
					type='submit'
					class='w-full mb-2 rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-300'
				>
					Log in
				</button>
				<button
					type='submit'
					formaction='?/register'
					class='w-full rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-300'
				>
					Register
				</button>
			</div>
		</form>
	</div>
</div>

<style lang='postcss'>
</style>
