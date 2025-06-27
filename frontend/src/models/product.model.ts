import { IImage } from "./image.model";

export interface ProductInfoPayload {
  brand: string;
  model: string;
  description: string;
  cpu: string;
  gpu: string;
  display: string;
  ram: string;
  storage: string;
  quantity: number;
  pricing: number;
}

export interface IProduct {
  id: string;
  thumbnail: string;
  model: string;
  description: string;
  quantity: number;
  price: number;
  LaptopBrand: ILaptopBrand;
  Processor: IProccessor;
  VideoGraphics: IVideoGraphics;
  Display: IDisplay;
  Memory: IMemory;
  Storage: IStorage;
  images: IImage[];
  created_at: Date | string;
  updated_at: Date | string;
  status: boolean;
}



export interface ILaptopBrand {
  id: string;
  name: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface IProccessor {
  brand: string;
  created_at: string;
  family: string;
  generation: number;
  id: string;
  model: string;
  series: string;
  sku: string;
  suffix: string;
  updated_at: Date | string;
}

export interface IVideoGraphics {
  brand: string;
  created_at: Date | string;
  id: string;
  manufacturer: string;
  memory_type: string;
  model: string;
  name: string;
  prefix: string;
  series: string;
  updated_at: Date | string;
  vram_gb: number;
}

export interface IDisplay {
  brightness: string;
  color_coverage: string;
  created_at: Date | string;
  id: string;
  info: string;
  panel_type: string;
  ratio: string;
  refresh_rate: string;
  resolution: string;
  response_time: string;
  size: string;
  updated_at: Date | string;
}

export interface IMemory {
  capacity: string;
  created_at: Date | string;
  id: string;
  info: string;
  max_capacity: string;
  slots: number;
  speed: string;
  sticks: number;
  type: string;
  updated_at: Date | string;
}

export interface IStorage {
  capacity: string;
  created_at: Date | string;
  id: string;
  info: string;
  interface: string;
  max_capacity: string;
  slots: number;
  type: string;
  updated_at: Date | string;
}
