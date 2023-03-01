import CryptoJS from 'crypto-js'
import { sendTwoFactorAuthMail } from '../../mail/mailOperations';
import { prisma } from '../../../prisma/client';
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse';
import { createAuthTokens } from '../../resources/tokenOperations';
import { checkValidationCode, createValidationCode } from '../../resources/validationCodeOperations';

async function Login(req, res) {

    await prisma.$connect()
    const { email, password } = req.body;

    if (!req.headers['credentials']) {
        return respondWithError({ res: res, message: "Forbidden", httpCode: 403 });
    }
    const credentials = JSON.parse(req.headers['credentials']);

    if (!email || !password)
        return respondWithError({ res: res, message: "Email and password fields are required", httpCode: 400 });

    try {
        const user = await prisma.users.findFirst({
            where: {
                email: email,
            },
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
                }
            },
        });

        if (!user) return respondWithError({ res: res, message: "User not found", httpCode: 400 });

        if (user.status === "suspended") return respondWithError({ res: res, message: "Your account has been suspended", httpCode: 400 });

        const roles = user.roles?.map((roles) => roles.role.name);
        const permissions = user.roles?.map((roles) => roles.role.permissions.map((perm) => perm.permissions.name)).flat(10);
        const uniquePermissions = [...new Set(permissions)];
        user.roles = roles; user.permissions = uniquePermissions;

        // validate password
        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_JS_SECRET_KEY);
        const userPassword = hashedPass.toString(CryptoJS.enc.Utf8);

        if (password !== userPassword)
            return respondWithError({ res: res, message: "Invalid email or password", httpCode: 400 });

        // validate account status
        if (user.status !== "active")
            return respondWithError({ res: res, message: "Verify your email adress to login", httpCode: 401 });

        var twoFactorAuthSetting = await prisma.settings.findFirst({
            where: {
                name: "two_factor_auth"
            }
        });

        // if 2fa is on
        if (twoFactorAuthSetting?.value) {
            if (req.body.token) {
                // if req has a token -> validate 2fa code and complete login
                const validationStatus = await checkValidationCode({ email: user.email, type: "two_factor_auth", userCode: req.body.token });
                if (!validationStatus.error) {
                    await prisma.users.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            last_login: new Date()
                        }
                    })
                    const { password, last_login, deleted_at, updated_at, ...others } = user;

                    respondWithSuccess({ res: res, message: "User successfully logged in", payload: { user: others } });
                } else respondWithError({ res: res, message: "Invalid token", httpCode: 401 });
            } else {
                // if req has no token -> create a token and send it thru an email to user
                const validationCode = await createValidationCode({ userId: user.id, email: user.email, type: "two_factor_auth", codeLength: 6 });

                const twoFactorMailStatus = sendTwoFactorAuthMail({ to: user.email, name: user.first_name, code: validationCode });

                if (twoFactorMailStatus?.error) respondWithError({ res: res, message: emailValidationStatus?.message, httpCode: 500 })
                else return respondWithSuccess({ res: res, message: "Credentials matched, verification code sent" });
            }
        } else {
            // if 2fa is off just complete login
            await prisma.users.update({
                where: {
                    id: user.id
                },
                data: {
                    last_login: new Date()
                }
            })
            const { password, last_login, deleted_at, updated_at, ...others } = user;
            const tokens = await createAuthTokens({ user: user, req: req, credentials: credentials });

            return respondWithSuccess({ res: res, message: "You have successfully logged in", payload: { user: { ...others, tokens } } });
        }
    } catch (err) {
        console.error
        return respondWithError({ res: res, message: err.message, httpCode: 500 })
    }
    await prisma.$disconnect()
}

export default Login;