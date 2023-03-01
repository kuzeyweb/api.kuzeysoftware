import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function getContent(req, res) {

    const { page } = req.query;

    if (!page)
        return respondWithError({ res: res, message: "Page query can not be null", httpCode: 401 });

    try {

        const content = await prisma.page_content.findFirst({
            where: {
                page: page
            }
        });

        prisma.$disconnect();
        return respondWithSuccess({ res: res, message: 'Page content successfully fetched', payload: content });
    } catch (err) {
        prisma.$disconnect();
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default getContent;