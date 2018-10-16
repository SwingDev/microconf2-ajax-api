import { IsArray, IsString } from 'class-validator';

export class QueryUserSourceDTO {
  @IsArray()
  @IsString({ each: true })
  public readonly ids!: string[];
}
