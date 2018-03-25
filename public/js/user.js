
var User = (function(){

    var settings = {
        selectors: {
            emailBox: '#email-box',
            ccbox: '#cc-box',
            messageBox: '#contact-box',
            internalizationStoryBox: "#internalization-story-box",
            externalizationStoryBox: "#externalization-story-box",
            nameBox: '#name-box',
            conversationId: '#conversation-id',
            contactForm: '#contact-form',
            sentStoryForm: '#send-story-form',
            sendStoryNotification: '#send-story-notification',
            saveDraftNotification: '#save-story-notification',
            needEmailNotification: '#need-email-notification',
            subscribeForm: '#subscribe-div',
            subscribeNotification: '#subscribe-notification'
        },
        authorTypes: {
            user: 'user',
            watson: 'watson'
        }
    };

    return {
        sendStory: sendStory,
        saveDraft: saveDraft,
    };

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }



    // Handles the submission of input
    function sendStory(event) {
        // Submit on enter key, dis-allowing blank messages
        var emailBox = document.querySelector(settings.selectors.emailBox);
        if(!emailBox.value){
            var notification = document.querySelector(settings.selectors.needEmailNotification);
            notification.className = '';
        }
        if(emailBox.value){
            if(!validateEmail(emailBox.value)){
                var notification = document.querySelector(settings.selectors.needEmailNotification);
                notification.className = '';
                return;
            }
            var internalizationStoryBox = document.querySelector(settings.selectors.internalizationStoryBox);
            var externalizationStoryBox = document.querySelector(settings.selectors.externalizationStoryBox);
            var nameBox = document.querySelector(settings.selectors.nameBox);
            var conversationId = document.querySelector(settings.selectors.conversationId);

            // Send the user message
            var story = {
                email: emailBox.value,
                internalization: internalizationStoryBox.value,
                externalization: externalizationStoryBox.value,
                user_name: nameBox.value,
                conversation_id: conversationId.value
            }

            // Send the user message
            Api.sendUserStory(story);

            // Clear input box for further messages
            emailBox.value = '';
            internalizationStoryBox.value = '';
            Common.fireEvent(emailBox, 'input');
            var notification = document.querySelector(settings.selectors.sendStoryNotification);
            notification.className = '';
        }
    }

    // Handles the submission of input
    function saveDraft() {

        // Submit on enter key, dis-allowing blank messages
        var emailBox = document.querySelector(settings.selectors.emailBox);

        var internalizationStoryBox = document.querySelector(settings.selectors.internalizationStoryBox);

        var externalizationStoryBox = document.querySelector(settings.selectors.externalizationStoryBox);

        var nameBox = document.querySelector(settings.selectors.nameBox);

        var conversationId = document.querySelector(settings.selectors.conversationId);

        // Send the user message
        var story = {
            email: emailBox.value,
            internalization: internalizationStoryBox.value,
            externalization: externalizationStoryBox.value,
            user_name: nameBox.value,
            conversation_id: conversationId.value,
        }

        Api.saveUserStory(story);

        // Clear input box for further messages

        var notification = document.querySelector(settings.selectors.saveDraftNotification);
        notification.className = '';
    }

}());