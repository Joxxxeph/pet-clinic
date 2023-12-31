import { Op, QueryTypes } from "sequelize";
import { Appoiment } from "./appoiment.model.js";
import { sequelize } from "../../config/database/database.js";
import moment from "moment";
import { extractValidationData } from "../../common/utils/extractErrorData.js";
import { Pet } from "../pet/pet.model.js";
import { Medic } from "../medic/medic.model.js";
import { User } from "../user/user.model.js";


export class AppoimentService {

  static async create(data){
    return await Appoiment.create(data)
  }
  
  static async findAppoimentByTime(medicId, durationMinutes = 30, startTime){
    const appointment = await Appoiment.findAll({
      attributes: ['start_time'],
      where: {
        medicId,
        status: 'pending',                                                                       
      },
      raw: true
    })
  }

  static async findAppoimentByTimeSQL(medicId, durationMinutes=30,startTime){

    const databaseTimeZone = 'US/Eastern'
    const startMoment = moment(startTime).tz(databaseTimeZone)
    const endMoment = startMoment.clone().add(durationMinutes, 'minutes')

    const exactMatchAppointment = await sequelize.query(
      `SELECT * FROM appoiments WHERE medic_id = :medicId and status = :status and start_time >= :startTime`, 
      {
      type: QueryTypes.SELECT,
      replacements: {status:'pending', medicId: medicId, startTime: startMoment.toISOString()}
    });

    if (exactMatchAppointment.length >= 1) {
      return exactMatchAppointment
    }

    const overlappingAppointments = await sequelize.query(
      "SELECT * FROM appoiments WHERE medic_id = :medicId AND status = :status AND start_time < :endTime AND start_time + INTERVAL '30 minutes' > :startTime",
      {
      type: QueryTypes.SELECT,
      replacements: {
        status: 'pending',
        medicId: medicId,
        endTime: endMoment.toISOString(),
        startTime: startMoment.toISOString()
      }
    })

    return overlappingAppointments;
  }

  static async findOneAppointment(id){
    return await Appoiment.findOne({
      where: {
        id,
        status: 'pending'
      }
    })
  }

  static async findAllAppointment(){
    return await Appoiment.findAll({
      where: {
        status: 'pending'
      },
      include: [
        {
          model: Pet,
          include: [
            {
              model: User,
              attributes: ['name', 'surname', 'dni']
            }
          ]
        },
        {
          model: Medic,
          attributes: ['dni', 'surname', 'name', 'speciality']
        }
      ]
    })
  }

  static async deleteAppointment(appointment){
    return await appointment.update({ status: 'cancelled'})
  }

  static async updateAppointment(appointment){
    return await appointment.update({ status: 'complete'})
  }


}