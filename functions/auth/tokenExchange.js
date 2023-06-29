const { google } = require('googleapis')
const { google_cloud_credentials } = require('../credentials1.json')

// Returns object with properties { access_token, refresh_token, expiry_date, scope, id_token }
async function exchangeAuthCodeForAccessAndRefresh(authCode) {
    const client = new google.auth.OAuth2(
        google_cloud_credentials.web.client_id,
        google_cloud_credentials.web.client_secret,
        "postmessage" // Thank you https://stackoverflow.com/a/18990247
    )


    let { tokens } = await client.getToken(authCode)

    // let { access_token, refresh_token, expiry_date, scope, id_token } = tokens

    return tokens
}

module.exports = {
    exchangeAuthCodeForAccessAndRefresh
}
