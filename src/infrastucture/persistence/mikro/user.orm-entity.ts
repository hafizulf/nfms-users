import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class UserOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Property({ fieldName: 'password_hash', hidden: true })
  passwordHash: string;

  @Property({ fieldName: 'created_at', type: 'timestamptz', defaultRaw: 'now()' })
  createdAt: Date;

  @Property({
    fieldName: 'updated_at',
    type: 'timestamptz',
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Date;

  @Property({ fieldName: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
