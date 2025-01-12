import { Url } from '../../urls/entities/url.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('views')
export class View {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Url, (url) => url.views)
  @JoinColumn({ name: 'url_id' })
  url_id: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
