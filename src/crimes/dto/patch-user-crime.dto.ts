import { IsIn, IsInt, IsOptional } from 'class-validator';

export class PatchUserCrimeDTO {
  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3])
  public readonly priority? : number | null;
}
