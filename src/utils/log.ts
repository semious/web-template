import winston from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';
// Winston logger

const chalk = require("chalk");

var transport = new DailyRotateFile({
	filename: '%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	maxSize: '200m',
	maxFiles: '30d',
	dirname: 'logs'
});

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.simple(),
	transports: [
		// new winston.transports.Console(),
		transport,
		// new winston.transports.File({ filename: 'error.log', level: 'error' }),
		// new winston.transports.File({ filename: 'logs/combined.log' })
	]
});


export async function sleep(second: number): Promise<void> {
	return new Promise<void>(resolve => {
		setTimeout(() => {
			resolve();
		}, second * 1000);
	})
}

export function log_result(result: boolean, msg: string) {
	if (process.env.DEBUG) {
		console.log(result ? chalk.green('pass') : chalk.red('fail'), msg);
	}
	// console.log(result ? chalk.green('pass') : chalk.red('fail'), msg);
}

export function addLogger(...args: any[]) {
	console.log(chalk.cyan(new Date().toLocaleString()), ...args);
	const message = args.map(arg => {
		if (typeof arg === 'object') {
			return JSON.stringify(arg);
		}
		if (typeof arg === 'string') {
			const color = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
			arg = arg.replace(color, '');
			return arg;
		}
		return arg;
	})
	message.unshift(new Date().toLocaleString());
	logger.info(message.join(' '));
}

export function debugLog(...args: any[]) {
  if (process.env.DEBUG !== 'true') return;
  console.log(...args);
}
