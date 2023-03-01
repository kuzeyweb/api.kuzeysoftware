import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import fs from "fs";

async function deleteBlog(req, res) {
    const { id } = req.params;

    try {
        const blog = await prisma.blog_post.delete({
            where: {
                id: Number(id),
            }
        });

        fs.unlink(`./uploads/${blog.thumbnail.split('/').pop()}`, err => {
            if (err) {
                console.error(err);
            }
        });

        const blogs = await prisma.blog_post.findMany({
            include: {
                user: true
            }
        });

        return respondWithSuccess({ res: res, message: 'Blog deleted successfully', payload: { blogs: blogs } });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(deleteBlog, "blog-delete"))