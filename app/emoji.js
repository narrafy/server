"use strict";

var emojiDictionary = {
    emoji_thank_you:"🤝",
    emoji_hugging_face: "🤗",
    emoji_broken_heart: "💔",
    emoji_curious: "🤓",
    emoji_book: "📖",
    emoji_skiing: "⛷️",
    emoji_watching_films:"📽️",
    emoji_surfing:"🏄",
    emoji_traveling:"✈️",
    emoji_end: "🏁",
    emoji_slight_smile: "🙂",
    emoji_smile: "😊",
    emoji_thinking: "🤔",
    emoji_party:"🎉",
    emoji_dance:"💃🏿",
    emoji_relax:"🛀",
    emoji_smile_tears:"😂",
    emoji_sing:"🎤",
    emoji_clock:"🕰️",
    emoji_sad: "😞"
};

function replaceEmojiKey(input){
    if(!input) return null;
    return checkForEmoji(input);
}

function checkForEmoji(input) {
    let stringArray = input.split(' ');
    for(let i=0; i < stringArray.length; i++){
        for(let key in emojiDictionary){
            //we have a emoji key in the string
            if(stringArray[i]===key){
                //replace emoji with the emoji key
                input = input.replace(key, emojiDictionary[key]);
            }
        }
    }
    return input;
}


module.exports = {
    ReplaceEmojiKey: (input) => {
        return replaceEmojiKey(input);
    }
};