import Auth from '../util/auth-powerbi';
import AuthNew from '../util/auth-new-powerbi';
import getReportEmbedToken from '../util/embed';
import getReportEmbedDetails from '../util/embed-details';

const fetch = require('node-fetch');

class PowerBiController {
    async getEmbed(req, res) {
        const tokenResponse = await Auth.getAuthenticationToken();
        const workspaceId = process.env.PBI_NEW_WORKSPACE_ID;
        const reportId = process.env.PBI_NEW_REPORT_ID;
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

        const reportUrl =
            'https://management.azure.com/subscriptions/f0e3c6a3-9e93-4410-9764-600fba68b7a1/resourceGroups/powerbiresourcegroup/providers/Microsoft.PowerBIDedicated/capacities/fabricasimpowerbi/resume?api-version=2017-10-01';
        const headers = {
            Authorization: 'Bearer ' + tokenResponse.accessToken,
        };

        try {
            console.log(tokenResponse.accessToken);
            const result = await fetch(reportUrl, {
                method: 'POST',
                headers,
            });
            return res.json(result);
        } catch (error) {
            return res.status(401).json(error);
        }
    }
}

export default new PowerBiController();
