import { sendPasswordResetEmail } from '../../mail/mailOperations';
import { prisma } from '../../../prisma/client';
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse';
import { createValidationCode } from '../../resources/validationCodeOperations';

async function forgotPassword(req, res) {

    const { email, id, first_name } = req.body;

    try {
        const validationCode = await createValidationCode({ userId: id, email: email, type: "password_reset", codeLength: 60 });

        const passwordResetMailStatus = sendPasswordResetEmail({ to: email, name: first_name, code: validationCode });

        if (passwordResetMailStatus?.error) respondWithError({ res: res, message: emailValidationStatus?.message, httpCode: 500 })
        else respondWithSuccess({ res: res, message: "Password reset email has been sent to your address." });
    } catch (err) {
        respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default forgotPassword;