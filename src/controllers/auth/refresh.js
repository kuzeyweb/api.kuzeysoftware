import { prisma } from '../../../prisma/client';
import jwt from "jsonwebtoken";
import requestIp from 'request-ip';
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse';

async function refreshToken(req, res) {

    if (!req.headers['credentials']) {
        return respondWithError({ res: res, message: "Forbidden", httpCode: 403 });
    }

    const credentials = JSON.parse(req.headers['credentials']);

    const { id } = req.params;
    try {
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
            },
            include: {
                user: {
                    include: {
                        roles: {
                            select: {
                                role: {
                                    select: {
                                        name: true,
                                        permissions: {
                                            select: {
                                                permissions: {
                                                    select: { name: true }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        },
                    },
                },
            }
        });
        req.userToken = userToken
        if (!userToken)
            return respondWithError({ res: res, message: 'Invalid or expired token', httpCode: 401 })

        const { user } = userToken;

        const roles = user.roles?.map((roles) => roles.role.name);
        const permissions = user.roles?.map((roles) => roles.role.permissions.map((perm) => perm.permissions.name)).flat(10)
        user.roles = roles; user.permissions = permissions;

        jwt.verify(
            userToken.token,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        let accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                roles: user.roles,
                permissions: user.permissions,
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: 20, }, { algorithm: 'HS256' });

        await prisma.user_tokens.update({
            where: {
                id: req.userToken?.id,
            },
            data: {
                last_use_time: new Date()
            }
        })

        return respondWithSuccess({ res: res, message: "success", payload: { access_token: accessToken } })
    } catch (err) {
        if (req.userToken?.id)
            await prisma.user_tokens.delete({
                where: {
                    id: req.userToken?.id,
                },
            });
        return respondWithError({ res: res, message: "Session expired", httpCode: 403 })
    }
}

export default refreshToken;