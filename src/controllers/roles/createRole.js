import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function createRole(req, res) {
    const { name } = req.body;

    if (!name)
        return respondWithError({ res: res, message: 'Name field can not be empty', httpCode: 401 });

    try {
        const role = await prisma.roles.create({
            data: {
                name: name,
            }
        });

        return respondWithSuccess({ res: res, message: 'Role created successfully', payload: role });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(createRole, "role-create"))