export class UpdateUserImageCommand {
  constructor(
    public readonly user_id: string,
    public readonly avatar_path: string | null,
  ) {}
}
