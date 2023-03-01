import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function deleteCategory(req, res) {
    const { id } = req.params;

    try {
        const category = await prisma.categories.delete({
            where: {
                id: Number(id),
            }
        });

        return respondWithSuccess({ res: res, message: 'Category removed successfully', payload: category });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(deleteCategory, "category-delete"))