<script lang="ts">
	import type { Emoji, SubEmoji } from './emoji';
	export let emoji: Emoji | SubEmoji | null;
</script>

<div class="emoji-detail">
	{#if emoji}
		{emoji.name}
	{:else}
		&nbsp;
	{/if}
</div>

<style>
	.emoji-detail {
		border-top: 1px solid #cccccc;
		padding: 0.25em;
		font-size: 0.8em;
		font-weight: bold;
		height: 3em;
		line-height: 3em;
		text-align: center;
    background-color: white;
	}
</style>
