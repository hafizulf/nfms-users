import { CreateUserHandler } from "./create-user.handler";
import { FindOneUserHandler } from "./find-one-user.handler";
import { FindUsersHandler } from "./find-users.handler";
import { UpdateUserHandler } from "./update-user.handler";

export const UserHandlers = [
  CreateUserHandler,
  FindUsersHandler,
  FindOneUserHandler,
  UpdateUserHandler,
];
