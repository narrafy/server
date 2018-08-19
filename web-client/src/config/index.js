export const facebookUrl = "https://www.facebook.com/narrafy"
export const twitterUrl = "https://www.twitter.com/narrafy"
export const mediumUrl = "https://www.medium.com/@narrafy"
export const gaUa= "UA-106329468-1"

export const apiConfig = {
    contactEndPoint : "/api/user/contact",
    subscribeEndPoint : "/api/user/subscribe"
}

export const conversationConfig = {
    conversation: {
        sendMessageEndPoint : "/api/conversation/message",
        dataSetEndPoint: "/api/conversation/analytics/dataset",
        avgEndPoint: "/api/conversation/analytics/avg",
        countEndPoint: "/api/conversation/analytics/count",
        plot: {
            question_limit: 40,
            minutes_spent_limit: 40
        }
    }
}