import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function deleteComment(req, res) {
    const { comment_id } = req.params;

    if (!comment_id)
        return respondWithError({ res: res, message: 'Comment id field can not be empty', httpCode: 401 });

    try {

        await prisma.blog_comment.delete({
            where: {
                id: Number(comment_id),
            }
        });

        return respondWithSuccess({ res: res, message: 'Comment deleted successfully' });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(deleteComment, "comment-delete"))