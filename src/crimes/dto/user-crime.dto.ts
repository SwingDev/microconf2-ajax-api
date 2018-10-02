export interface IUserCrimeDTO {
  id: string;
  priority: number | null;
  description: string;
  suspectId: string | null;
  regionId: string | null;
}
