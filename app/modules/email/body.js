const config = require('../config')

function getFooter(){
    let footer = "<hr/><p>Have a nice day! <a href='https://www.narrafy.io'>Narrafy Team</a>.</p>"

    let ps = "<p> P.S. If curiosity is your childhood friend, take a look at our <a href='https://medium.com/narrafy'>blog</a>.</p>"

    return footer + ps
}

function getFooter(username){
    let footer = "<hr/><p>" + "username"  + "<a href='https://www.narrafy.io'>Narrafy Team</a> wishes you a nice day!</p>"

    let ps = "<p> P.S. If curiosity is your childhood friend, take a look at our <a href='https://medium.com/narrafy'>blog</a>.</p>"

    return footer + ps
}

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

    let footer = getFooter()

    let endBody = "</div><body/></html>"

    return startBody + message + "<ul>" + transcriptHtml + "</ul>" + footer + endBody
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

    let footer = getFooter()

    return header + content + footer

}

function getAdminEmailBody(data){

    return "<html><body><p>" + "Hello Ion. You have a new story to look at." +
        "</p>" +
        "<p><a target='_self' href='https://" + data.url + "'> Check Story </a></p></body></html>"
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
}