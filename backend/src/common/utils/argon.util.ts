import * as argon2 from 'argon2';

class Argon {
  public hashSync(data: string): Promise<string> {
    return argon2.hash(data);
  }

  public verifySync(hash: string, data: string): Promise<boolean> {
    return argon2.verify(hash, data);
  }
}

export const argon = new Argon();
