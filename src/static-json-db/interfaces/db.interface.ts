import { IStaticJsonGif } from './gif.interface';
import { IStaticJsonSource } from './source.interface';
import { IStaticJsonTag } from './tag.interface';

export interface IStaticJsonDB {
  gif: IStaticJsonGif[];
  tag: IStaticJsonTag[];
  source: IStaticJsonSource[];
}
