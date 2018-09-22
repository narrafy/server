export const dashboardUrl = "/dashboard"
export const loginUrl = "/login"

export const isEmailValid = (email) => {
        return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
}
// Handle HTTP errors since fetch won't.
export const handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
}

export function removeToken(tokenKey){
        // Clear user token and profile data from localStorage
        localStorage.removeItem(tokenKey);
    }

export function setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem(tokenKey, idToken)
}

export function getProfile(token){
    if(token!==null && isValidToken(token)){
        return decode(token)
    } else {
        return null
    }
}

function decode(token){
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
}

export function getPayload(token) {
    try{
        // Using jwt-decode npm package to decode the token
        return token.payload
    } catch (e) {
        console.log(e.stack)
    } finally {
        return null
    }
}

export const isValidToken = (token) => {
        // Checks if there is a saved token and it's still valid
        return !!token && !isTokenExpired(token) // handwaiving here
}

 export const isTokenExpired = (token) => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }
    
export const tokenKey = "user"

export const getToken = () => {
    return localStorage.getItem(tokenKey)
}
