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
        let problemFlag = false
        let storyFlag = false
        stories.forEach(entry => {


            if(entry.interview_type === "internalization")
            {
                if(!problemFlag){
                    let h2 = "<h2>" + "The problem" +"</h2>"
                    story += h2
                    problemFlag = true
                }

                let span = "<p>" + entry.story + "</p>>"
                story += span
            }
            if(entry.interview_type === "externalization")
            {
                if(!storyFlag){
                    let h2 = "<h2>" + "The problematic story" +"</h2>"
                    story += h2
                    storyFlag = true
                }

                let span = "<p>" + entry.story + "</p>>"
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
        "<p><a href='https://www.narrafy.io'>Narrafy Team</a> </p></body></html>"
}

module.exports = {

    userReply: getUserReply,
    subscriberReply: getSubscriberReply,
    story: getStory,
    transcript: getTranscript,
}