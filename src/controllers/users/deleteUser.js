import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        await prisma.users.delete({
            where: {
                id: Number(id),
            }
        });

        return respondWithSuccess({ res: res, message: 'User deleted successfully' });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(deleteUser, "user-delete"))