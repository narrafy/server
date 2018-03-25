const config = require('../config')

function getFooterNoUsername(){
    let footer = "<hr/><p style='font-size: medium'> <a href='https://www.narrafy.io'>Narrafy Team</a>, wishes you a nice day!</p>"
    let ps = "<p style='font-size: medium'> P.S. Take a look at our <a href='https://medium.com/narrafy/2018-q1-c6d60cab5612'>blog</a> to find out more about our work.</p>"
    return footer + ps
}

function getFooter(username){
    let footer = "<p>" + username  + "<a href='https://www.narrafy.io'> Narrafy Team</a> wishes you a nice day!</p>"
    let ps = "<hr/><p> P.S. Take a look at our <a href='https://medium.com/narrafy/2018-q1-c6d60cab5612'>blog</a> to find our more about our work.</p>"
    return footer + ps
}

function transcriptBody(transcript) {

    let startBody =  "<html><body><div>"
    let message = "<h4>" + "Thank you for training our conversational robot!" +"</h4>"
    let k = transcript.length;
    let transcriptHtml = "";
    for(let i = 0; i < k; i ++){
        if(i%2){
            transcriptHtml += "<li>" + transcript[i] + "</li>"
        }else {
            transcriptHtml += "<li>" + transcript[i] + "</li>"
        }
    }

    let footer = getFooterNoUsername()
    let endBody = "</div><body/></html>"
    return startBody + message + "<ul>" + transcriptHtml + "</ul>" + footer + endBody
}

function getStory(data) {

    let header = "<html><body>"
    let content = ""

    if(data.story){
        content += "<p style='font-size: medium'>"+ data.story + "</p>"
    }

    let footer = getFooterNoUsername()
    return header + content + footer
}

function getAdminEmailBody(data){

    return "<html><body><p>" + "Hey good-looking! You have a new story to look at." +
        "</p>" +
        "<p><a target='_self' href='https://" + data.url + "'> Check Story </a></p></body></html>"
}

function getContactHtml(data) {
    let startBody =  "<html><body><div>"

    let message = "<h4>" + "You have a new message: " +"</h4>"

    let htmlBody = "<p> + data.message + </p>";

    let footer = getFooterNoUsername()

    let endBody = "</div><body/></html>"

    return startBody + message + htmlBody + footer + endBody
}

function getSubscriberReply() {
    return "<html><body><p>" + "We have received your email." +
        " As soon as we have something important to share we will contact you." +
        "<p><a href='https://www.narrafy.io'>Narrafy Team</a> wishes you a nice day!</p></body></html>"
}

function getUserReply(username) {

    let startBody =  "<html><body><div>"

    let message = "<h4>" + "Thank you for reaching out!" +"</h4>"

    let htmlBody = "<p> We received your email and will contact you as soon as possible. </p>";

    let footer = getFooter(username)

    let endBody = "</div><body/></html>"

    return startBody + message + htmlBody + footer + endBody

}

module.exports = {
    userReply: getUserReply,
    subscriberReply: getSubscriberReply,
    story: getStory,
    transcript: transcriptBody,
    adminEmail: getAdminEmailBody,
    contactHtml: getContactHtml,
}