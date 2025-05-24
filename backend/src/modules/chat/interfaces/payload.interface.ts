export interface Payload {
  room: string;
  data: {
    user: string;
    message: string;
  };
}
