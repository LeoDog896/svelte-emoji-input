<svelte:options immutable/>

<script lang="ts">
	import type { Emoji, SubEmoji } from './emoji';
	import { createEventDispatcher } from 'svelte';

	export let emoji: Emoji | SubEmoji;

	const dispatch = createEventDispatcher<{emojiclick: Emoji | SubEmoji, emojihover: Emoji | SubEmoji | null}>();

	function onClick() {
		dispatch('emojiclick', emoji);
	}

	function onMouseOver() {
		dispatch('emojihover', emoji);
	}

	function onMouseOut() {
		dispatch('emojihover', null);
	}
</script>

<button
	on:mouseover={onMouseOver}
	on:focus={onMouseOver}
	on:blur={onMouseOut}
	on:mouseout={onMouseOut}
	on:click={onClick}
  title={emoji.name.replaceAll("_", " ")}>
  {emoji.emoji}
</button>

<style>
	button {
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 1.3em;
		width: 1.5em;
		height: 1.5em;
		padding: 0;
		margin: 0;
	}

	button:hover {
		background: #e8f4f9;
		border-radius: 5px;
	}
</style>
