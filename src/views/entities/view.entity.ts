import { Url } from 'src/urls/entities/url.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class View {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url_id: string;

  url: Url;
  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}