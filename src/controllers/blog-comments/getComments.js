import withProtect from "../../middlewares/withProtect"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import withPermission from "../../middlewares/withPermission";
import { paginate } from "../../helpers/paginate";

async function getComments(req, res) {
    const { status, page, limit } = req.query;

    const query = {};
    if (status) query.status = status;

    try {
        const count = await prisma.blog_comment.count({ where: { ...query } });
        const pagination = paginate({ Page: page, Limit: limit, Count: count });

        const comments = await prisma.blog_comment.findMany({
            ...pagination.query,
            where: {
                ...query
            },
            include: {
                blog: true
            },
        });

        return respondWithSuccess({ res: res, message: 'Comments listed successfully', payload: { comments: comments }, meta: pagination.meta });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(getComments, "comment-read"))