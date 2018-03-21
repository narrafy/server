db.getCollection('conversations').aggregate(
    [
        {
            "$match": { "id": null }
        },
        {
            $group :
                {
                    _id : "$conversation_id",
                    conversations: { $push: "$$ROOT" }
                }
        },
        {$unwind: "$conversations"},
        {$group: {
            _id: "$_id",
            firstItem: { $first: "$conversations"},
            lastItem: { $last: "$conversations"},
            countItem: { "$sum": 1 }
        }},

        { "$project": {

            "minutes": {
                "$divide": [{ "$subtract": [ "$lastItem.date", "$firstItem.date" ] }, 1000*60]
            },
            "counter": "$lastItem.context.system.dialog_request_counter"
        },

        }
    ]
)