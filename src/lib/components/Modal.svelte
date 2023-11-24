<div class="flex flex-col w-full h-full justify-center items-center">
	<div
		class="modal flex flex-col w-10/12 lg:w-8/12 h-full justify-center items-center m-auto rounded m-6"
	>
		<slot />
	</div>
</div>

<style lang="postcss">
	.modal {
		background: #fafafa;
		color: #232323;
	}
</style>
