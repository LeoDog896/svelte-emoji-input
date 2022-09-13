export interface SubEmoji {
  name: string;
  key: string;
  emoji: string;
}

export interface Emoji {
	name: string;
  key?: string;
  names?: string[];
  variants?: { [key: string]: SubEmoji };
  category: string;
	emoji: string;
}
