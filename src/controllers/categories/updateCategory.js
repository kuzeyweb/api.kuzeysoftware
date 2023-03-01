import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function updateCategory(req, res) {
    const { name } = req.body;
    const { id } = req.params;

    if (!name)
        return respondWithError({ res: res, message: 'Name field can not be empty', httpCode: 401 });

    try {
        const category = await prisma.categories.update({
            where: {
                id: Number(id),
            },
            data: {
                name: name
            }
        });

        return respondWithSuccess({ res: res, message: 'Category updated successfully', payload: category });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(updateCategory, "category-update"))