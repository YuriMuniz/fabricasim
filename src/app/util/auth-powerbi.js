import adal from 'adal-node';

const getAuthenticationToken = async function () {
    // Use ADAL.js for authentication

    const { AuthenticationContext } = adal;

    // Create a config variable that store credentials from config.json

    const authorityUrl = process.env.PBI_AUTHORITY_URL;

    const scope = process.env.PBI_SCOPE;
    const username = process.env.PBI_USERNAME;
    const password = process.env.PBI_PASSWORD;
    const clientId = process.env.PBI_CLIENT_ID;
    const context = new AuthenticationContext(authorityUrl);

    return new Promise((resolve, reject) => {
        context.acquireTokenWithUsernamePassword(
            scope,
            username,
            password,
            clientId,
            function (err, tokenResponse) {
                // Function returns error object in tokenResponse
                // Invalid Username will return empty tokenResponse, thus err is used
                if (err) {
                    reject(tokenResponse == null ? err : tokenResponse);
                }
                resolve(tokenResponse);
            }
        );
    });
};

module.exports.getAuthenticationToken = getAuthenticationToken;
