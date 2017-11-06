
var ContactInput = (function(){

    var settings = {
        selectors: {
            emailBox: '#email-box',
            messageBox: '#contact-box',
            internalizationStoryBox: "#internalization-story-box",
            externalizationStoryBox: "#externalization-story-box",
            nameBox: '#name-box',
            conversationId: '#conversation-id',
            contactForm: '#contact-form',
            sentStoryForm: '#send-story-form',
            notification: '#email-notification',
            subscribeForm: '#subscribe-div',
            subscribeNotification: '#subscribe-notification'
        },
        authorTypes: {
            user: 'user',
            watson: 'watson'
        }
    };

    return {
        init: init,
        contactSubmit: contactSubmit,
        sendStory: sendStory,
        subscribeKeyDown: subscribeKeyDown,
        subscribeSubmit: subscribeSubmit
    };

    //Initialize the module
    function init(){
        Api.sendRequest('', null);
        setupInputBox();
    }


    //Set up the input box to underline text as it is typed
    //This is done by creating a hidden dummy version of the input box that
    //is used to determine what the width of the input text should be.
    // This value is then used to set the new width of the visible input box
    function setupInputBox(){
        var input = document.getElementById('textInput');
        var dummy = document.getElementById('textInputDummy');
        var minFontSize = 14;
        var maxFontSize = 16;
        var minPadding = 4;
        var maxPadding = 6;

        //If no dummy input box exists, create one
        if(dummy ===null){
            var dummyJson = {
                'tagName': 'div',
                'attributes': [{ 'name': 'id', 'value': 'textInputDummy'}]
            };
            dummy = Common.buildDomElement(dummyJson);
            document.body.appendChild(dummy);
        }
        function adjustInput() {
            if (input.value === '') {
                // If the input box is empty, remove the underline
                input.classList.remove('underline');
                input.setAttribute('style', 'width:' + '100%');
                input.style.width = '100%';
            } else {
                // otherwise, adjust the dummy text to match, and then set the width of
                // the visible input box to match it (thus extending the underline)
                input.classList.add('underline');
                var txtNode = document.createTextNode(input.value);
                ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height',
                    'text-transform', 'letter-spacing'].forEach(function(index) {
                    dummy.style[index] = window.getComputedStyle(input, null).getPropertyValue(index);
                });
                dummy.textContent = txtNode.textContent;

                var padding = 0;
                var htmlElem = document.getElementsByTagName('html')[0];
                var currentFontSize = parseInt(window.getComputedStyle(htmlElem, null).getPropertyValue('font-size'), 10);
                if (currentFontSize) {
                    padding = Math.floor((currentFontSize - minFontSize) / (maxFontSize - minFontSize)
                        * (maxPadding - minPadding) + minPadding);
                } else {
                    padding = maxPadding;
                }

                var widthValue = ( dummy.offsetWidth + padding) + 'px';
                input.setAttribute('style', 'width:' + widthValue);
                input.style.width = widthValue;
            }
        }

        input.addEventListener('input', adjustInput);
        window.addEventListener('resize', adjustInput);

        // Trigger the input event once to set up the input box and dummy element
        Common.fireEvent(input, 'input');
    }

    // Display a user or Watson message that has just been sent/received
    function displayMessage(newPayload, typeValue) {
        var isUser = isUserMessage(typeValue);
        var textExists = (newPayload.input && newPayload.input.text)
            || (newPayload.output && newPayload.output.text);
        if (isUser !== null && textExists) {
            // Create new message DOM element
            var messageDivs = buildMessageDomElements(newPayload, isUser);
            var chatBoxElement = document.querySelector(settings.selectors.chatBox);
            var previousLatest = chatBoxElement.querySelectorAll((isUser
                    ? settings.selectors.fromUser : settings.selectors.fromWatson)
                + settings.selectors.latest);
            // Previous "latest" message is no longer the most recent
            if (previousLatest) {
                Common.listForEach(previousLatest, function(element) {
                    element.classList.remove('latest');
                });
            }

            messageDivs.forEach(function(currentDiv) {
                chatBoxElement.appendChild(currentDiv);
                // Class to start fade in animation
                currentDiv.classList.add('load');
            });
            // Move chat to the most recent messages when new messages are added
            scrollToChatBottom();


        }
    }

    // Checks if the given typeValue matches with the user "name", the Watson "name", or neither
    // Returns true if user, false if Watson, and null if neither
    // Used to keep track of whether a message was from the user or Watson
    function isUserMessage(typeValue){
        if(typeValue=== settings.authorTypes.user){
            return true;
        }else if(typeValue === settings.authorTypes.watson){
            return false;
        }
        return null;
    }

    // Constructs new DOM element from a message payload
    function buildMessageDomElements(newPayload, isUser) {
        var textArray = isUser ? newPayload.input.text : newPayload.output.text;
        if (Object.prototype.toString.call( textArray ) !== '[object Array]') {
            textArray = [textArray];
        }
        var messageArray = [];

        textArray.forEach(function(currentText) {
            if (currentText) {
                var messageJson = {
                    // <div class='segments'>
                    'tagName': 'div',
                    'classNames': ['segments'],
                    'children': [{
                        // <div class='from-user/from-watson latest'>
                        'tagName': 'div',
                        'classNames': [(isUser ? 'from-user' : 'from-watson'), 'latest', ((messageArray.length === 0) ? 'top' : 'sub')],
                        'children': [{
                            // <div class='message-inner'>
                            'tagName': 'div',
                            'classNames': ['message-inner'],
                            'children': [{
                                // <p>{messageText}</p>
                                'tagName': 'p',
                                'text': currentText
                            }]
                        }]
                    }]
                };
                messageArray.push(Common.buildDomElement(messageJson));
            }
        });

        return messageArray;
    }

    // Scroll to the bottom of the chat window (to the most recent messages)
    // Note: this method will bring the most recent user message into view,
    //   even if the most recent message is from Watson.
    //   This is done so that the "context" of the conversation is maintained in the view,
    //   even if the Watson message is long.
    function scrollToChatBottom() {
        var scrollingChat = document.querySelector('#scrollingChat');

        // Scroll to the latest message sent by the user
        var scrollEl = scrollingChat.querySelector(settings.selectors.fromUser
            + settings.selectors.latest);
        if (scrollEl) {
            scrollingChat.scrollTop = scrollEl.offsetTop;
        }
    }


    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // Handles the submission of input
    function contactSubmit(event) {
        // Submit on enter key, dis-allowing blank messages
        var emailBox = document.querySelector(settings.selectors.emailBox);
        if(emailBox.value ){
            if(!validateEmail(emailBox.value)){
                return;
            }
            var messageBox = document.querySelector(settings.selectors.messageBox);

            var nameBox = document.querySelector(settings.selectors.nameBox);
            // Send the user message
            Api.sendContactRequest(emailBox.value, messageBox.value, nameBox.value);

            // Clear input box for further messages
            emailBox.value = '';
            messageBox.value = '';
            Common.fireEvent(emailBox, 'input');
            var contactForm = document.querySelector(settings.selectors.contactForm);
            contactForm.className = 'hide';
            var notification = document.querySelector(settings.selectors.notification);
            notification.className = '';
        }
    }

    // Handles the submission of input
    function sendStory(event) {
        // Submit on enter key, dis-allowing blank messages
        var emailBox = document.querySelector(settings.selectors.emailBox);
        if(emailBox.value ){
            if(!validateEmail(emailBox.value)){
                return;
            }
            var internalizationStoryBox = document.querySelector(settings.selectors.internalizationStoryBox);

            var externalizationStoryBox = document.querySelector(settings.selectors.externalizationStoryBox);

            var nameBox = document.querySelector(settings.selectors.nameBox);

            var conversationId = document.querySelector(settings.selectors.conversationId);

            // Send the user message
            Api.sendUserStory(emailBox.value, internalizationStoryBox.value, externalizationStoryBox.value, nameBox.value, conversationId.value);

            // Clear input box for further messages
            emailBox.value = '';
            internalizationStoryBox.value = '';
            Common.fireEvent(emailBox, 'input');
            var contactForm = document.querySelector(settings.selectors.sentStoryForm);
            contactForm.className = 'hide';
            var notification = document.querySelector(settings.selectors.notification);
            notification.className = '';
        }
    }


    // Handles the submission of input
    function inputKeyDown(event, inputBox) {
        // Submit on enter key, dis-allowing blank messages
        if (event.keyCode === 13 && inputBox.value) {
            fireChatEvent(inputBox);
        }
    }

    // Handles the submission of input
    function subscribeKeyDown(event, inputBox) {
        // Submit on enter key
        if (event.keyCode === 13) {
            fireSubscribeEvent(inputBox);
        }
    }

    function subscribeSubmit(subscribeIdBox){
        var inputBox = document.querySelector('#' +  subscribeIdBox);
        fireSubscribeEvent(inputBox);
    }

    function fireSubscribeEvent(emailBox){

        // Submit on enter key, dis-allowing blank messages
        if(!validateEmail(emailBox.value))
        {
            return;
        }

        // Send the user message
        Api.sendSubscribeRequest(emailBox.value);

        // Clear input box for further messages
        emailBox.value = '';
        Common.fireEvent(emailBox, 'input');
        var contactForm = document.querySelector(settings.selectors.subscribeForm);
        contactForm.className = 'hide';
        var notification = document.querySelector(settings.selectors.subscribeNotification);
        notification.className = 'text-center';
    }

}());