import express from 'express';
import { createMedic, 
        deleteMedic, 
        findAllMedics, 
        findOneMedic, 
        updateMedic } 
      from './medic.controller.js';
import { validateExistMedic } from './medic.middleware.js';

export const router = express.Router();

router.route('/')
  .get(findAllMedics)
  .post(createMedic);

router.route('/:id')
  .get(validateExistMedic, findOneMedic)
  .patch(validateExistMedic, updateMedic)
  .delete(validateExistMedic, deleteMedic);
