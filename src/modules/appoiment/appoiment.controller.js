import { AppError } from "../../common/errors/appError.js";
import { catchAsync } from "../../common/errors/catchAsync.js";
import { MedicService } from "../medic/medic.service.js";
import { PetService } from "../pet/pet.service.js";
import { validateAppoiment } from "./appoiment.schema.js";
import { AppoimentService } from "./appoiment.service.js";


export const scheduleAppoiment = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, appoimentData} = validateAppoiment(req.body)

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessages
    })
  }

  const [pet,medic] = await Promise.all([
    await PetService.findOnde(appoimentData.petId),
    await MedicService.findOne(appoimentData.medicId)
  ])

  if(!pet) {
    return next( new AppError(`Pet with id: ${appoimentData.petId} not found`, 404))
  }

  if(!medic) {
    return next( new AppError(`Medic with id: ${appoimentData.medicId} not found`, 404))
  }

  const appointment = await AppoimentService.findAppoimentByTimeSQL(
    appoimentData.medicId,
    req.body.durationMinutes,
    appoimentData.startTime
    )

  if (appointment.length >= 1) {
    return next(new AppError('The doctor already has an appoiment assigned', 409))
  }

  const appointmentCreated = await AppoimentService.create(appoimentData)

  return res.status(201).json(appointmentCreated)

})

export const findAllApointments = catchAsync(async (req, res, next) => {
  const appointment = await AppoimentService.findAllAppointment();
  return res.status(200).json(appointment)
})

export const finOneAppointment = catchAsync(async (req, res, next) => {
  const { appointment } = req
  return res.status(200).json(appointment)
})

export const deleteApointment = catchAsync(async (req, res, next) => {
  const { appointment } = req
  await AppoimentService.deleteAppointment(appointment)
  return res.status(204).json(null)
})

export const updateAppointment = catchAsync(async (req, res, next) => {
  const {appointment} = req
  await AppoimentService.updateAppointment(appointment)
  return res.status(200).json({
    message: 'The appointment has been completed'
  })
})