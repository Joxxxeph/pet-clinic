import express from 'express'
import { createPet, findAllPets } from './pet.controller.js'

export const router = express.Router()

router.route('/')
  .get(findAllPets)
  .post(createPet)