# jira-proxy
Proxy Server for Local Jira Development

This tool is used to enable developing Jira API-based tools so that they can run outside of our Confluence environment.

Open a terminal

```
npm install
```

create a `.env` file in the root
generate your Basic Authorization for Atlassian following this guide: [https://developer.atlassian.com/server/jira/platform/basic-authentication/]
put the following info in your `.env` file:
```
API_CREDENTIALS=Basic [your_base_64_encoded_credentials]
LP_APP_ID_QUERY_PARAM=appId
LP_PATH_QUERY_PARAM=path
```

To run the app:
```
npm run start
```