import { prisma } from '../../prisma/client';
import jwt from "jsonwebtoken";
import requestIp from 'request-ip';

export const createAuthTokens = async ({ req, user, credentials }) => {
    await prisma.$connect();

    var accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            roles: user.roles,
            permissions: user.permissions,
            application: user.application.id,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: 20, }, { algorithm: 'HS256' });

    const activeToken = await prisma.user_tokens.findFirst({
        where: {
            user_id: user.id,
            type: "refresh",
            ip_address: requestIp.getClientIp(req),
            OS: credentials.OS,
            OS_version: credentials.OS_version,
            isMobile: credentials.isMobile,
            fingerprint: credentials.fingerprint.toString(),
            browser: credentials.browser,
            browser_version: credentials.browser_version,
            user_agent: credentials.user_agent
        }
    });

    const createRefreshToken = async () => {
        try {
            var date = new Date();
            var oneMonthFromNow = new Date(date.setMonth(date.getMonth() + 1))

            var refreshToken = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                process.env.JWT_REFRESH_TOKEN_SECRET,
                { expiresIn: "30 days" },
                { algorithm: 'HS256' });

            await prisma.user_tokens.create({
                data: {
                    user_id: user.id,
                    type: "refresh",
                    token: refreshToken,
                    expires_at: oneMonthFromNow,
                    last_use_time: new Date(),
                    ip_address: requestIp.getClientIp(req),
                    OS: credentials.OS,
                    OS_version: credentials.OS_version,
                    isMobile: credentials.isMobile,
                    fingerprint: credentials.fingerprint.toString(),
                    browser: credentials.browser,
                    browser_version: credentials.browser_version,
                    user_agent: credentials.user_agent
                }
            });
            return refreshToken;
        } catch (err) {
            console.log(err)
            return undefined;
        }
    }

    if (activeToken) {
        try {
            jwt.verify(activeToken.token, process.env.JWT_REFRESH_TOKEN_SECRET);
            return { accessToken: accessToken, refreshToken: activeToken.token };
        } catch (err) {
            const refreshToken = await createRefreshToken();
            return { accessToken: accessToken, refreshToken: refreshToken };
        }
    } else {
        const refreshToken = await createRefreshToken();
        return { accessToken: accessToken, refreshToken: refreshToken };
    }
};