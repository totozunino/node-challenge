import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1682709399372 implements MigrationInterface {
  name = 'Init1682709399372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "email" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar CHECK( "role" IN ('admin','user') ) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "symbol" varchar NOT NULL, "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "symbol" varchar NOT NULL, "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_fb162ab5543387fae800952d49f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_history"("id", "createdAt", "updatedAt", "name", "symbol", "date", "open", "high", "low", "close", "userId") SELECT "id", "createdAt", "updatedAt", "name", "symbol", "date", "open", "high", "low", "close", "userId" FROM "stock_history"`,
    );
    await queryRunner.query(`DROP TABLE "stock_history"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_stock_history" RENAME TO "stock_history"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock_history" RENAME TO "temporary_stock_history"`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "symbol" varchar NOT NULL, "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "stock_history"("id", "createdAt", "updatedAt", "name", "symbol", "date", "open", "high", "low", "close", "userId") SELECT "id", "createdAt", "updatedAt", "name", "symbol", "date", "open", "high", "low", "close", "userId" FROM "temporary_stock_history"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_history"`);
    await queryRunner.query(`DROP TABLE "stock_history"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
