import * as bcrypt from "bcrypt-ts";

export const hashMD5 = (senha: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedSalt = bcrypt.hashSync(senha, salt);
    return hashedSalt;
};
