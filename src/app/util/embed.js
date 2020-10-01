const fetch = require('node-fetch');

export default async function getReportEmbedToken(token, embedData) {
    const embedTokenUrl = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    const formData = {
        datasets: [
            {
                id: embedData.datasetId,
            },
        ],
        reports: [
            {
                id: embedData.id,
            },
        ],
    };

    // Used node-fetch to call the PowerBI REST API
    const result = await fetch(embedTokenUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
    });
    if (!result.ok) throw result;
    return result.json();
}
