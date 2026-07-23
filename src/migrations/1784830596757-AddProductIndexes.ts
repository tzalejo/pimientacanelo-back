import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductIndexes1784830596757 implements MigrationInterface {
    name = 'AddProductIndexes1784830596757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_2a5c9ce8153bad0124f64df9aa" ON "product" ("featured") `);
        await queryRunner.query(`CREATE INDEX "IDX_97b3e13f4857cfac8ae26e6093" ON "product" ("available") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff0c0301a95e517153df97f681" ON "product" ("categoryId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ff0c0301a95e517153df97f681"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97b3e13f4857cfac8ae26e6093"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a5c9ce8153bad0124f64df9aa"`);
    }

}
