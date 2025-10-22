export class ResetPasswordCommand {
  constructor(
    public readonly user_id: string,
    public readonly password: string
  ) {}
}
