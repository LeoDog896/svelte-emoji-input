<svelte:options immutable/>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { faFrown } from '@fortawesome/free-regular-svg-icons';
	import Icon from 'fa-svelte';

	import EmojiList from './EmojiList.svelte';

	import emojiData from './data/emoji.json';

	export let searchText = '';

	$: processedSearchText = searchText.toLowerCase();

	const dispatch = createEventDispatcher<{emojihover: null}>();

	$: searchResults = emojiData.filter((emoji) => {
    if (emoji.names) {
      return emoji.names.find(name => name.includes(processedSearchText))
    } else {
      return emoji.name.includes(processedSearchText)
    }
	});

	function onMouseOver() {
		dispatch('emojihover', null);
	}
</script>

<div class="search-results">
	{#if searchResults.length}
		<EmojiList emojis={searchResults} withTabs={false} on:emojihover on:emojiclick />
	{:else}
		<div class="no-results" on:mouseover={onMouseOver} on:focus={onMouseOver}>
			<div class="icon"><Icon icon={faFrown} /></div>
			<h3>No emojis found.</h3>
		</div>
	{/if}
</div>

<style>
	.search-results {
		padding: 0.25em;
		height: 15rem;
	}

	.search-results h3 {
		margin: 0;
		font-size: 0.9em;
		margin: 0 auto;
		color: #999999;
	}

	.no-results {
		height: 15rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.no-results .icon {
		margin: 0 auto;
		font-size: 3em;
		color: #999999;
	}
</style>
