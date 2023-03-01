import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import { paginate } from "../../helpers/paginate";

async function getBlogs(req, res) {

    const { page, limit, search, category } = req.query;

    const query = { status: 'public' };
    if (search) query.OR = [{ title: { contains: search } }, { content: { contains: search } }]
    if (category) query.category_id = Number(category);

    try {
        const count = await prisma.blog_post.count({ where: { ...query } });
        const pagination = paginate({ Page: page, Limit: limit, Count: count });

        const blogs = await prisma.blog_post.findMany({
            ...pagination.query,
            where: {
                ...query
            },
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        profile_picture: true
                    }
                },
                category: true
            },
        });

        prisma.$disconnect();
        return respondWithSuccess({ res: res, message: 'Blogs listed successfully', payload: { blogs: blogs }, meta: pagination.meta });
    } catch (err) {
        prisma.$disconnect();
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default getBlogs;