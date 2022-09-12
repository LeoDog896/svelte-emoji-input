<script>
	import EmojiSelector from '$lib/EmojiSelector.svelte';

	let textContent = '';

	function onEmoji(event) {
		textContent += event.detail;
	}
</script>

<style>
</style>

<h1>Svelte Emoji Input</h1>

<input bind:value={textContent} type="text">
<EmojiSelector on:emoji={onEmoji} />
