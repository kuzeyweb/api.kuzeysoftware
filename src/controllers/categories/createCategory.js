import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function createCategory(req, res) {
    const { name } = req.body;

    if (!name)
        return respondWithError({ res: res, message: 'Name field can not be empty', httpCode: 401 });

    try {
        const category = await prisma.categories.create({
            data: {
                name: name,
            }
        });

        return respondWithSuccess({ res: res, message: 'Category created successfully', payload: category });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(createCategory, "category-create"))