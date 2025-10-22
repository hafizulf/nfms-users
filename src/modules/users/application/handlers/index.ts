import { CreateUserHandler } from "./create-user.handler";
import { DeleteUserHandler } from "./delete-user.handler";
import { FindOneUserHandler } from "./find-one-user.handler";
import { FindUserByEmailHandler } from "./find-user-by-email.handler";
import { FindUsersHandler } from "./find-users.handler";
import { MarkEmailAsVerifiedHandler } from "./mark-email-as-verified.handler";
import { ResetPasswordHandler } from "./reset-password.handler";
import { UpdateUserHandler } from "./update-user.handler";

export const UserHandlers = [
  CreateUserHandler,
  FindUsersHandler,
  FindOneUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  FindUserByEmailHandler,
  MarkEmailAsVerifiedHandler,
  ResetPasswordHandler,
];
