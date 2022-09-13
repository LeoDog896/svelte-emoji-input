<script lang="ts">
	import EmojiSelector from '$lib/EmojiSelector.svelte';

	let textContent = '';

	function onEmoji(event: CustomEvent<string>) {
		textContent += event.detail;
	}
</script>

<h1>Svelte Emoji Input</h1>

<input bind:value={textContent} type="text" />
<EmojiSelector on:emoji={onEmoji} />

<style>
</style>
