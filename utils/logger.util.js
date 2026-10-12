const fs = require('fs');
const path = require('path');
import { log } from "node:console";

class Logger {
    constructor(logDir = 'logs') {
        this.logDir = logDir;
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    formatLog(level, message, data = null) {
        const log = {
            timestamp: this.getTimestamp(),
            level,
            message,
            ...(data && { data })
        };
        return JSON.stringify(log);
    }

    writeToFile(level, message, data) {
        const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`);
        const logEntry = this.formatLog(level, message, data) + '\n';
        fs.appendFileSync(logFile, logEntry);
    }

    info(message, data) {
        log(`[INFO] ${message}`, data || '');
        this.writeToFile('INFO', message, data);
    }

    error(message, data) {
        console.error(`[ERROR] ${message}`, data || '');
        this.writeToFile('ERROR', message, data);
    }

    warn(message, data) {
        console.warn(`[WARN] ${message}`, data || '');
        this.writeToFile('WARN', message, data);
    }

    debug(message, data) {
        log(`[DEBUG] ${message}`, data || '');
        this.writeToFile('DEBUG', message, data);
    }
}

module.exports = new Logger();