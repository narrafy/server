const emojiReplacer = require('../../utils/emoji')

function mineResponse(data) {

    let messageArray = []
    if (data) {
        for(let j=0; j< data.length; j++)
        {
            messageArray[j] = emojiReplacer.replaceEmojiKey(data[j])
        }
    }
    return messageArray
}

function parse(text){

    return mineResponse(text)
}

module.exports = {
    parse: parse
}