
var Api = (function(){
    var requestPayload;
    var responsePayload;
    var messageEndpoint = '/api/message';

    //publicly accessible methods defined
    return {
        sendRequest: sendRequest,

        //The request/response getters/setter are defined here to prevent internal methods
        //from calling the methods without any of the callbacks that are added elsewhere
        getRequestPayload: function(){
            return requestPayload;
        },
        setRequestPayload: function(newPayloadStr){
            requestPayload = JSON.parse(newPayloadStr);
        },
        getResponsePayload: function(){
            return responsePayload;
        },
        setResponsePayload: function (newPayloadStr) {
            responsePayload = JSON.parse(newPayloadStr);
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
            payloadToWatson.context = context;
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
        if(Object.getOwnPropertyNames(payloadToWatson).length!==0){
            Api.setRequestPayload(params);
        }

        //send request
        http.send(params);
    }
}());