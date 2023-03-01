import { respondWithError } from "../resources/apiResponse";

const withProtect = (login, permission) => {
    return async (req, res) => {

        if (!req.user.permissions.includes(permission) && !req.user.roles.includes("super_admin")) {
            return respondWithError({ res: res, message: "You do not have permission for this action", httpCode: 403 })
        }
        return login(req, res);
    }
}

export default withProtect;