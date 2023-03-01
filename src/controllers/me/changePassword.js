import { prisma } from '../../../prisma/client';
import withProtect from "../../middlewares/withProtect";
import { respondWithError, respondWithSuccess } from '../../resources/apiResponse';
import CryptoJS from 'crypto-js'

async function changePassword(req, res) {

    const { password, current_password } = req.body;

    try {

        const user = await prisma.users.findFirst({
            where: {
                id: Number(req?.user?.id),
            },
            select: {
                password: true,
            }
        });

        if (!user)
            return respondWithError({ res: res, message: "User not found", httpCode: 404 });

        // validate password
        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_JS_SECRET_KEY);
        const userPassword = hashedPass.toString(CryptoJS.enc.Utf8);

        if (current_password !== userPassword)
            return respondWithError({ res: res, message: "Password is incorrect", httpCode: 400 });

        const newPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_JS_SECRET_KEY).toString();


        await prisma.users.update({
            where: {
                id: Number(req?.user?.id)
            },
            data: {
                password: newPassword
            }
        });

        await prisma.user_tokens.deleteMany({
            where: {
                user_id: Number(req?.user?.id),
                type: "refresh"
            }
        });

        return respondWithSuccess({ res: res, message: "Password changed successfully." })
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 })
    }
}

export default withProtect(changePassword);