export class UpdateUserCommand {
  constructor(public readonly userData: {
    id: string,
    name?: string,
    email?: string,
  }) {}
}
