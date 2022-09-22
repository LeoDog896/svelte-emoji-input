<svelte:options immutable/>

<script lang="ts">
	import type { Emoji as EmojiType, SubEmoji } from './emoji';
	import Emoji from './Emoji.svelte';

	export let name = '';
	export let withTabs = true;
	export let emojis: (EmojiType | SubEmoji)[] = [];
</script>

<h3>{name}</h3>

<div class="list" class:tall={!withTabs}>
	{#each emojis as emoji}
		<Emoji {emoji} on:emojihover on:emojiclick />
	{/each}
</div>

<style>
	h3 {
		margin: 0.25em;
		font-size: 0.9em;
		color: #333333;
	}

	.list {
		height: 14.6rem;
		overflow: scroll;
	}

	.tall {
		height: 14.9rem;
	}
</style>
