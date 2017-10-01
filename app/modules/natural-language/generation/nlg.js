
var mongo = require('../../db/mongo');


function getInternalProblemStory(array, template, context_nodes){


}

function getExternalProblemStory(array, template){

}

module.exports = {

    GetInternalProblemStory: (array, template, context_nodes) => {
        return getInternalProblemStory(array, template,context_nodes)
    },

    GetExternalProblematicStory: (array, template, context_nodes) => {
        return getExternalProblemStory(array, template, context_nodes)
    }
}