import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function createComment(req, res) {
    const { comment, parent_id, full_name, email } = req.body;
    const { blog_id } = req.params;

    if (!comment)
        return respondWithError({ res: res, message: 'Comment field can not be empty', httpCode: 401 });

    if (comment.length > 500)
        return respondWithError({ res: res, message: 'Comment can not be longer than 500 characters', httpCode: 401 });

    const data = {
        comment: comment,
        blog_id: Number(blog_id),
        status: "pending",
        full_name: full_name,
        email: email
    };

    if (parent_id) data.parent_id = parent_id;

    try {
        const comment = await prisma.blog_comment.create({
            data: { ...data }
        });

        return respondWithSuccess({ res: res, message: 'Comment sent successfully', payload: comment });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default createComment;