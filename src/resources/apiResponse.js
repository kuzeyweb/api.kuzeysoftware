export function respondWithSuccess({ res, message, payload, meta }) {
    const response = {
        message: message ?? "",
        error: false,
        payload: payload ?? [],
    };
    meta && (response.meta = meta);
    res.status(200).send(response);
};

export function respondWithError({ res, message, httpCode }) {
    res.status(httpCode).send({
        message: message ?? "",
        error: true,
        payload: []
    });
};