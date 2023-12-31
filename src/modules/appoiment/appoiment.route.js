import express from 'express'
import { scheduleAppoiment, updateAppointment, findAllApointments, finOneAppointment, deleteApointment } from './appoiment.controller.js'
import { validExistAppointment } from './appoiment.middleware.js'

export const router = express.Router()

router.get('/', findAllApointments)

router.post('/schedule-appoiment', scheduleAppoiment)

router.route('/:id')
  .get(validExistAppointment, finOneAppointment)
  .patch(validExistAppointment, updateAppointment)
  .delete(validExistAppointment, deleteApointment)