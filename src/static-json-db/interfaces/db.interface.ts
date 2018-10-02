import { IStaticJsonCrime } from './crime.interface';
import { IStaticJsonRegion } from './region.interface';
import { IStaticJsonSuspect } from './suspect.interface';

export interface IStaticJsonDB {
  crime: IStaticJsonCrime[];
  region: IStaticJsonRegion[];
  suspect: IStaticJsonSuspect[];
}
