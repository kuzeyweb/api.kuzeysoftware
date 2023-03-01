import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import fs from 'fs';

async function updateContent(req, res) {

    if (req.files?.length > 0) {
        (req.body.image = `${process.env.CDN_URL}${req.files?.[0]?.filename}`)
    }

    const { page, image, content } = req.body;

    if (!page)
        return respondWithError({ res: res, message: "Page field can not be null", httpCode: 401 });

    //processing the data
    let data = {};
    if (image) data.image = image;
    if (content) data.content = content;

    try {
        const currentContent = await prisma.page_content.findFirst({
            where: {
                page: page
            }
        });

        if (currentContent?.image) {
            if (image)
                for (var img of currentContent.image) {
                    fs.unlink(`./uploads/${img.split('/')?.pop()}`, err => {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
        }

        const content = await prisma.page_content.update({
            where: {
                id: Number(currentContent.id),
            },
            data: {
                ...data
            }
        });

        prisma.$disconnect();
        return respondWithSuccess({ res: res, message: 'Page content updated successfully', payload: { content: content } });
    } catch (err) {
        if (req.files?.image)
            fs.unlink(`./uploads/${req.files?.image[0]?.filename}`, err => {
                if (err) {
                    console.error(err);
                }
            });
        prisma.$disconnect();
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(updateContent, "content-update"))