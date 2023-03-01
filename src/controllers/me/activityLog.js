import { prisma } from '../../../prisma/client';
import withProtect from "../../middlewares/withProtect";
import requestIp from 'request-ip';
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse';

async function logout(req, res) {

    if (!req.headers['credentials']) {
        return respondWithError({ res: res, message: "Forbidden", httpCode: 403 });
    }

    const credentials = JSON.parse(req.headers?.['credentials'] ?? null);

    try {
        const userToken = await prisma.user_tokens.findFirst({
            where: {
                user_id: Number(req?.user?.id),
                type: "refresh",
                ip_address: requestIp.getClientIp(req),
                OS: credentials.OS,
                OS_version: credentials.OS_version,
                fingerprint: credentials.fingerprint.toString(),
                browser: credentials.browser,
                browser_version: credentials.browser_version,
                user_agent: credentials.user_agent
            },
            select: {
                id: true,
                OS: true,
                ip_address: true,
                last_use_time: true,
                browser: true,
                isMobile: true
            }
        });

        if (!userToken)
            return respondWithError({ res: res, message: "Unverified session", httpCode: 400 });

        const otherTokens = await prisma.user_tokens.findMany({
            where: {
                user_id: Number(req.user?.id),
                NOT: {
                    id: userToken?.id
                }
            },
            select: {
                id: true,
                OS: true,
                ip_address: true,
                last_use_time: true,
                browser: true,
                isMobile: true
            }
        });

        return respondWithSuccess({ res: res, message: "Logs successfully created.", payload: { activityLog: [{ ...userToken, self: true }, ...otherTokens] } })
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 403 })
    }
}

export default withProtect(logout);