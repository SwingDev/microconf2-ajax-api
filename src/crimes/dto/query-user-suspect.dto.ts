import { IsArray, IsString } from 'class-validator';

export class QueryUserSuspectDTO {
  @IsArray()
  @IsString({ each: true })
  public readonly ids!: string[];
}
