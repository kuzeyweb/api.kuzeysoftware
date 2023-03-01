import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import slugify from "slugify";
import fs from "fs";

async function createBlog(req, res) {
    if (req.files.length > 0) {
        (req.body.thumbnail = `${process.env.CDN_URL}${req.files?.[0]?.filename}`)
    }

    const { title, slug, content, status, thumbnail, category_id, video_url } = req.body;

    if (!title)
        return respondWithError({ res: res, message: 'Title field can not be empty', httpCode: 401 });

    let slugifiedTitle;
    if (!slug) slugifiedTitle = slugify(title?.toLowerCase());
    else slugifiedTitle = slugify(slug);

    try {
        const blog = await prisma.blog_post.create({
            data: {
                title: title,
                slug: slugifiedTitle,
                content: content,
                status: status,
                thumbnail: thumbnail,
                video_url: video_url,
                category_id: Number(category_id),
                user_id: req.user.id,
                view_count: 0
            }
        });

        return respondWithSuccess({ res: res, message: 'Blog created successfully', payload: { blog: blog } });
    } catch (err) {
        if (req.files.thumbnail)
            fs.unlink(`./uploads/${req.files.thumbnail[0]?.filename}`, err => {
                if (err) {
                    console.error(err);
                }
            });
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(createBlog, "blog-create"))