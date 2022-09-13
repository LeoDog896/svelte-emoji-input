<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { faTimes } from '@fortawesome/free-solid-svg-icons';
	import Icon from 'fa-svelte';

	import Emoji from './Emoji.svelte';
	import type { SubEmoji } from "./emoji"

	export let variants: { [key: string]: SubEmoji } = {};

	const dispatch = createEventDispatcher<{close: void}>();

	function onClickClose() {
		dispatch('close');
	}

	function onClickContainer() {
		dispatch('close');
	}
</script>

<div class="svelte-emoji-picker__variants-container" on:click={onClickContainer}>
	<div class="svelte-emoji-picker__variants">
		{#each Object.values(variants) as variant}
			<Emoji emoji={variant} on:emojiclick />
		{/each}
		<div class="close-button" role="button" on:click={onClickClose}>
			<Icon icon={faTimes} />
		</div>
	</div>
</div>

<style>
	.svelte-emoji-picker__variants-container {
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 23rem;
		height: 21rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.svelte-emoji-picker__variants {
		background: #ffffff;
		margin: 0.5em;
		padding: 0.5em;
		text-align: center;
	}

	.svelte-emoji-picker__variants .close-button {
		position: absolute;
		font-size: 1em;
		right: 0.75em;
		top: calc(50% - 0.5em);
		cursor: pointer;
	}
</style>
