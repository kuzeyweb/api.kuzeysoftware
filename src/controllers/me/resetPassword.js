import { prisma } from '../../../prisma/client';
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse';
import { checkValidationCode } from '../../resources/validationCodeOperations';
import CryptoJS from 'crypto-js'

async function resetPassword(req, res) {

    const { token, email, password } = req.body;

    try {
        const validationStatus = await checkValidationCode({ email: email, type: "password_reset", userCode: token });

        if (validationStatus.error) {
            return respondWithError({ res: res, message: "Invalid token", httpCode: 401 });
        }

        const hashedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_JS_SECRET_KEY).toString();

        await prisma.users.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword
            }
        });

        respondWithSuccess({ res: res, message: "You have successfully changed your password." });
    } catch (err) {
        respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default resetPassword;