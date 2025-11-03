import { Entity, PrimaryKey, Property, Filter } from '@mikro-orm/core';

@Filter({
  name: 'softDeleted',
  cond: () => ({ deletedAt: null }),
  default: true,
})
@Entity({ tableName: 'users' })
export class UserOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ fieldName: 'password_hash', hidden: true })
  passwordHash!: string;

  @Property({ fieldName: 'is_email_verified', type: 'boolean', default: false })
  is_email_verified: boolean = false;

  @Property({
    fieldName: 'email_verified_at',
    type: 'timestamptz',
    nullable: true,
  })
  email_verified_at?: Date | null = null;

  @Property({ nullable: true,  columnType: 'varchar(255)' })
  avatar_path?: string | null;

  @Property({ fieldName: 'created_at', type: 'timestamptz', defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({
    fieldName: 'updated_at',
    type: 'timestamptz',
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt!: Date;

  @Property({ fieldName: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
