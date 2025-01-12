import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  original_url: string;
  user_id?: string;
}
