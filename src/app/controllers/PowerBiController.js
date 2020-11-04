import Auth from '../util/auth-powerbi';
import AuthNew from '../util/auth-new-powerbi';
import getReportEmbedToken from '../util/embed';
import getReportEmbedDetails from '../util/embed-details';

const fetch = require('node-fetch');

class PowerBiController {
    async getEmbed(req, res) {
        const tokenResponse = await Auth.getAuthenticationToken();
        const workspaceId = process.env.PBI_WORKSPACE_ID;
        const reportId = process.env.PBI_REPORT_ID;
        let embedData = null;

        // Call the function to get the Report Embed details
        try {
            const token = tokenResponse.accessToken;
            embedData = await getReportEmbedDetails(
                token,
                workspaceId,
                reportId
            );

            const embedToken = await getReportEmbedToken(token, embedData);

            return res.json({
                accessToken: embedToken.token,
                embedUrl: embedData.embedUrl,
                expiry: embedToken.expiration,
                status: 200,
            });
        } catch (err) {
            console.log(err);
            return {
                status: err.status,
            };
        }
    }

    async suspend(req, res) {
        const tokenResponse = await AuthNew.getAuthenticationToken();

        console.log(tokenResponse);

        const reportUrl =
            'https://management.azure.com/subscriptions/58c1e6fd-4dcd-4da5-91a1-162d375cb7f2/resourceGroups/pbi-embedded/providers/Microsoft.PowerBIDedicated/capacities/fabrikasim/suspend?api-version=2017-10-01';
        const headers = {
            Authorization: 'Bearer ' + tokenResponse.accessToken,
        };

        // Used node-fetch to call the PowerBI REST API
        try {
            const result = await fetch(reportUrl, {
                method: 'POST',
                headers,
            });
            return res.json(result);
        } catch (error) {
            return res.json(error);
        }
    }
}

export default new PowerBiController();
