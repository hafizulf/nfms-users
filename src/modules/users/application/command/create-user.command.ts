export class CreateUserCommand {
  constructor(public readonly userData: {
    name: string,
    email: string,
    password: string,
  }) {}
}
