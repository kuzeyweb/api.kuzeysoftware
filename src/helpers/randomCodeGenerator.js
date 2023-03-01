export const generateCode = (length) => {

    const givenSet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for(let i = 0; i < length; i++) {
    let pos = Math.floor(Math.random()*givenSet.length);
    code += givenSet[pos];
    };
    return code;

};