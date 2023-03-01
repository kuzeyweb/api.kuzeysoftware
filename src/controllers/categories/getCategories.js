import { paginate } from "../../helpers/paginate";
import { prisma } from "../../../prisma/client";
import { respondWithError, respondWithSuccess } from "../../resources/apiResponse";

async function getCategories(req, res) {
    const { page, limit, search } = req.query;

    const query = {};
    if (search) query.OR = [{ name: { contains: search } }]

    try {
        const count = await prisma.categories.count({ where: { ...query } });
        const pagination = paginate({ Page: page, Limit: limit, Count: count });

        const categories = await prisma.categories.findMany({
            ...pagination.query,
            where: {
                ...query
            },
            include: {
                blogs: true
            }
        });

        return respondWithSuccess({ res: res, message: 'Categories listed successfully', payload: { categories: categories }, meta: pagination.meta });
    } catch (err) {
        return respondWithError({ res: res, message: err.message, httpCode: 500 });
    }
}

export default getCategories;