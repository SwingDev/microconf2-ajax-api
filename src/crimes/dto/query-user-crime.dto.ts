import { IsArray, IsString } from 'class-validator';

export class QueryUserCrimeDTO {
  @IsArray()
  @IsString({ each: true })
  public readonly ids!: string[];
}
