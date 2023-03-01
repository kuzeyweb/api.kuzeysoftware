import withProtect from '../../middlewares/withProtect';
import { prisma } from '../../../prisma/client';
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse';
import { checkValidationCode } from "../../resources/validationCodeOperations";

async function validateEmail(req, res) {

    const { email, token } = req.body;

    try {
        const validationStatus = await checkValidationCode({ email: email, type: "email_verification", userCode: token })
        if (!validationStatus.error) {
            const user = await prisma.users.update({
                where: {
                    email: email
                },
                data: {
                    status: 'active'
                }
            });
            const { password, last_login, deleted_at, updated_at, ...others } = user;
            respondWithSuccess({ res: res, message: "Validation completed", payload: { user: others } });
        } else {
            respondWithError({ res: res, message: "Invalid token", httpCode: 401 })
        }
    } catch (err) {
        respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(validateEmail)