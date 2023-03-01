import withProtect from "../../middlewares/withProtect";
import withPermission from "../../middlewares/withPermission";
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function updateRole(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    if (!id)
        return respondWithError({ res: res, message: 'Id parameter can not be empty', httpCode: 401 });

    if (Number(id) === 1) {
        return respondWithError({ res: res, message: "You cannot edit super admin role", httpCode: 403 });
    }

    if (!name)
        return respondWithError({ res: res, message: 'Name field can not be empty', httpCode: 401 });

    try {
        const role = await prisma.roles.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name
            }
        });

        return respondWithSuccess({ res: res, message: 'Role updated successfully', payload: { role: role } });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(updateRole, "role-update"))
