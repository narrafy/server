
async function saveStory(data) {
    return dbConnection
        .collection(collection.stories)
        .replaceOne({ conversation_id: data.conversation_id }, data , { upsert: true })
        .then(() => data)
}

async function getStory(conversation_id) {
    return dbConnection.collection(collection.stories)
        .find({conversation_id: conversation_id})
        .sort({date: -1}) //.sort({"date":-1})
        .limit(1)
        .toArray()
}

async function getStoryTemplates() {
    return dbConnection.collection(collection.template_stories)
        .find()
        .sort({$natural: 1})
        .toArray()
}