export const sendMessageEndPoint = "/api/message"
export const contactEndPoint = "/api/contact"
export const subscribeEndPoint = "/api/subscribe"
export const facebookUrl = "https://www.facebook.com/narrafy"
export const twitterUrl = "https://www.twitter.com/narrafy"
export const mediumUrl = "https://www.medium.com/narrafy"

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