import { AppError } from "../../common/errors/appError.js";
import { catchAsync } from "../../common/errors/catchAsync.js";
import { AppoimentService } from "./appoiment.service.js";


export const validExistAppointment = catchAsync( async (req, res, next) => {
  const { id } = req.params;

  const appointment = await AppoimentService.findOneAppointment(id);

  if (!appointment) {
    return next( new AppError('Appointment not found', 404));
  }

  req.appointment = appointment;
  next();
})