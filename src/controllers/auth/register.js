import CryptoJS from 'crypto-js'
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse.js';
import { registerValidation } from '../../validations/registerValidation.js';
import { sendEmailValidationMail } from '../../mail/mailOperations.js';
import { createValidationCode } from '../../resources/validationCodeOperations.js';
import { prisma } from '../../../prisma/client.js';

export default async function Register(req, res) {
    await prisma.$connect()

    // form validation
    var isFormValidated = registerValidation(req.body);
    if (isFormValidated.error) {
        respondWithError({ res: res, message: isFormValidated.message, httpCode: 422 });
        return;
    };

    // get user data and hash password
    const { first_name, last_name, email, password } = req.body;

    const checkEmail = await prisma.users.findFirst({
        where: {
            email: email
        }
    });

    if (checkEmail) {
        respondWithError({ res: res, message: "This email address is already taken", httpCode: 401 });
        return
    }

    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_JS_SECRET_KEY).toString();

    const userData = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        status: "email_validation_pending"
    }
    // check email validation setting from database

    var validationSetting = await prisma.settings.findFirst({
        where: {
            name: "email_validation"
        }
    });

    try {
        // handle user creating process according to validation setting
        if (validationSetting) {

            const newUser = await prisma.users.create({
                data: {
                    ...userData
                }
            });

            const validationCode = await createValidationCode({ userId: newUser.id, email: newUser.email, type: "email_verification", codeLength: 64 });

            const emailValidationStatus = sendEmailValidationMail({ to: newUser.email, name: newUser.first_name, code: validationCode });

            if (emailValidationStatus?.error) respondWithError({ res: res, message: emailValidationStatus?.message, httpCode: 500 })
            else respondWithSuccess({ res: res, message: "User created successfully", payload: newUser });

        } else {
            const newUser = await prisma.users.create({
                data: {
                    ...userData, status: "active"
                }
            });
            const { password, last_login, deleted_at, updated_at, ...others } = newUser;
            respondWithSuccess({ res: res, message: "User created successfully", payload: { user: others } })
        }
        await prisma.$disconnect()
    } catch (err) {
        respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}