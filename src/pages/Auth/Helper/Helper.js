/**
 * Giải mã token
 * @param {string} token 
 * @returns {object|null}
 */
export const decodeToken = (token) => {
    if (token) {
        try {
            // Giải mã Base64
            const decodedString = atob(token);
            // Parse thành object
            const userData = JSON.parse(decodedString);
            return userData;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    } else {
        console.warn("No token found");
    }
};

/**
 * Lay token tu cookie
 * @param {string} cookieName
 * @returns {string|null}
 */
export const getTokenFromCookie = (cookieName) => {
    if (!document.cookie) {
        return null; // No cookies available
    }

    // Parse cookies into an object
    const cookies = document.cookie.split('; ').reduce((acc, current) => {
        const [name, value] = current.split('=');
        acc[name] = value;
        return acc;
    }, {});

    // Return the token if it exists, otherwise null
    return cookies[cookieName] || null;
};