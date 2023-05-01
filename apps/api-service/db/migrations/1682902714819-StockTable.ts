import { MigrationInterface, QueryRunner } from 'typeorm';

export class StockTable1682902714819 implements MigrationInterface {
  name = 'StockTable1682902714819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stock" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "symbol" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_fb162ab5543387fae800952d49f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_history"("id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId") SELECT "id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId" FROM "stock_history"`,
    );
    await queryRunner.query(`DROP TABLE "stock_history"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_stock_history" RENAME TO "stock_history"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar, "stockId" varchar, CONSTRAINT "FK_fb162ab5543387fae800952d49f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_history"("id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId") SELECT "id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId" FROM "stock_history"`,
    );
    await queryRunner.query(`DROP TABLE "stock_history"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_stock_history" RENAME TO "stock_history"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar, "stockId" varchar, CONSTRAINT "FK_fb162ab5543387fae800952d49f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b910dfd033ccb6d561d0390858c" FOREIGN KEY ("stockId") REFERENCES "stock" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_stock_history"("id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId", "stockId") SELECT "id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId", "stockId" FROM "stock_history"`,
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
      `CREATE TABLE "stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar, "stockId" varchar, CONSTRAINT "FK_fb162ab5543387fae800952d49f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "stock_history"("id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId", "stockId") SELECT "id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId", "stockId" FROM "temporary_stock_history"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_history"`);
    await queryRunner.query(
      `ALTER TABLE "stock_history" RENAME TO "temporary_stock_history"`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_fb162ab5543387fae800952d49f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "stock_history"("id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId") SELECT "id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId" FROM "temporary_stock_history"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_history"`);
    await queryRunner.query(
      `ALTER TABLE "stock_history" RENAME TO "temporary_stock_history"`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock_history" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "symbol" varchar NOT NULL, "date" datetime NOT NULL, "open" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "close" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_fb162ab5543387fae800952d49f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "stock_history"("id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId") SELECT "id", "createdAt", "updatedAt", "date", "open", "high", "low", "close", "userId" FROM "temporary_stock_history"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_stock_history"`);
    await queryRunner.query(`DROP TABLE "stock"`);
  }
}
