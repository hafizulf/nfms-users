import 'dotenv/config';

import { ConfigService } from '@nestjs/config';
import { defineConfig, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { UserOrmEntity } from '../modules/users/infrastucture/persistence/mikro/user.orm-entity';

// Used by NestJS runtime (forRootAsync)
export function mikroOrmConfig(config: ConfigService): Options<PostgreSqlDriver> {
  return {
    driver: PostgreSqlDriver,
    host: config.get<string>('DB_HOST'),
    port: Number(config.get('DB_PORT')),
    user: config.get<string>('DB_USER'),
    password: config.get<string>('DB_PASSWORD'),
    dbName: config.get<string>('DB_DATABASE'),
    entities: [UserOrmEntity],
    forceUtcTimezone: true,
    debug: config.get('NODE_ENV', 'development') !== 'production',
    migrations: {
      tableName: 'mikro_orm_migrations',
      path: 'dist/migrations',
      pathTs: 'src/migrations',
      snapshot: true,
      disableForeignKeys: false, // Ensures foreign keys are handled correctly
    },
    extensions: [Migrator],
  };
}

// Used by CLI (mikro-orm ...)
export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_DATABASE,
  entities: [UserOrmEntity],
  forceUtcTimezone: true,
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    snapshot: true,
    disableForeignKeys: false,
  },
  extensions: [Migrator],
});
