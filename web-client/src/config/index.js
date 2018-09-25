export const facebookUrl = "https://www.facebook.com/narrafy"
export const twitterUrl = "https://www.twitter.com/narrafy"
export const mediumUrl = "https://www.medium.com/@narrafy"
export const youtubeUrl = "https://www.youtube.com/embed/2D-6AHNu9wM"

export const gaUa= "UA-106329468-1"

export const apiConfig = {
    contactEndPoint : "/api/user/contact",
    subscribeEndPoint : "/api/user/subscribe",
    customerLoginEndPoint: "/api/customer/login"
}

export const conversation = {
        analytics: {
            dataSetEndPoint: "/api/conversation/analytics/dataset",
            avgEndPoint: "/api/conversation/analytics/avg",
            countEndPoint: "/api/conversation/analytics/count"
        },
        customer_id: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lciI6eyJlbWFpbCI6ImRyb25pY0BuYXJyYWZ5LmlvIiwid29ya3NwYWNlIjoiZTAwZmJjMTAtOWU0Yy00NWNhLWIwMTgtOGQ0ZjA3ZjQwNTllIiwiYWNjZXNzX3Rva2VuIjoiRUFBUFM3bFB4R1A0QkFFdDhZU0NSNEUxUlBNM0ZoeHR3ZGx1d016eDFPbkRZODd2cHRpWkJaQk8xa3VpOWhkWkNHNnJDTThDbzVpVXNuWkNCYWRTOUltS3BpNlU3WDBNbm4xRnVJRUdUckViVU5aQXJoeGFjdlZHWkIxalVhdTQ4dWh5SWNjNFI2ZkVjZTFaQXJTZVpCS0xxYzg5bTJaQnJrMThneTB6TU5RNVhDR0FaRFpEIn0sImlhdCI6MTUzNDY0NzIzOCwiZXhwIjoxNTM1NTExMjM4fQ.CNOyzqzLsBJ8v1fB2-tSzws_UJHLXtWVEAhe2W7WgFs",
        sendMessageEndPoint : "/api/conversation/message",
        threadListEndPoint : "/api/conversation/thread/list",
        threadEndPoint: "/api/conversation/thread/",
        plot: {
            question_limit: 40,
            minutes_spent_limit: 40
        }
}
