export class UserEntity {
  private _passwordHash: string;

  private constructor(
    public readonly id: string,
    private _name: string,
    private _email: string,
    passwordHash: string,
    private _is_email_verified: boolean = false,
    private _email_verified_at: Date | null = null,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    this._passwordHash = passwordHash;
  }

  static create(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    is_email_verified: boolean = false,
    email_verified_at: Date | null = null,
    now = new Date(),
  ) {
    return new UserEntity(id, name, email, passwordHash, is_email_verified, email_verified_at, now, now);
  }

  // Rehydrate from persistence
  static rehydrate(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    is_email_verified: boolean = false,
    email_verified_at: Date | null = null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new UserEntity(id, name, email, passwordHash, is_email_verified, email_verified_at, createdAt, updatedAt);
  }

  // Getters (expose safely)
  get name() { return this._name; }
  get email() { return this._email; }
  get is_email_verified() { return this._is_email_verified; }
  get email_verified_at() { return this._email_verified_at; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  // Behavior (enforce invariants + bump updatedAt)
  rename(name: string) {
    this._name = name.trim();
    this.touch();
  }

  changeEmail(email: string) {
    this._email = email.toLowerCase();
    this.touch();
  }

  setpasswordHash(passwordHash: string) {
    this._passwordHash = passwordHash;
    this.touch();
  }

  // (optional) compare via domain service, not here
  get passwordHash() { return this._passwordHash; } // expose if repo needs it

  private touch() {
    this._updatedAt = new Date();
  }
}
