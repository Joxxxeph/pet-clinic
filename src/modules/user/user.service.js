import { Pet } from '../pet/pet.model.js';
import { User } from './user.model.js';

export class UserService {
  static async findOne(id) {
    return await User.findOne({
      where: {
        id,
        status: true,
      },
    });
  }

  static async findAll() {
    return await User.findOne({
      attributes: {
        exclude: ['password', 'passwordChangedAt', 'status', 'createdAt', 'updatedAt']
      },
      where: {
        status: true,
      },
      include: [
        {
          model: Pet
        }
      ]
    });
  }

  static async create(data) {
    return await User.create(data);
  }

  static async update(user, data) {
    return await user.update(data);
  }

  static async deleteUser(user) {
    return await user.update({ status: false });
  }

  static async findOneByEmail(email){
    return await User.findOne({
      where: {
        status: true,
        email: email
      }
    })
  }
}
