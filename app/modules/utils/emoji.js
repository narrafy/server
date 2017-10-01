const emojiDictionary = {
	emoji_thank_you: "🤝",
	emoji_hugging_face: "🤗",
	emoji_broken_heart: "💔",
	emoji_curious: "🤓",
	emoji_book: "📖",
	emoji_skiing: "⛷️",
	emoji_watching_films: "📽️",
	emoji_surfing: "🏄",
	emoji_traveling: "✈️",
	emoji_end: "🏁",
	emoji_slight_smile: "🙂",
	emoji_smile: "😊",
	emoji_thinking: "🤔",
	emoji_party: "🎉",
	emoji_dance: "💃🏿",
	emoji_relax: "🛀",
	emoji_smile_tears: "😂",
	emoji_grin: "😀",
	emoji_sing: "🎤",
	emoji_clock: "🕰️",
	emoji_sad: "😞",
	emoji_ok: "👌"
}

function replaceEmojiKey(input) {
	if (!input) return null
	return checkForEmoji(input)
}

function checkForEmoji(input) {

	Object
		.keys(emojiDictionary)
		.forEach(emojiKey => {
			if (input.includes(emojiKey)) {
				input.replace(emojiDictionary[emojiKey])
			}
		})

	return input
}


module.exports = exports = {
	replaceEmojiKey: replaceEmojiKey
}