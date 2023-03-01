import withProtect from "../../middlewares/withProtect";
import withPermission from "../../middlewares/withPermission";
import { prisma } from "../../../prisma/client";
import slugify from "slugify";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import fs from "fs";

async function updateBlog(req, res) {

    if (req.files?.length > 0) {
        (req.body.thumbnail = `${process.env.CDN_URL}${req.files?.[0]?.filename}`)
    }

    const { id } = req.params;
    const { title, content, slug, status, thumbnail, category_id, video_url } = req.body;

    if (!id)
        return respondWithError({ res: res, message: 'Id parameter can not be empty', httpCode: 401 });

    let slugifiedTitle;
    if (!slug) slugifiedTitle = slugify(title?.toLowerCase());
    else slugifiedTitle = slugify(slug);

    //processing the data
    let data = {};
    if (title) { data.title = title; data.slug = slugify(title?.toLowerCase()) };
    if (content) data.content = content;
    if (status) data.status = status;
    if (thumbnail) data.thumbnail = thumbnail;
    if (category_id) data.category_id = Number(category_id);
    if (video_url) data.video_url = video_url;
    if (slug) data.slug = slugifiedTitle;

    try {
        const currentBlog = await prisma.blog_post.findFirst({
            where: {
                id: Number(id)
            },
        });

        if (currentBlog?.thumbnail) {
            if (currentBlog.thumbnail && thumbnail)
                fs.unlink(`./uploads/${currentBlog.thumbnail.split('/').pop()}`, err => {
                    if (err) {
                        console.error(err);
                    }
                });
        }

        const blog = await prisma.blog_post.update({
            where: {
                id: Number(id)
            },
            data: data
        });

        return respondWithSuccess({ res: res, message: 'Blog updated successfully', payload: { blog: blog } });
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

export default withProtect(withPermission(updateBlog, "blog-update"))
