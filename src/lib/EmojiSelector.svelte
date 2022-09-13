<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import type { Writable } from "svelte/store"

	import { faBuilding, faFlag, faLightbulb, faSmile } from '@fortawesome/free-regular-svg-icons';
	import { faCat, faCoffee, faFutbol, faHistory, faMusic, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Icon from 'fa-svelte';
	import Popper from 'popper.js';
	import { localStore } from 'svelte-persistent';
	import writableDerived from 'svelte-writable-derived';
	import type { Emoji as EmojiType, SubEmoji } from "$lib/emoji"

	import ClickOutside from 'svelte-click-outside';
	import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';

	import EmojiDetail from './EmojiDetail.svelte';
	import EmojiList from './EmojiList.svelte';
	import EmojiSearch from './EmojiSearch.svelte';
	import EmojiSearchResults from './EmojiSearchResults.svelte';
	import VariantPopup from './VariantPopup.svelte';

	import emojiData from './data/emoji.json';

	const smileIcon = faSmile;

	export let maxRecents = 50;
	export let autoClose = true;

	let triggerButtonEl: HTMLButtonElement;
	let pickerEl: HTMLDivElement;
	let popper: Popper;

	let variantsVisible = false;
	let pickerVisible = false;

	let variants: { [key: string]: SubEmoji } = {};
	let currentEmoji: EmojiType | SubEmoji | null;
	let searchText: string;
	let recentEmojis: Writable<(EmojiType | SubEmoji)[]> = writableDerived(
		localStore('svelte-emoji-picker-recent', '[]'),
		(json) => JSON.parse(json),
		(json) => JSON.stringify(json)
	);

	const dispatch = createEventDispatcher<{emoji: string}>();

	const emojiCategories: { [key: string]: EmojiType[] } = {};
	emojiData.forEach((emoji) => {
		let categoryList = emojiCategories[emoji.category];
		if (!categoryList) {
			categoryList = emojiCategories[emoji.category] = [];
		}

		categoryList.push(emoji);
	});

	const categoryOrder = [
		'Smileys & Emotion',
		'Animals & Nature',
		'Food & Drink',
		'Activities',
		'Travel & Places',
		'Objects',
		'Symbols',
		'Flags'
	];

	const categoryIcons: { [key: string]: IconDefinition } = {
		'Smileys & Emotion': faSmile,
		'Animals & Nature': faCat,
		'Food & Drink': faCoffee,
		Activities: faFutbol,
		'Travel & Places': faBuilding,
		Objects: faLightbulb,
		Symbols: faMusic,
		Flags: faFlag
	};

	function hidePicker() {
		pickerVisible = false;
		searchText = '';
		popper.destroy();
	}

	async function togglePicker() {
		pickerVisible = !pickerVisible;

		if (pickerVisible) {
			await tick();
			popper = new Popper(triggerButtonEl, pickerEl, {
				placement: 'right'
			});
		} else {
			searchText = '';
			popper.destroy();
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			hidePicker();
		}
	}

	function showEmojiDetails(event: CustomEvent<EmojiType | SubEmoji | null>) {
		currentEmoji = event.detail;
	}

	function onEmojiClick(event: CustomEvent<EmojiType | SubEmoji>) {
		if (event.detail.variants) {
			variants = event.detail.variants;
			variantsVisible = true;
		} else {
			dispatch('emoji', event.detail.emoji);
			saveRecent(event.detail);

			if (autoClose) {
				hidePicker();
			}
		}
	}

	function onVariantClick(event: CustomEvent<EmojiType | SubEmoji>) {
		dispatch('emoji', event.detail.emoji);
		saveRecent(event.detail);
		hideVariants();

		if (autoClose) {
			hidePicker();
		}
	}

	function saveRecent(emoji: EmojiType | SubEmoji) {
		$recentEmojis = [emoji, ...$recentEmojis.filter((recent) => recent.key ?? recent.name !== emoji.key ?? emoji.name)].slice(
			0,
			maxRecents
		);
	}

	function hideVariants() {
		// We have to defer the removal of the variants popup.
		// Otherwise, it gets removed before the click event on the body
		// happens, and the target will have a `null` parent, which
		// means it will not be excluded and the clickoutside event will fire.
		setTimeout(() => {
			variantsVisible = false;
		});
	}
</script>

<svelte:body on:keydown={onKeyDown} />

<button class="trigger" bind:this={triggerButtonEl} on:click={togglePicker}>
	<Icon icon={smileIcon} />
</button>

{#if pickerVisible}
	<ClickOutside on:clickoutside={hidePicker} exclude={[triggerButtonEl]}>
		<div class="picker" bind:this={pickerEl} on:keydown={onKeyDown}>
			<EmojiSearch bind:searchText />
			{#if searchText}
				<EmojiSearchResults
					{searchText}
					on:emojihover={showEmojiDetails}
					on:emojiclick={onEmojiClick}
				/>
			{:else}
				<div class="svelte-emoji-picker__emoji-tabs">
					<Tabs initialSelectedIndex={1}>
						<TabList>
							<Tab><Icon icon={faHistory} /></Tab>
							{#each categoryOrder as category}
								<Tab><Icon icon={categoryIcons[category]} /></Tab>
							{/each}
						</TabList>

						<TabPanel>
							<EmojiList
								name="Recently Used"
								emojis={$recentEmojis}
								on:emojihover={showEmojiDetails}
								on:emojiclick={onEmojiClick}
							/>
						</TabPanel>

						{#each categoryOrder as category}
							<TabPanel>
								<EmojiList
									name={category}
									emojis={emojiCategories[category]}
									on:emojihover={showEmojiDetails}
									on:emojiclick={onEmojiClick}
								/>
							</TabPanel>
						{/each}
					</Tabs>
				</div>
			{/if}

			{#if variantsVisible}
				<VariantPopup {variants} on:emojiclick={onVariantClick} on:close={hideVariants} />
			{/if}

			<EmojiDetail emoji={currentEmoji} />
		</div>
	</ClickOutside>
{/if}

<style>
	.picker {
		background: #ffffff;
		border: 1px solid #cccccc;
		border-radius: 5px;
		width: 23rem;
		height: 21rem;
		margin: 0 0.5em;
		box-shadow: 0px 0px 3px 1px #cccccc;
	}

	.trigger {
		cursor: pointer;
	}

	.svelte-emoji-picker__emoji-tabs {
		padding: 0.25em;
		height: 15rem;
	}

	:global(.svelte-emoji-picker__emoji-tabs .svelte-tabs ul.svelte-tabs__tab-list) {
		display: flex;
	}

	:global(.svelte-emoji-picker__emoji-tabs .svelte-tabs li.svelte-tabs__tab) {
		flex-grow: 1;
	}
</style>
