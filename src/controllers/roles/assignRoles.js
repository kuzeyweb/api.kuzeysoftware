import withProtect from "../../middlewares/withProtect";
import withPermission from "../../middlewares/withPermission";
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function assignRoles(req, res) {

    let { role_names, user_id, role_ids } = req.body;

    try {
        const roles = await prisma.roles.findMany();

        const roleNameToId = roles.filter((role) => role_names.includes(role.name));
        role_ids = roleNameToId.map((role) => role.id);

        // if the request has invalid role ids, getting only valid ones to a variable
        const roleIds = roles.map((rl) => rl.id);
        const availableReqRoles = role_ids?.filter((id) => roleIds.includes(id)) ?? [];
        const result = availableReqRoles.map((rl) => ({ user_id: Number(user_id), role_id: Number(rl) }));

        await prisma.user_has_roles.deleteMany({
            where: {
                OR: result
            }
        })

        await prisma.user_has_roles.createMany({
            data: result
        });

        await prisma.user_has_roles.deleteMany({
            where: {
                OR: {
                    user_id: user_id
                },
                NOT: result,
            }
        });
        prisma.$disconnect();
        if (!role_ids.every((val, index) => val === availableReqRoles[index]))
            return respondWithSuccess({ res: res, message: "The request contains roles that do not exist. Only valid ones were assigned." })

        return respondWithSuccess({ res: res, message: "Roles assigned successfully" })
    } catch (err) {
        prisma.$disconnect();
        if (err.meta?.field_name === 'user_id')
            return respondWithError({ res: res, message: "Requested user is not found", httpCode: 404 });
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(assignRoles, "role-update"))
