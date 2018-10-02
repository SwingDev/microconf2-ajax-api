export interface ICrimeDTO {
  id: string;
  priority: number | null;
  description: string;
  suspectId: string | null;
  regionId: string | null;
}
