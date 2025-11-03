import { Migration } from '@mikro-orm/migrations';

export class Migration20251103044523 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "avatar_path" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column "avatar_path";`);
  }

}
