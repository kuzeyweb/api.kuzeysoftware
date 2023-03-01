import { sendContactEmail } from "../../mail/mailOperations";
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function sendMessage(req, res) {

    const { fullname, email, message } = req.body;

    try {
        const contact = await prisma.page_content.findFirst({
            where: {
                page: "contact_info"
            }
        });

        const to = contact.content;

        const response = sendContactEmail({ fullname: fullname, email: email, message: message, to: to });

        prisma.$disconnect();

        if (!response.error)
            return respondWithSuccess({ res: res, message: 'Message sent successfully' });
        else
            return respondWithError({ res: res, message: response.message, httpCode: 500 });

    } catch (err) {
        prisma.$disconnect();
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default sendMessage;