import { User } from '../models';
import { v4 as uuid } from 'uuid';

export default {
  Query: {
    users: async (root, args, context) => context.userService.getUsers(),
    user: async (root, args, context) => context.userService.getUserById(args.id)
  },
  Mutation: {
    createUser: async (root, args, context) => {
      const user: User = {
        id: uuid(),
        name: args.name,
        lastname: args.lastname
      };

      return await context.userService.createUser(user);
    }
  }
}
