import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import { paginate } from "../../helpers/paginate";

async function getPostComments(req, res) {
    const { page, limit } = req.query;
    const { blog_id } = req.params;

    try {
        const count = await prisma.blog_comment.count({
            where: {
                blog_id: Number(blog_id),
                parent_id: null,
                status: "approved"
            },
        });
        const pagination = paginate({ Page: page, Limit: limit, Count: count });

        const comments = await prisma.blog_comment.findMany({
            ...pagination.query,
            where: {
                blog_id: Number(blog_id),
                parent_id: null,
                status: "approved"
            },
            include: {
                blog: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                profile_picture: true
                            }
                        }
                    }
                }
            },
        });

        for (var comment of comments) {
            const replies = await prisma.blog_comment.findMany({
                where: {
                    parent_id: Number(comment.id),
                    status: "approved"
                },
                include: {
                    blog: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    last_name: true,
                                    profile_picture: true
                                }
                            }
                        }
                    }
                },
            });
            comment.replies = replies;
        }

        return respondWithSuccess({ res: res, message: 'Comments listed successfully', payload: { comments: comments }, meta: pagination.meta });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default getPostComments;