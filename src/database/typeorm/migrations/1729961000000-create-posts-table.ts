import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostsTable1729961000000 implements MigrationInterface {
  name = 'CreatePostsTable1729961000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" SERIAL PRIMARY KEY,
        "title" character varying(255) NOT NULL,
        "category" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "posts";`);
  }
}
