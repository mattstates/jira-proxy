// tslint:disable-next-line: no-var-requires
require('dotenv').config();
// tslint:disable-next-line: no-var-requires
const cors = require('cors');
import * as express from 'express';
import fetch from 'node-fetch';

// Terrible, since this code is just for dev, I will use it. I don't know why this isn't an issue on Mac.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { API_CREDENTIALS, LP_APP_ID_QUERY_PARAM, LP_PATH_QUERY_PARAM } = process.env;

const app = express();
const port = 3333;

app.use(cors());

/**
 * Description
 * Grab every request the client makes and call the Api directly.
 * Avoids cors for development and works around the Confluence app tunnel.
 */
app.get('*', async (req, res) => {
    const url = Object.entries<string>(req.query)
        .map((queryEntry: [string, string]): string | null => {
            if (queryEntry[0] === LP_APP_ID_QUERY_PARAM) {
                return null;
            }
            return queryEntry.join('=');
        })
        .filter((entry) => Boolean(entry))
        .join('&')
        .replace(`${LP_PATH_QUERY_PARAM}=`, '');

    // TypeScript :any - There seems to be an issue with node-fetch RequestInit interface?
    const requestInit: any = {
        credentials: 'include',
        method: 'GET',
        headers: {
            // API_CREDENTIALS consult Atlassian docs for generating this
            // https://developer.atlassian.com/cloud/jira/platform/jira-rest-api-basic-authentication/
            'Authorization': API_CREDENTIALS,
            'Content-Type': 'application/json',
        },
    };

    try {
        const apiResponse = await fetch(url, requestInit);
        const json = await apiResponse.json();
        return res.send(json);
    } catch (error) {
        return res.send(error.message);
    }
});

app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`Listening on port ${port}`);
});
