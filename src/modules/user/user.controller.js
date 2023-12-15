import { AppError } from '../../common/errors/appError.js';
import { catchAsync } from '../../common/errors/catchAsync.js';
import { encryptedPassword, verifyPassword } from '../../config/plugins/encripted-password.plugin.js';
import { generateJWT } from '../../config/plugins/generate-jwt.plugin.js';
import { User } from './user.model.js';
import { validateLogin, validatePartialUser, validateUser } from './user.schema.js';
import { UserService } from './user.service.js';


export const register = catchAsync( async (req, res, next) => {
    const { hasError, errorMessages, userData } = validateUser(req.body);

    if (hasError) {
      return res.status(422).json({
        status: 'error',
        message: errorMessages,
      });
    }

    const user = await UserService.create(userData);
    const token = await generateJWT(user.id)
    
    return res.status(201).json({
      token,
      user : {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        photo: user.photo,
      }
    });
});

export const login = catchAsync( async (req, res, next) => {
  //1. traer los datos de la req.body y validar
  const { hasError, errorMessages, userData } = validateLogin(req.body)

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: 'error de validacion', 
      errorMessages,
    });
  }

  //2.validar que el usuario exista en la base de datos
  const user = await UserService.findOneByEmail(userData.email)

  if(!user){
    return next(new AppError('This account does not exist', 404))
  }

  //3. comparar y comprobar contraseña

  const isCorrectPasword = await verifyPassword(userData.password, user.password)

  if(!isCorrectPasword) {
    return next(new AppError('Incorrect email or password', 401))
  }

  //4. generar el jwt

  const token = await generateJWT(user.id)

  //5. enviar la respuesta al cliente
  
  return res.status(200).json({
    token,
      user : {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        photo: user.photo,
      }
    })

});

export const findAllUser = catchAsync( async (req, res) => {
    const users = await UserService.findAll();

    return res.status(200).json(users);
});

export const findOneUser = catchAsync( async (req, res) => {

    const { user } = req

    return res.status(200).json({
      user : {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        photo: user.photo,
      }
    })
 
});

export const updateUser = catchAsync( async (req, res) => {

    const { user } = req
    const { hasError, errorMessages, userData } = validatePartialUser(req.body)

    if(hasError){
      return res.status(422).json({
        status: 'error',
        message: errorMessages
      })
    }

    const userUpdated = await UserService.update(user, userData)

    return res.status(200).json(userUpdated)

});

export const changePassword = catchAsync( async (req, res, next) => {
  //1. obtener el usuario en sesion
  const { sessionUser } = req

  //2. traer los datos de la req.body
  const { currentPassword, newPassword } = req.body

  //3.validar si la contraseña actual y la nueva son iguales, enviar un error
  if (currentPassword === newPassword) {
    return next(new AppError('The password cannot be equal', 400))
  }

  //4. validar si la contraseña actual es igual a la contraseña en la base de datos
  const isCorrectPasword = await verifyPassword(newPassword, sessionUser.password)

  if(!isCorrectPasword) {
    return next(new AppError('Incorrect email or password', 401))
  }

  //5. encriptar la nueva contraseña
  const hashedNewPassword = await encryptedPassword(newPassword)

  //6. actualizar la contraseña
  await UserService.update(sessionUser, {
    password: hashedNewPassword,
    passwordChangedAt: new Date()
  })

  return res.status(200).json({
    message: 'User password was update successfully'
  })


})

export const deleteUser = catchAsync( async (req, res) => {

    const { user } = req

    await UserService.deleteUser(user)
    return res.status(204).json()

});
