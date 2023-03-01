import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function getBlogs(req, res) {

    const { slug } = req.params;

    try {
        const blog = await prisma.blog_post.findFirst({
            where: {
                slug: slug
            },
            include: {
                blog_comment: {
                    where: {
                        status: "approved"
                    }
                },
                category: true,
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        profile_picture: true
                    }
                }
            },
        });

        await prisma.blog_post.update({
            where: {
                id: blog.id
            },
            data: {
                view_count: blog.view_count + 1
            }
        })

        prisma.$disconnect();
        return respondWithSuccess({ res: res, message: 'Blog listed successfully', payload: { blog: blog } });
    } catch (err) {
        prisma.$disconnect();
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default getBlogs;