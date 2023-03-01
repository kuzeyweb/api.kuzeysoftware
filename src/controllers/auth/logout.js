import { prisma } from '../../../prisma/client';
import withProtect from "../../middlewares/withProtect";
import requestIp from 'request-ip';
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse';

async function logout(req, res) {


    const credentials = JSON.parse(req.headers?.['credentials'] ?? null);
    const { id } = req.params;
    try {

        if (req.user.id !== Number(id) || !credentials) {
            return respondWithError({ res: res, message: "Forbidden", httpCode: 403 })
        }

        const userToken = await prisma.user_tokens.findFirst({
            where: {
                user_id: Number(id),
                type: "refresh",
                ip_address: requestIp.getClientIp(req),
                OS: credentials.OS,
                OS_version: credentials.OS_version,
                fingerprint: credentials.fingerprint.toString(),
                browser: credentials.browser,
                browser_version: credentials.browser_version,
                user_agent: credentials.user_agent
            }
        });

        if (userToken)
            await prisma.user_tokens.delete({
                where: {
                    id: userToken?.id,
                },
            });

        return respondWithSuccess({ res: res, message: "You have successfully logged out." })
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 403 })
    }
}

export default withProtect(logout);