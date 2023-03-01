import { prisma } from "../../prisma/client";
import { respondWithError } from "../resources/apiResponse";

export const checkEmail = async (req, res, next) => {
    try {
        const user = await prisma.users.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            req.body.id = user.id;
            req.body.first_name = user.first_name;
            req.body.emailValidation = true;
            next();
        }
        else {
            req.body.emailValidation = false;
            return respondWithError({ res: res, message: "User not found", httpCode: 400 });
        }
    } catch (err) {
        return console.log(err);
    }
}
