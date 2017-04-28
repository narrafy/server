
var cr = require('crypto');


function generateCookieValue(){

    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = cr.createHash('sha1').update(current_date + random).digest('hex');
    return hash;
}


function setCookie(req,res)
{

    // check if client sent cookie
    var cookie = req.cookies.conversation_id;
    if (cookie === undefined)
    {
        // no: set a new cookie
        var hash = generateCookieValue();
        res.cookie('conversation_id', hash, { maxAge: 900000, httpOnly: true });
        console.log('cookie created successfully');
    }
    else
    {
        // yes, cookie was already present
        console.log('cookie exists', cookie);
    }

}

module.exports = {

    SetConversationCookie: (req,res) =>{
        setCookie(req, res)
    },
    ReadConversationCookie: (req, res) => {

    }
};