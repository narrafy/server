
var Api = (function(){
    var requestPayload;
    var responsePayload;
    var messageEndpoint = '/api/message';
    var contactEndpoint = '/api/contact';
    var sendStoryEndpoint = '/api/story';
    var subscribeEndpoint = '/api/subscribe';

    //publicly accessible methods defined
    return {
        sendRequest: sendRequest,
        sendContactRequest: sendContactRequest,
        sendUserStory: sendStory,
        sendSubscribeRequest: sendSubscribeRequest,

        //The request/response getters/setter are defined here to prevent internal methods
        //from calling the methods without any of the callbacks that are added elsewhere
        getRequestPayload: function(){
            return requestPayload;
        },
        setRequestPayload: function(newPayloadStr){

            var newPayloadArray = JSON.parse(newPayloadStr)
            requestPayload = newPayloadArray;
            console.log(requestPayload)
        },
        getResponsePayload: function(){
            return responsePayload;
        },
        setResponsePayload: function (newPayloadStr) {
            var responsePayloadArray = JSON.parse(newPayloadStr);
            responsePayload = responsePayloadArray;
            console.log(responsePayload)
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
            payloadToWatson.context = context;
        }else{
            payloadToWatson.context = {
                customer_id : "378327679207724"
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

    //send a message request to the server
    function sendStory(email, message, name){
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
        http.open('POST', sendStoryEndpoint, true);
        http.setRequestHeader('Content-type','application/json');
        var params = JSON.stringify(contactForm);
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

}());