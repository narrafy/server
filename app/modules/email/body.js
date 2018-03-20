const config = require('../config')

function transcriptBody(transcript) {

    let startBody =  "<html><body><div>"
    let message = "<h4>" + "Thank you for training our conversational robot!" +"</h4>"
    let k = transcript.length;
    let transcriptHtml = "";
    for(let i = 0; i < k; i ++){
        if(i%2){
            transcriptHtml += "<li><strong>" + transcript[i] + "</strong></li>"
        }else {
            transcriptHtml += "<li>" + transcript[i] + "</li>"
        }
    }

    let footer = "<hr/><p>Have a nice day! <a href='https://www.narrafy.io'>Narrafy Team</a>.</p>"

    let ps = "<p> P.S. If curiosity is your childhood friend, take a look at our <a href='https://medium.com/narrafy'>blog</a>.</p>"

    let endBody = "</div><body/></html>"

    return startBody + message + "<ul>" + transcriptHtml + "</ul>" + footer + ps + endBody
}

function getStory(data, ps) {

    let header = "<html><body>"
    let content = ""
    let h2 = "<h2>" + "The Story of " + data.user_name +"</h2>"
    content += h2

    if(data.internalization){
        content += "<p style='font-size: medium'>"+ data.internalization + "</p>"
    }
    content += "<h3>" + "Or, " + "</h3>"

    if(data.externalization)
    {
        content += "<p style='font-size: medium'>" + data.externalization + "</p>"
    }

    if(ps){
        content += "<h4>" + ps + "</h4>"
    }

    let footer = "<hr/><p>Have a nice day! <a href='https://www.narrafy.io'>Narrafy Team</a></p>" +
        "<body/></html>"

    return header + content + footer

}

function getAdminEmailBody(data){

    return "<html><body><p>" + "Hello Ion. You have a new story to look at." +
        "</p>" +
        "<p><a target='_self' href='https://" + data.url + "'> Check Story </a></p></body></html>"
}

function getSubscriberReply() {
    return "<html><body><p>" + "Hey! We received your email." +
        " We will contact you when we have something important to share." +
        "<p>Have a nice day! <a href='https://www.narrafy.io'>Narrafy Team</a></p></body></html>"
}

function getUserReply() {
    return "<html><body><p>" + "Hi! We received your email." +
        " We will contact you as soon as possible. Thank you for your interest!" +
        "</p>" +
        "<p><a href='https://www.narrafy.io'>Narrafy Team</a> </p></body></html>"
}

module.exports = {

    userReply: getUserReply,
    subscriberReply: getSubscriberReply,
    story: getStory,
    transcript: transcriptBody,
    adminEmail: getAdminEmailBody,
}