"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1700000000000 = void 0;
class InitialSchema1700000000000 {
    constructor() {
        this.name = 'InitialSchema1700000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'NORMAL_USER', 'STORE_OWNER')`);
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(60) NOT NULL,
        "email" VARCHAR NOT NULL,
        "password_hash" VARCHAR NOT NULL,
        "address" VARCHAR(400),
        "role" "public"."users_role_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);
        await queryRunner.query(`CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email")`);
        await queryRunner.query(`
      CREATE TABLE "stores" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(60) NOT NULL,
        "email" VARCHAR NOT NULL,
        "address" VARCHAR(400),
        "owner_id" INTEGER NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_stores" PRIMARY KEY ("id"),
        CONSTRAINT "FK_stores_owner" FOREIGN KEY ("owner_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`CREATE INDEX "IDX_STORES_NAME" ON "stores" ("name")`);
        await queryRunner.query(`
      CREATE TABLE "ratings" (
        "id" SERIAL NOT NULL,
        "user_id" INTEGER NOT NULL,
        "store_id" INTEGER NOT NULL,
        "rating" SMALLINT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ratings" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_RATING_USER_STORE" UNIQUE ("user_id", "store_id"),
        CONSTRAINT "CHK_rating_range" CHECK ("rating" BETWEEN 1 AND 5),
        CONSTRAINT "FK_ratings_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_ratings_store" FOREIGN KEY ("store_id")
          REFERENCES "stores"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`CREATE INDEX "IDX_RATINGS_USER" ON "ratings" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_RATINGS_STORE" ON "ratings" ("store_id")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
exports.InitialSchema1700000000000 = InitialSchema1700000000000;
//# sourceMappingURL=1700000000000-InitialSchema.js.map