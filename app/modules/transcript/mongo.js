async function getTranscript(conversation_id) {

    return dbConnection.collection(collection.transcript)
        .findOne({conversation_id : conversation_id})
}

async function saveTranscript (conversation_id, email, transcript){
    const data = {
        conversation_id: conversation_id,
        email: email,
        transcript: transcript,
        date: new Date()
    }
    await dbConnection
        .collection(collection.transcript)
        .replaceOne({ conversation_id: data.conversation_id }, data , { upsert: true })
        .then(() => data)
}