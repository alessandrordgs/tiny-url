import { View } from 'src/views/entities/view.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  original_url: string;

  @Column({ nullable: true })
  user_id: string;

  @Column()
  reference_code: string;

  @OneToMany(() => View, (View) => View.url_id)
  views: View[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
