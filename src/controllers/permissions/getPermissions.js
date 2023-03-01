import withProtect from "../../middlewares/withProtect";
import withPermission from "../../middlewares/withPermission";
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function getPermissions(req, res) {

    try {
        const permissions = await prisma.permissions.findMany();

        prisma.$disconnect();
        return respondWithSuccess({ res: res, message: "Permissions listed successfully", payload: { permissions: permissions } })
    } catch (err) {
        prisma.$disconnect();
        return respondWithError({ res: res, message: err.message, httpCode: 500 })
    }
}

export default withProtect(withPermission(getPermissions, "permission-read"))