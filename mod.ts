import chalk from "npm:chalk@5";
import { EventEmitter } from "@denosaurs/event";

// XL Software @ 2024
// 📜

/**
 * @module
 *
 * This module contains logger class for formatting log strings
 *
 * ```ts
 * // main.ts
 *
 * import { Logger } from "@xlsoftware/logger";
 *
 * export const log = new Logger()
 * ```
 *
 *  * ```ts
 * // module.ts
 *
 * import { log } from "./main.ts";
 *
 * log.log('module.ts is up and running', 'module.ts')
 * ```
 *
 * ```
 * [08.03.2024, 21:07:21.64] (module.ts): module.ts is up and running
 * ```
 */

const OSLocale = Intl.DateTimeFormat().resolvedOptions().locale;

enum LogType {
	Default,
	Info,
	Warn,
	Error,
}

/**
 * @interface LogObject - Represents a log entry object.
 * @property {string} timestamp - The timestamp of the log entry.
 * @property {string} msg - The log message.
 * @property {string | undefined} from - The source of the log entry (optional).
 * @property {string} log - The formatted log entry string.
 * @property {LogType} type
 */
interface LogObject {
	timestamp: string;
	msg: string;
	from?: string;
	log: string;
	type: LogType;
}

/**
 * @interface LoggerOptions
 * @property {number} maxStackSize - Maximum number of logs stored in array
 * @property {boolean} colored - Colorize the output of logs in the terminal
 */
interface LoggerOptions {
	maxStackSize?: number;
	colored?: boolean;
}

type PrepareLog = Omit<LogObject, "log" | "timestamp">;

const Colorize = {
	coloredType: {
		// Default
		0: (t: string) => t,
		// Info
		1: chalk.blue,
		// Warn
		2: chalk.yellowBright,
		// Error
		3: chalk.red,
	},
	timestamp: chalk.yellow,
	from: chalk.cyan,
};

type Events = {
	log: [LogObject];
};

/**
 * @class Logger - Simple logging utility class.
 */
export class Logger extends EventEmitter<Events> {
	/**
	 * @private @member {LogObject[]} logarr - Array to store log entries.
	 */
	private logarr: LogObject[] = [];

	/**
	 * @constructor
	 * Creates an instance of Logger.
	 */
	constructor(private options?: LoggerOptions) {
		super();
	}

	/**
	 * Logs a message.
	 * @param {string} msg - The log message.
	 * @param {string | undefined} from - The source of the log entry (optional).
	 */
	log(msg: string, from?: string): void {
		this.createLog(LogType.Default)(msg, from);
	}

	/**
	 * Logs a message error.
	 * @param {string} msg - The log message.
	 * @param {string | undefined} from - The source of the log entry (optional).
	 */
	error(msg: string, from?: string): void {
		this.createLog(LogType.Error)(msg, from);
	}

	/**
	 * Logs a message info.
	 * @param {string} msg - The log message.
	 * @param {string | undefined} from - The source of the log entry (optional).
	 */
	info(msg: string, from?: string): void {
		this.createLog(LogType.Info)(msg, from);
	}

	/**
	 * Logs a message warning.
	 * @param {string} msg - The log message.
	 * @param {string | undefined} from - The source of the log entry (optional).
	 */
	warn(msg: string, from?: string): void {
		this.createLog(LogType.Warn)(msg, from);
	}

	/**
	 * Generates a formatted string of all log entries.
	 * @returns {string} - Formatted log entries string.
	 * @deprecated Use snapshot
	 */
	generate(): string {
		const logs: string[] = [];
		this.logarr.forEach((log) => {
			logs.push(log.log);
		});
		return logs.join("\n");
	}

	/**
	 * Returns the array of log entries.
	 * @returns {LogObject[]} - Array of log entries.
	 * @deprecated Use snapshot
	 */
	generate_array(): LogObject[] {
		return this.logarr;
	}

	/**
	 * Make a snapshot
	 */
	snapshot(format: true): string;
	snapshot(format: false): LogObject[];
	snapshot(format?: boolean): LogObject[];
	snapshot(format?: boolean) {
		if (format) {
			const logs: string[] = this.logarr.map((l) => l.log);
			return logs.join("\n");
		}

		return [...this.logarr];
	}

	private createLog(type: LogType): (msg: string, from?: string) => void {
		return (msg, from) => {
			const preLog: PrepareLog = {
				msg: msg,
				from: from,
				type,
			};

			const readyLog = this.prepareLog(preLog);

			if (this.logarr.length > (this.options?.maxStackSize || 500)) {
				this.logarr.shift();
			}

			this.logarr.push(readyLog);
			console.log(readyLog.log);
			this.emit("log", readyLog);
		};
	}

	/**
	 * Prepare a log
	 */
	private prepareLog(log: PrepareLog): LogObject {
		const date = new Date();
		const timestamp = `${date.toLocaleString(
			OSLocale
		)}.${date.getMilliseconds()}`;

		let logBuilder = "";

		const type = LogType[log.type].toUpperCase();

		if (log.type != LogType.Default) {
			if (this.options?.colored) {
				logBuilder += Colorize.coloredType[log.type](type);
			} else {
				logBuilder += type;
			}

			logBuilder += ": ";
		}

		if (this.options?.colored) {
			logBuilder += `[${Colorize.timestamp(timestamp)}]`;
		} else {
			logBuilder += `[${timestamp}]`;
		}

		if (log.from) {
			logBuilder += " ";
			if (this.options?.colored) {
				logBuilder += `(${Colorize.from(log.from)}): `;
			} else {
				logBuilder += `(${log.from}): `;
			}
		} else {
			logBuilder += ": ";
		}

		logBuilder += log.msg;

		return {
			...log,
			log: logBuilder,
			timestamp,
		};
	}
}
