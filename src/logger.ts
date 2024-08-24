import { stdout } from "process";

interface ILogger {
  warn: (message: string) => void;
  info: (message: string | string[]) => void;
  error: (message: any, stopOnError: boolean) => void;
  fatal: (message: any, stopOnFatal: boolean) => void;
  debug: (message: any, origin: string) => void;
}

export const logger: ILogger = {
  warn: (message: string) => {
    const Time = getTime();
    stdout.write(`${Time} \x1b[33m[WARN]:\x1b[0m ${message}\n`);
  },
  info: (message: string | string[]) => {
    const Time = getTime();
    stdout.write(`${Time} \x1b[36m[INFO]:\x1b[0m ${message}\n`);
  },
  error: (message: any, stopOnError: boolean) => {
    const Time = getTime();
    stdout.write(`${Time} \x1b[31m[ERROR]:\x1b[0m ${message}\n`);
    stopOnError ? process.exit(400) : null;
  },
  fatal: (message: any, stopOnFatal: boolean) => {
    const Time = getTime();
    stdout.write(`${Time} \x1b[35m[FATAL]:\x1b[0m ${message}\n`);
    stopOnFatal ? process.exit(400) : null;
  },
  debug: (message: any) => {
    const Time = getTime();
    stdout.write(`${Time} \x1b[105m[DEBUG]:\x1b[0m ${message}\n`);
  },
};

function getTime() {
  const time = new Date();
  const _Time = `${time.getHours()}:${time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}:${time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()}`;

  return `\x1b[97m[\x1b[90m${_Time}\x1b[97m]`;
}
