async function getStats(db)
{
    let model= {};
    let avg_model = await db.getAvgStats()

    if(avg_model && avg_model.length > 0) {
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

async function getStoryModel(conversation_id, db)
{
    let story = await db.getStory(conversation_id)
    if(story.length > 0){
        let model = {
            conversation_id: story[0].conversation_id,
            email: story[0].email,
            transcript: story[0].story,
        }
        return model
    }

    let entry =  await db.getTranscript(conversation_id)
    if(entry) {
        let st = "";
        entry.transcript.forEach(item =>
        {
            let text = item + '\r\n';
            st += text;
        });

        let model = {
            conversation_id: entry.conversation_id,
            email: entry.email,
            transcript: st,
        }
        return model
    } else {
        return null
    }
}

function saveStory(data, db) {
    let entry = {
        conversation_id: data.conversation_id,
        email: data.email,
        story: data.story,
        date: new Date()
    }

    return db.saveStory(entry)
}

module.exports = {

    getStatsModel: getStats,

    getStoryModel: getStoryModel,

    saveStory: saveStory,

}