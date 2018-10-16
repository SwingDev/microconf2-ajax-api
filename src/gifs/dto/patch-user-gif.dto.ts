import { IsIn, IsInt, IsOptional } from 'class-validator';

export class PatchUserGifDTO {
  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3])
  public readonly vote? : number | null;
}
