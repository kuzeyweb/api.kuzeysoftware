import { respondWithError } from "../resources/apiResponse";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client";

const withProtect = (login) => {
    return async (req, res) => {
        // get token and check if it exists
        const { authorization } = req.headers;
        const accessToken = authorization?.split(' ')[1];

        if (!authorization)
            return respondWithError({ res: res, message: "Please log in to get access", httpCode: 401 });

        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_TOKEN_SECRET
            );
            const currentUser = await prisma.users.findFirst({
                where: {
                    id: decoded.id,
                },
                include: {
                    roles: {
                        select: {
                            role: {
                                select: {
                                    name: true,
                                    permissions: {
                                        select: {
                                            permissions: {
                                                select: { name: true }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    }
                },
            });

            const roles = currentUser.roles?.map((roles) => roles.role.name);
            const permissions = currentUser.roles?.map((roles) => roles.role.permissions.map((perm) => perm.permissions.name)).flat(10)
            const uniquePermissions = [...new Set(permissions)];
            currentUser.roles = roles; currentUser.permissions = uniquePermissions;

            req.user = currentUser;

            if (!currentUser)
                return respondWithError({ res: res, message: "The token belonging to this user no longer exists", httpCode: 404 });

            req.user = currentUser;

            return login(req, res);
        } catch (err) {
            console.error(err)
            return respondWithError({ res: res, message: err.message, httpCode: 401 });
        }
    }
}

export default withProtect;