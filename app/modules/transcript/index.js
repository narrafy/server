
function build(conversations)
{
    const transcript = []
    conversations.forEach(conversation => {
        if (conversation.input && conversation.input.text) {
                transcript.push({ senderId: "User" , text: [conversation.input.text] })
        }
        if (conversation.output && conversation.output.text) {
            transcript.push({ senderId: "Narrafy" , text: conversation.output.text })
        }
    })
    return transcript;
}

module.exports = {
    build: build
}