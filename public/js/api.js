
var Api = (function(){
    var requestPayload;

    var responsePayload;

    var messageEndpoint = '/api/message';

    var contactEndpoint = '/api/contact';

    var sendStoryEndpoint = '/api/story/send';

    var saveStoryEndpoint = '/api/story/save';

    var subscribeEndpoint = '/api/subscribe';

    //publicly accessible methods defined
    return {
        sendRequest: sendRequest,
        sendContactRequest: sendContactRequest,
        sendUserStory: sendUserStory,
        saveUserStory: saveUserStory,
        sendSubscribeRequest: sendSubscribeRequest,

        //The request/response getters/setter are defined here to prevent internal methods
        //from calling the methods without any of the callbacks that are added elsewhere
        getRequestPayload: function(){
            return requestPayload;
        },
        setRequestPayload: function(newPayloadStr){

            var newPayloadArray = JSON.parse(newPayloadStr)
            requestPayload = newPayloadArray;
        },
        getResponsePayload: function(){
            return responsePayload;
        },
        setResponsePayload: function (newPayloadStr) {
            var responsePayloadArray = JSON.parse(newPayloadStr);
            responsePayload = responsePayloadArray;
        }
    };

    //send a message request to the server
    function sendRequest(text, context){
        //Build request payload
        var payloadToWatson = {};
        if(text){
            payloadToWatson.input = {
                text:text
            };
        }
        if(context){
            context.quick_replies = '';
            context.customer_id = "378327679207724"
            context.web_user = true
            payloadToWatson.context = context;
            if (window.location.hostname == "localhost"){
                payloadToWatson.context.localhost = true;
            }
        }else{
            payloadToWatson.context = {
                customer_id : "378327679207724",
                web_user: true
            }
            if (window.location.hostname == "localhost"){
                payloadToWatson.context.localhost = true;
            }
        }

        //Build the http request
        var http  = new XMLHttpRequest();
        http.open('POST', messageEndpoint, true);
        http.setRequestHeader('Content-type','application/json');
        http.onreadystatechange = function(){
            if(http.readyState === 4 && http.status === 200
            &&http.responseText){
                Api.setResponsePayload(http.responseText);
                //first request
                if(!context){
                    var cookieName = "conversation_id";
                    var firstContext = JSON.parse(http.responseText);
                    var conversation_id = firstContext.context.conversation_id;
                    createCookie(cookieName, conversation_id, 30)
                    /*if(!getCookie(cookieName)){

                    }*/
                }
            }
        };
        var params = JSON.stringify(payloadToWatson);

        //stored in a variable (publicly visible through Api.getResponsPayload)
        //to be used throughout the application
        if(Object.getOwnPropertyNames(payloadToWatson).length !== 0){
            Api.setRequestPayload(params);
        }

        //send request
        http.send(params);
    }

    //send a message request to the server
    function sendContactRequest(email, message, name){
        //Build request payload
        var contactForm = {};
        if(email){
            contactForm = {
                email: email,
                message: message,
                name: name
            };
        }
        //Build the http request
        var http  = new XMLHttpRequest();
        http.open('POST', contactEndpoint, true);
        http.setRequestHeader('Content-type','application/json');
        var params = JSON.stringify(contactForm);
        //send request
        http.send(params);
    }

    function sendUserStory(data) {
        sendStory(data, sendStoryEndpoint)
    }

    function saveUserStory(data) {
        saveStory(data, saveStoryEndpoint)
    }

    //send a message request to the server
    function saveStory(data, endPoint){

        //Build the http request
        var http  = new XMLHttpRequest();
        http.open('POST', endPoint, true);
        http.setRequestHeader('Content-type','application/json');
        var params = JSON.stringify(data);
        //send request
        http.send(params);
    }

    //send a message request to the server
    function sendStory(data, endPoint){

        var email = data.email;

        //Build request payload
        var sendStoryForm = {};
        if(email){
            sendStoryForm = {
                email: data.email,
                internalization: data.internalization,
                externalization: data.externalization,
                user_name: data.user_name,
                conversation_id: data.conversation_id
            };
        }
        //Build the http request
        var http  = new XMLHttpRequest();
        http.open('POST', endPoint, true);
        http.setRequestHeader('Content-type','application/json');
        var params = JSON.stringify(sendStoryForm);
        //send request
        http.send(params);
    }

    function sendSubscribeRequest(email){
        //Build request payload
        var contactForm = {};
        if(email){
            contactForm = {
                email: email
            };
        }
        //Build the http request
        var http  = new XMLHttpRequest();
        http.open('POST', subscribeEndpoint, true);
        http.setRequestHeader('Content-type','application/json');
        var params = JSON.stringify(contactForm);
        //send request
        http.send(params);
    }

    function createCookie(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }



}());