import { FindUsersRequest } from "../../interface/dto/user.dto";

export class FindUsersQuery {
  constructor(
    public readonly request: FindUsersRequest,
  ) {}
}
