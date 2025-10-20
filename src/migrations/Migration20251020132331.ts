import { Migration } from '@mikro-orm/migrations';

export class Migration20251020132331 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "is_email_verified" boolean not null default false, "email_verified_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}
