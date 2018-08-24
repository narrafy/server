const client = require('../storage/posgres')

module.exports = {

    getContext: client.getContext,
    pushContext: client.pushContext,
    getContextById: client.getContextById,

    getThreadList: client.getThreadList,
    getThread: client.getThread,

    getConversationCount: function(){
        return client.getConversationCount(3, 1)
    },

    getAvgStats: function(){
        return client.getAvgStats(3,1)
    },
    
    getConversationDataSet: function(){
        return client.getConversationDataSet(3, 1)
    }

}