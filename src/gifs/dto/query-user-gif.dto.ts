import { IsArray, IsString } from 'class-validator';

export class QueryUserGifDTO {
  @IsArray()
  @IsString({ each: true })
  public readonly ids!: string[];
}
