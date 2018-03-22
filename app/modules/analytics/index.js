
const db = require('../db')


async function getStats()
{
    let model= {};
    let avg_model = await db.getAvgStats()

    if(avg_model && avg_model.length>0){
        model.avg_minutes = Number((avg_model[0].minutes).toFixed(2));
        model.avg_counter = Number((avg_model[0].counter).toFixed(2));
    }

    let total_count = await db.getConversationCount()
    if(total_count && total_count.length > 0){
        model.total_count = total_count[0].total_doc
    }
    model.dataset = [];

    let dataset = await db.getConversationDataSet()
    dataset.forEach(item =>
    {
        model.dataset.push({counter: item.counter,minutes: Number((item.minutes).toFixed(2))});
    })

    return model
}


module.exports = {

    getStatsModel: getStats
}