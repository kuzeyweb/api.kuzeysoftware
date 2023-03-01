import CryptoJS from 'crypto-js'
import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import fs from "fs";

async function updateUser(req, res) {

    if (req.files?.length > 0) {
        (req.body.profile_picture = `${process.env.CDN_URL}${req.files?.[0]?.filename}`)
    }

    const { first_name, last_name, password, email, status, profile_picture } = req.body;
    const { id } = req.params;

    try {

        //processing the data
        let data = {};
        if (first_name) data.first_name = first_name;
        if (last_name) data.last_name = last_name;
        if (email) data.email = email;
        if (status) data.status = status;
        if (profile_picture) data.profile_picture = profile_picture;
        if (password) {
            const hashedPassword = CryptoJS.AES.encrypt(password, process.env.CRYPTO_JS_SECRET_KEY).toString();
            data.password = hashedPassword;
        }

        const currentUser = await prisma.users.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (currentUser?.profile_picture) {
            if (currentUser.profile_picture && profile_picture)
                fs.unlink(`./uploads/${currentUser.profile_picture?.split('/').pop()}`, err => {
                    if (err) {
                        console.error(err);
                    }
                });
        }

        const user = await prisma.users.update({
            where: {
                id: Number(id)
            },
            data: { ...data }
        });

        prisma.$disconnect();
        return respondWithSuccess({ res: res, message: 'User updated successfully', payload: { user } });
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

export default withProtect(withPermission(updateUser, "user-update"));