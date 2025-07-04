import { ILaptopBrand } from '@/modules/brand/interfaces/laptop-brand.interface';
import { ICPU } from './cpu.interface';
import { IDisplay } from './display.interface';
import { IGPU } from './gpu.interface';
import { IRam } from './ram.interface';
import { IStorage } from './storage.interface';

export interface IProduct {
  id: string;
  thumbnail: string;
  model: string;
  LaptopBrand: ILaptopBrand | null;
  Processor: ICPU | null;
  VideoGraphics: IGPU | null;
  Display: IDisplay | null;
  Memory: IRam | null;
  Storage: IStorage | null;
}
