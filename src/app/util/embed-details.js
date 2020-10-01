const fetch = require('node-fetch');

export default async function getReportEmbedDetails(
    token,
    workspaceId,
    reportId
) {
    const reportUrl =
        'https://api.powerbi.com/v1.0/myorg/groups/' +
        workspaceId +
        '/reports/' +
        reportId;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + token,
    };

    // Used node-fetch to call the PowerBI REST API
    const result = await fetch(reportUrl, {
        method: 'GET',
        headers,
    });
    console.log(result);
    if (!result.ok) throw result;
    return result.json();
}
