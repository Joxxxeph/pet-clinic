import { Appoiment } from "../../modules/appoiment/appoiment.model.js";
import { Pet } from "../../modules/pet/pet.model.js";
import { User } from "../../modules/user/user.model.js";
import { Medic } from "../../modules/medic/medic.model.js";

export const initModel = () => {
  User.hasMany(Pet, {foreignKey: 'user_id'});
  Pet.belongsTo(User, { foreignKey: 'user_id' });

  Pet.hasMany(Appoiment, {foreignKey: 'pet_id'});
  Appoiment.belongsTo(Pet, {foreignKey: 'pet_id'});

  Medic.hasMany(Appoiment, {foreignKey: 'medic_id'});
  Appoiment.belongsTo(Medic, {foreignKey: 'medic_id'});
}