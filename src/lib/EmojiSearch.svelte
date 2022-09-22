<svelte:options immutable/>

<script lang="ts">
	import { onMount } from 'svelte';

	import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
	import Icon from 'fa-svelte';

	export let searchText = '';

	let searchField: HTMLInputElement;

	onMount(() => {
		searchField.focus();
	});

	function clearSearchText() {
		searchText = '';
		searchField.focus();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && searchText) {
			clearSearchText();
		}
	}
</script>

<div class="search">
	<input
		type="text"
		placeholder="Search emojis..."
		bind:value={searchText}
		bind:this={searchField}
		on:keydown|stopPropagation={handleKeyDown}
	/>

	{#if searchText}
		<span class="icon clear-button" role="button" on:click|stopPropagation={clearSearchText}
			><Icon icon={faTimes} /></span
		>
	{:else}
		<span class="icon"><Icon icon={faSearch} /></span>
	{/if}
</div>

<style>
	.search {
		padding: 0.25em;
		position: relative;
	}

	.search input {
    font-family: Verdana, sans-serif;
		width: 100%;
		border-radius: 5px;
	}

	.search input:focus {
		outline: none;
		border-color: #4f81e5;
	}

	.icon {
		color: #aaaaaa;
		position: absolute;
		font-size: 1em;
		top: calc(50% - 0.5em);
		right: 0.75em;
	}

	.icon.clear-button {
		cursor: pointer;
	}
</style>
