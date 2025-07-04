export interface ImageResponsePayload {
  statusCode: number;
  images: IImage[];
}

export interface IImage {
  id: string;
  public_id: string;
  url: string;
  is_thumbnail: boolean;
  is_temp: boolean;
}
