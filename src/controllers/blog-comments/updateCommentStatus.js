import withProtect from "../../middlewares/withProtect"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import withPermission from "../../middlewares/withPermission";

async function updateCommentStatus(req, res) {
    const { comment_id } = req.params;
    const { status } = req.body;

    if (!comment_id)
        return respondWithError({ res: res, message: 'Comment id field can not be empty', httpCode: 401 });

    try {
        await prisma.blog_comment.update({
            where: {
                id: Number(comment_id),
            },
            data: {
                status: status
            }
        });

        return respondWithSuccess({ res: res, message: 'Comment updated successfully' });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(updateCommentStatus, "comment-update"))