import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Views1736536207764 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'views',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.addColumn(
      'views',
      new TableColumn({
        name: 'url_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'views',
      new TableForeignKey({
        columnNames: ['url_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'urls',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('views', 'FK_VIEWS_URL_ID');
    await queryRunner.dropColumn('views', 'url_id');
    await queryRunner.dropTable('views');
  }
}
