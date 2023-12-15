import jwt from 'jsonwebtoken'; 
import { AppError } from '../../common/errors/appError.js';
import { catchAsync } from '../../common/errors/catchAsync.js';
import { UserService } from './user.service.js';
import { envs } from '../../config/enviroments/enviroments.js';
import { promisify } from 'util'

export const validateExistUser = catchAsync( async (req, res, next) => {

    const { id } = req.params;

    const user = await UserService.findOne(id);

    if (!user) {
      return next(new AppError(`User whit id: ${id} not found`, 404))
    }

    req.user = user
    next() 

});


export const protect = catchAsync(async (req, res, next) => {
  //1. obtener el token
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }
  
  //2. validar el token
  if(!token){
    return next(new AppError('You are not logged in!. Please login to get access', 401))
  }

  //3. decodificar el token
  const decoded = await promisify(jwt.verify)(token, envs.SECRET_JWT_SEED)


  //4. buscar el usuario dueño del token y validar si existe
  const user = await UserService.findOne(decoded.id)

  if(!user) {
    return next(new AppError('The owner of this token in nor longer available', 401))
  }


  //5. validar si el usuario cambio la contraseña recientemente, si es asi enviar un error
  if(user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    )
    if(decoded.iat < changedTimeStamp){
      return next(new AppError('User recently changed password!, please login again', 401))
    }
  }


  //6. adjuntar el usuario en sesion, el usuario en sesion es el usuario dueño del toquen
  req.sessionUser = user;
  next()

});


export const protectAccountOwner = (req, res, next) => {
  const { user, sessionUser } = req

  if(user.id !== sessionUser.id){
    return next(new AppError('You do not own this account', 401))
  }

  next()
}

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perfom this action.!', 403)
      );
    }
    next();
  };
};