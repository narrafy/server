const config = require('../config')

function getTranscript(transcript) {

    const transcriptHtml = transcript.map(record => {
        return i % 2 ? `<li>${record}</li>` : `<li><strong>${record}</strong></li>`
    }).join('')

    return `<html><body><ul>{transcriptHtml}</ul><body/></html>`
}

function getStory(stories) {

    let header = "<html><body>"

    let story="";
    if(stories){
        stories.forEach(entry => {
            if(story.interview_type === config.interviewTypes.internalization)
            {
                let h2 = "<h2>" + entry.internalization +"</h2>>"
                let span = "<p>" + entry.story + "</p>>"
                story += h2
                story += span
            }
        })
    }

    let footer = "<hr/><p>Have a nice day! <a href='https://www.narrafy.io'>Narrafy Team</a></p>" +
        "<body/></html>"

    return header + story + footer

}

function getSubscriberReply() {
    return "<html><body><p>" + "Hey! We received your email." +
        " We will contact you when we have something important to share." +
        " Otherwise, we don't bother innocent people!" + "</p>" +
        "<p>Have a nice day! <a href='https://www.narrafy.io'>Narrafy Team</a></p></body></html>"
}

function getUserReply() {
    return "<html><body><p>" + "Hi! We received your email." +
        " We will contact as soon as possible. Thank you for your interest!" +
        "</p>" +
        "<p><a href='https://www.narrafy.io'>Narrafy</a> Team</p></body></html>"
}

module.exports = {

    userReply: getUserReply,
    subscriberReply: getSubscriberReply,
    story: getStory,
    transcript: getTranscript,
}