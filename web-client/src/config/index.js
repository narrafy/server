export const facebookUrl = "https://www.facebook.com/narrafy"
export const twitterUrl = "https://www.twitter.com/narrafy"
export const mediumUrl = "https://www.medium.com/@narrafy"
export const gaUa= "UA-106329468-1"

export const apiConfig = {
    sendMessageEndPoint : "/api/message",
    contactEndPoint : "/api/contact",
    subscribeEndPoint : "/api/subscribe"
}

export const analyticsConfig = {
    endPoint: "/api/analytics",
    conversation: {
        dataSetEndPoint: "/api/analytics/conversation/dataset",
        avgEndPoint: "/api/analytics/conversation/avg",
        countEndPoint: "/api/analytics/conversation/count",
        plot: {
            question_limit: 40,
            minutes_spent_limit: 40
        }
    }
}