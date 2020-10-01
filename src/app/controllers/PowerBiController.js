import Auth from '../util/auth-powerbi';
import getReportEmbedToken from '../util/embed';
import getReportEmbedDetails from '../util/embed-details';

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
}

export default new PowerBiController();
