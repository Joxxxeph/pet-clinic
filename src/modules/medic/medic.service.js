import { Medic } from "./medic.model.js"

export class MedicService {
  static async findAll(){
    return await Medic.findAll({
      where: {
        status: true
      }
    })
  }

  static async findOne(id){
    return await Medic.findOne({
      where: {
        status: true,
        id
      }
    })
  }

  static async create(data){
    return await Medic.create(data)
  }

  static async update(medic, data){
    return await medic.update(data)
  }

  static async delete(medic){
    return await medic.update({ status: false })
  }
  
}