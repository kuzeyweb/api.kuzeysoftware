export const paginate = ({ Page, Limit, Count }) => {
    const count = Count ? Number(Count) : undefined;
    const page = Page && Page > 0 ? Number(Page) : undefined;
    const limit = Limit && Limit > 0 ? Number(Limit) : 10;
    const lastPage = Math.ceil(count / (Limit ? limit : 1));

    const meta = {
        current_page: page ? page : 1,
        last_page: lastPage,
        per_page: Limit ? limit : count,
        total: count
    };

    if (!page && !Limit) {
        return {
            query: { take: count },
            meta: meta
        }
    } else if (!page && limit) {
        return {
            query: {
                take: limit,
            }, meta
        }
    } else if (page && !limit) {
        return {
            query: {
                skip: page !== 1 ? ((page - 1) * limit) : 0,
                take: limit,
            }, meta
        }
    } else if (page && limit) {
        return {
            query: {
                skip: page !== 1 ? ((page - 1) * limit) : 0,
                take: limit,
            }, meta
        }
    }
}
