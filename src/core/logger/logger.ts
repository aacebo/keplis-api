import { format } from 'date-fns';
import * as Chalk from 'chalk';

export default class Logger {
  private static get _timestamp() {
    return format(new Date(), 'MM/dd/yyyy HH:mm:ss');
  }

  static info(msg: string) {
    console.info(Chalk.cyan(`[${this._timestamp}] > ${msg}`));
  }

  static success(msg: string) {
    console.log(Chalk.green(`[${this._timestamp}] > ${msg}`));
  }

  static warn(msg: string) {
    console.warn(Chalk.yellow(`[${this._timestamp}] > ${msg}`));
  }

  static error(msg: string) {
    console.error(Chalk.red(`[${this._timestamp}] > ${msg}`));
  }
}
