import { writeFileSync, readFileSync } from 'fs';

const rawData = JSON.parse(readFileSync('./node_modules/emoji-datasource/emoji.json', 'utf8'));

function getEmoji(unified) {
	const chars = unified.split('-');
	const codePoints = chars.map((char) => parseInt(char, 16));
	return String.fromCodePoint(...codePoints);
}

rawData.sort((e1, e2) => e1.sort_order - e2.sort_order);
const newEmojiData = rawData.map((emojiItem) => {
	const newData = {
		name: emojiItem.short_name,
		...(emojiItem.short_names.length === 1 ? {} : { names: emojiItem.short_names }),
		emoji: getEmoji(emojiItem.unified),
		category: emojiItem.category
	};

	if (emojiItem.skin_variations) {
		newData.variants = Object.entries(emojiItem.skin_variations).map(([variationName, variation]) => (
			{
				name: emojiItem.short_name,
				key: `${emojiItem.short_name}-${variationName}`,
				emoji: getEmoji(variation.unified)
			}
		));
	}

	return newData;
});

writeFileSync('src/lib/data/emoji.json', JSON.stringify(newEmojiData));
