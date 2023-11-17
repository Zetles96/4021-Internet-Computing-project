<script>
	import './styles.css';
	import "../app.css";
</script>

<div class="app flex flex-col min-h-screen">
	<main class='flex flex-col w-full'>
		<slot />
	</main>

	<footer class='flex flex-col justify-center items-center p-1'>
		<!--	Possible footer stuff here	-->
	</footer>
</div>

<style lang='postcss'>
	main {
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
