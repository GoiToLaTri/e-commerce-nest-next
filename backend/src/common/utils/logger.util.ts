class Logger {
  public green(message: string): void {
    console.log(`\x1B[32m${message}\x1B[0m`);
  }

  public blue(message: string): void {
    console.log(`\x1B[34m${message}\x1B[0m`);
  }

  public red(message: string): void {
    console.log(`\x1B[31m${message}\x1B[0m`);
  }

  public yellow(message: string): void {
    console.log(`\x1B[33m${message}\x1B[0m`);
  }

  public cyan(message: string): void {
    console.log(`\x1B[36m${message}\x1B[0m`);
  }

  public magenta(message: string): void {
    console.log(`\x1B[35m${message}\x1B[0m`);
  }

  public white(message: string): void {
    console.log(`\x1B[37m${message}\x1B[0m`);
  }

  public black(message: string): void {
    console.log(`\x1B[30m${message}\x1B[0m`);
  }

  public gray(message: string): void {
    console.log(`\x1B[90m${message}\x1B[0m`);
  }

  public bgGreen(message: string): void {
    console.log(`\x1B[42m${message}\x1B[0m`);
  }
}

export const logger: Logger = new Logger();
