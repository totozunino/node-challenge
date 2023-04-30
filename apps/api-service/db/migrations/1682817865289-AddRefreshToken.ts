import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshToken1682817865289 implements MigrationInterface {
  name = 'AddRefreshToken1682817865289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar CHECK( "role" IN ('admin','user') ) NOT NULL, "refreshToken" varchar, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "email", "password", "role") SELECT "id", "createdAt", "updatedAt", "email", "password", "role" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar CHECK( "role" IN ('admin','user') ) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "email", "password", "role") SELECT "id", "createdAt", "updatedAt", "email", "password", "role" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
  }
}
