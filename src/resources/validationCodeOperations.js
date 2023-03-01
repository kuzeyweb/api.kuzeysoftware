import { generateCode } from "../helpers/randomCodeGenerator";
import { prisma } from "../../prisma/client";

export const createValidationCode = async ({ userId, email, type, codeLength }) => {
    await prisma.$connect()

    await prisma.validation_codes.deleteMany({
        where: {
            email: email,
            type: type
        }
    });

    const validationData = await prisma.validation_codes.create({
        data: {
            user_id: userId,
            email: email,
            code: generateCode(codeLength),
            type: type
        }
    });
    await prisma.$disconnect()
    return validationData.code
}

export const checkValidationCode = async ({ email, type, userCode }) => {
    await prisma.$connect()
    const validationData = await prisma.validation_codes.findFirst({
        where: {
            email: email,
            type: type
        }
    });

    if (validationData?.code === userCode) {
        await prisma.validation_codes.deleteMany({
            where: {
                email: email
            }
        });
        await prisma.$disconnect();
        return { error: false, message: true }
    } else return { error: true, message: 'Invalid token' }
}
