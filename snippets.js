{
    "create a node sequelize model": {
      "prefix": "model",
      "body": [
        "import { DataTypes } from 'sequelize';",
        "//hacer importación de sequelize",
        "",
        "const ${1:ModelName} = sequelize.define('${2:modelName}', {",
        "    id: {",
        "      primaryKey: true,",
        "      allowNull: false,",
        "      autoIncrement: true,",
        "      type: DataTypes.INTEGER,",
        "    },",
        "    field1: {",
        "        type: DataTypes.STRING,",
        "        allowNull: false",
        "    },",
        "});",
        "",
        "export default ${1:ModelName};"
      ]
    },
    "create a node controller file": {
      "prefix": "controller",
      "body": [
        "//importar catchAsync",
        "",
        "",
        "export const ${1:findAll} = catchAsync(async(req, res, next) => {",
        "    return res.status(200).json(/* valor a retornar */)",
        "});",
        "",
        "export const ${2:create} = catchAsync(async(req, res, next) => {",
        "    return res.status(201).json(/* valor a retornar */)",
        "});",
        "",
        "export const ${3:findOne} = catchAsync(async(req, res, next) => {",
        "    return res.status(200).json(/* valor a retornar */)",
        "});",
        "",
        "export const ${4:update} = catchAsync(async(req, res, next) => {",
        "    return res.status(200).json(/* valor a retornar */)",
        "});",
        "",
        "export const ${5:deletectrl} = catchAsync(async(req, res, next) => {",
        "    return res.status(200).json(/* valor a retornar */)",
        "});"
      ]
    },
    "create a node middleware file": {
      "prefix": "middleware",
      "body": [
        "//importar catchAsync",
        "//instanciar el servicio",
        "",
        "export const ${1:middlewareName} = catchAsync(async(req, res, next) => {",
        "  /* valor a retornar */",
        "  next();",
        "});"
      ]
    },
    "create a node router file": {
      "prefix": "router",
      "body": [
        "import express from 'express';",
        "",
        "//controllers",
        "import ${1:controllerFile} = require('../controllers/${2:controllerFile}');",
        "",
        "const router = express.Router();",
        "",
        "router.route('/')",
        "      .get(${1:controllerFile}.${3:findAll})",
        "      .post(${1:controllerFile}.${4:create})",
        "",
        "router.route('/:id')",
        "      .get(${1:controllerFile}.${5:findOne})",
        "      .patch(${1:controllerFile}.${6:update})",
        "      .delete(${1:controllerFile}.${7:delete})",
        "",
        "",
        "module.exports = router"
      ]
    },
    "create a node generate JWT": {
      "prefix": "generatejwt",
      "body": [
        "import jwt from 'jsonwebtoken';",
        "importar envs"
        "",
        "const generateJWT = id => {",
        "  return new Promise((resolve, reject) => {",
        "    const payload = { id };",
        "",
        "    jwt.sign(",
        "      payload,",
        "      envs.SECRET_JWT_SEED,",
        "      {",
        "        expiresIn: envs.JWT_EXPIRE_IN,",
        "      },",
        "      (err, token) => {",
        "        if (err) {",
        "          console.log(err);",
        "          reject(err);",
        "        }",
        "",
        "        resolve(token);",
        "      }",
        "    );",
        "  });",
        "};",
        "",
        "export default generateJWT"
      ]
    },
    "create a node catchAsync Function": {
      "prefix": "catchAsync",
      "body": [
        "export const catchAsync = fn => {",
        "  return (req, res, next) => {",
        "    fn(req, res, next).catch(next);",
        "  };",
        "};",
        "",
      ]
    },
    "create a node AppError class": {
      "prefix": "AppError",
      "body": [
        "export class AppError extends Error {",
        "  constructor(message, statusCode) {",
        "    super(message);",
        "",
        "    this.statusCode = statusCode;",
        "    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';",
        "    this.isOperational = true;",
        "",
        "    Error.captureStackTrace(this, this.constructor);",
        "  }",
        "}",
        "",
      ]
    },
    "create a node validateFields middleware": {
      "prefix": "validateFields",
      "body": [
        "const { validationResult } = require('express-validator');",
        "",
        "exports.validateFields = (req, res, next) => {",
        "  const errors = validationResult(req);",
        "",
        "  if (!errors.isEmpty()) {",
        "    return res.status(400).json({",
        "      status: 'error',",
        "      errors: errors.mapped(),",
        "    });",
        "  }",
        "",
        "  next();",
        "};"
      ]
    },
    "create a node restrictTo middleware": {
      "prefix": "restrictTo",
      "body": [
        "export const restrictTo = (...roles) => {",
        "  return (req, res, next) => {",
        "    if (!roles.includes(req.sessionUser.role)) {",
        "      return next(",
        "        new AppError('You do not have permission to perfom this action.!', 403)",
        "      );",
        "    }",
        "",
        "    next();",
        "  };",
        "};"
      ]
    },
    "create a node protectAccountOwner middleware": {
      "prefix": "protectAccountOwner",
      "body": [
        "//importar catchAsync",
        "export const protectAccountOwner = catchAsync(async (req, res, next) => {",
        "  const { user, sessionUser } = req;",
        "",
        "  if (user.id !== sessionUser.id) {",
        "    return next(new AppError('You do not own this account.', 401));",
        "  }",
        "",
        " next();",
        "});"
      ]
    },
    "create a node sequelize connection": {
      "prefix": "sequelizeConnection",
      "body": [
        "const { Sequelize } = require('sequelize');",
        "",
        "const db = new Sequelize({",
        "  dialect: '',",
        "  host: '',",
        "  username: '',",
        "  password: '',",
        "  database: '',",
        "  logging: false,",
        "});",
        "",
        "module.exports = { db };"
      ]
    },
    "create a node protect route": {
      "prefix": "protectRoute",
      "body": [
        "import { promisify } from 'util';",
        "import jwt from 'jsonwebtoken'; ",
        "//importar envs",
        "",
        "//instanciar servicio de usuarios",
        "",
        "export const protect = catchAsync(async (req, res, next) => {",
        "  let token;",
        "  if (",
        "    req.headers.authorization &&",
        "    req.headers.authorization.startsWith('Bearer')",
        "  ) {",
        "    token = req.headers.authorization.split(' ')[1];",
        "  }",
        "",
        "  if (!token) {",
        "    return next(",
        "      new AppError('You are not logged in! Please log in to get access', 401)",
        "    );",
        "  }",
        "",
        "  const decoded = await promisify(jwt.verify)(",
        "    token,",
        "    envs.SECRET_JWT_SEED",
        "  );",
        "",
        "//buscar el usuario utilizando el servicio example: const user = await ......",
        "",
        "  if (!user) {",
        "    return next(",
        "      new AppError('The owner of this token it not longer available', 401)",
        "    );",
        "  }",
        "",
        "  //only if you have the functionality to change password",
        "  /*",
        "  if (user.passwordChangedAt) {",
        "    const changedTimeStamp = parseInt(",
        "      const changedTimeStamp = parseInt(",
        "      10",
        "    );",
        "",
        "    if (decoded.iat < changedTimeStamp) {",
        "      return next(",
        "        new AppError(",
        "          'User recently changed password!, please login again.',",
        "          401",
        "        )",
        "      );",
        "    }",
        "  }",
        "  */",
        "",
        "  req.sessionUser = user;",
        "  next();",
        "});"
      ]
    },
    "create a node error controller": {
      "prefix": "globalErrorHandler",
      "body": [
        "//importar AppError",
        "//importar variables de entorno"
        "",
        "const sendErrorDev = (err, res) => {",
        "  res.status(err.statusCode).json({",
        "    status: err.status,",
        "    error: err,",
        "    message: err.message,",
        "    stack: err.stack,",
        "  });",
        "};",
        "",
        "const sendErrorProd = (err, res) => {",
        "  if (err.isOperational) {",
        "    res.status(err.statusCode).json({",
        "      status: err.status,",
        "      message: err.message,",
        "    });",
        "  } else {",
        "    console.error('ERROR 🧨', err);",
        "    res.status(500).json({",
        "      status: 'fail',",
        "      message: 'Something went very wrong!',",
        "    });",
        "  }",
        "};",
        "",
        "export const globalErrorHandler = (err, req, res, next) => {",
        "  err.statusCode = err.statusCode || 500;",
        "  err.status = err.status || 'fail';",
        "",
        "  if (envs.NODE_ENV === 'development') {",
        "    sendErrorDev(err, res);",
        "  }",
        "",
        "  if (envs.NODE_ENV === 'production') {",
        "    let error = err;",
        "",
        "    /* valid errors */",
        "",
        "    sendErrorProd(error, res);",
        "  }",
        "};",
        "",
      ]
    },
    "crear un slice de redux": {
      "prefix": "redux-slice",
      "body": [
          "import { createSlice } from '@reduxjs/toolkit';"
          ""
          "export const ${1:template}Slice = createSlice({"
          "    name: '${1:template}',"
          "    initialState: {"
          "        ${2:namestate}: '' "
          "    },"
          "    reducers: {"
          "        ${3:namereducer}: (state, /* action */ ) => {"
          "            state.${2:namestate} = '';"
          "        },"
          "    }"
          "});"
          ""
          "export const { ${3:namereducer} } = ${1:template}Slice.actions;"
      ]
    }
  }