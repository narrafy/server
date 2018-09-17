
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