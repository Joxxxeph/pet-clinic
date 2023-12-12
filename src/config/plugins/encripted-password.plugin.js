import bcrypt from 'bcryptjs'

export const encryptedPassword = async ( password ) => {
    const salt = await bcrypt.genSaltSync(12)
    return await bcrypt.hashSync(password, salt)
}

export const verifyPassword= async (bodyPassword, userPassword) => {
    return await bcrypt.compareSync(bodyPassword, userPassword)
}