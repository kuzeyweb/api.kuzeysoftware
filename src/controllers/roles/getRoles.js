import withProtect from "../../middlewares/withProtect"
import withPermission from "../../middlewares/withPermission"
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";
import { paginate } from "../../helpers/paginate";

async function getRoles(req, res) {

    const { include, page, limit } = req.query;

    const includeQuery = include?.split(',');

    try {
        const count = await prisma.roles.count();
        const pagination = paginate({ Page: page, Limit: limit, Count: count });

        const roles = await prisma.roles.findMany(includeQuery?.includes("permissions") ? {
            ...pagination.query,
            include: {
                permissions: {
                    select: {
                        permissions: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
        } : {
            ...pagination.query,
        });

        includeQuery?.includes("permissions") &&
            roles.forEach((role) => role.permissions = role.permissions.map((perm) => perm.permissions.name));
        prisma.$disconnect();
        return respondWithSuccess({ res: res, message: 'Roles listed successfully', payload: { roles: roles }, meta: pagination.meta });
    } catch (err) {
        prisma.$disconnect();
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default withProtect(withPermission(getRoles, "role-read"))