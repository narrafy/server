/* natural language generation */

var mongo = require('./mongo');

var Story = {
    INTERNAL_PROBLEM: "recap_internal_problem",
    EXTERNAL_PROBLEM: "recap_external_problem"
}

module.exports = {

    Story: ()=> {
        Story
    },

    GetInternalProblemStory: (conversation_id) => {

    },

    GetExternalProblematicStory: () => {

    }
}