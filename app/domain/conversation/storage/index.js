const client = require('../storage/posgres')

module.exports = {

    getContext: client.getContext,
    pushContext: client.pushContext,
    getContextById: client.getContextById,

    getThreadList: client.getThreadList,
    getThread: client.getThread,

    getConversationCount: function(){
        return client.getConversationCount(2, 0)
    },

    getAvgStats: function(){
        return client.getAvgStats(2,0)
    },
    
    getConversationDataSet: function(){
        return client.getConversationDataSet(2, 0)
    }

}