
// XL Software @ 2024
// 📜

/**
 * @interface LogObject - Represents a log entry object.
 * @property {string} timestamp - The timestamp of the log entry.
 * @property {string} msg - The log message.
 * @property {string | undefined} from - The source of the log entry (optional).
 * @property {string} log - The formatted log entry string.
 * @property {boolean | undefined} error - Indicates if the log entry is an error (optional).
 */
interface LogObject {
    timestamp: string
    msg: string
    from?: string
    log: string,
    error?: boolean
}

/**
 * @class Logger - Simple logging utility class.
 */
export class Logger {

    /**
     * @private @member {LogObject[]} logarr - Array to store log entries.
     */
    private logarr: LogObject[] = []

    /**
     * @constructor
     * Creates an instance of Logger.
     */
    constructor() {}

    /**
     * Logs a message.
     * @param {string} msg - The log message.
     * @param {string | undefined} from - The source of the log entry (optional).
     */
    log(msg: string, from?: string): void {
    
        const date = new Date();
        const timestamp = `${date.toLocaleString('ru-RU')}.${date.getMilliseconds()}`
        const log = `[${timestamp}] ${from ? '(' + from + ')' : ''}: ${msg}`
        this.logarr.push({
            timestamp: timestamp,
            msg: msg,
            from: from,
            log: log
        })
        console.log(log)
    }

    /**
     * Logs an error message.
     * @param {string} msg - The error message.
     * @param {string | undefined} from - The source of the error (optional).
     */
    error(msg: string, from?: string): void {
        const date = new Date();
        const timestamp = `${date.toLocaleString('ru-RU')}.${date.getMilliseconds()}`
        const log = `ERROR: [${timestamp}] ${from ? '(' + from + ')' : ''}: ${msg}`
        this.logarr.push({
            timestamp: timestamp,
            msg: msg,
            from: from,
            log: log,
            error: true
        })
        console.log(log)
    }

    /**
     * Generates a formatted string of all log entries.
     * @returns {string} - Formatted log entries string.
     */
    generate(): string {
        const logs: string[] = []
        this.logarr.forEach(log => {
            logs.push(log.log)
        });
        return logs.join('\n')
    }

    /**
     * Returns the array of log entries.
     * @returns {LogObject[]} - Array of log entries.
     */
    generate_array(): LogObject[] {
        return this.logarr
    }
}
