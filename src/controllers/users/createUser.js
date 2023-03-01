import CryptoJS from 'crypto-js'
import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import fs from "fs";

async function createUser(req, res) {

    if (req.files?.length > 0) {
        (req.body.profile_picture = `${process.env.CDN_URL}${req.files?.[0]?.filename}`)
    }

    const { first_name, last_name, password, email, status, profile_picture } = req.body;

    try {

        const hashedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_JS_SECRET_KEY).toString();

        const user = await prisma.users.create({
            data: {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: hashedPassword,
                status: status,
                profile_picture: profile_picture
            }
        });

        prisma.$disconnect();
        return respondWithSuccess({ res: res, message: 'User created successfully', payload: { user } });
    } catch (err) {
        if (req.files.profile_picture)
            fs.unlink(`./uploads/${req.files.profile_picture[0]?.filename}`, err => {
                if (err) {
                    console.error(err);
                }
            });
        prisma.$disconnect();
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(createUser, "user-create"));