import withProtect from "../../middlewares/withProtect";
import withPermission from "../../middlewares/withPermission";
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function assignPermissions(req, res) {

    let { permission_names, role_id, permission_ids } = req.body;

    if (!permission_names || !role_id)
        return respondWithError({ res: res, message: "role_id, permission_names fields are required", httpCode: 403 });

    if (Number(role_id) === 1)
        return respondWithError({ res: res, message: "You cannot assign permissions to super admin role", httpCode: 403 });

    try {
        const permissions = await prisma.permissions.findMany();

        const permNameToId = permissions.filter((perm) => permission_names.includes(perm.name));
        permission_ids = permNameToId.map((perm) => perm.id);
        // if the request has invalid role ids, getting only valid ones to a variable
        const permissionIds = permissions.map((perm) => perm.id);
        const availableReqPermissions = permission_ids?.filter((id) => permissionIds.includes(id)) ?? [];
        const result = availableReqPermissions?.map((perm) => ({ role_id: Number(role_id), permission_id: Number(perm) }));

        await prisma.roles_has_permissions.deleteMany({
            where: {
                OR: result
            }
        })

        await prisma.roles_has_permissions.createMany({
            data: result
        });

        await prisma.roles_has_permissions.deleteMany({
            where: {
                OR: {
                    role_id: role_id
                },
                NOT: result,
            }
        });
        prisma.$disconnect();
        if (!permission_ids.every((val, index) => val === availableReqPermissions[index]))
            return respondWithSuccess({ res: res, message: "The request contains permissions that do not exist. Only valid ones were assigned." })

        return respondWithSuccess({ res: res, message: "Permissions assigned successfully" })
    } catch (err) {
        prisma.$disconnect();
        if (err.meta?.field_name === 'role_id')
            return respondWithError({ res: res, message: "Requested role is not found", httpCode: 404 });
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(assignPermissions, "role-update"))
