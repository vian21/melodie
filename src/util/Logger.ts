/**
 * Logger module
 *
 */
// @ts-nocheck TODO: find a way to fix this
class Logger {
    print(level, ...message: any[]) {
        if (process.env.DEBUG == "false") return;

        console[level](`[${level.toUpperCase()}]`, this.getTime(), ...message);
    }

    getTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    log(...args: any[]) {
        this.print(DebugLevel.LOG, args);
    }

    warn(...args: any[]) {
        this.print(DebugLevel.WARNING, args);
    }

    error(...args: any[]) {
        this.print(DebugLevel.ERROR, args);
    }
}

const DebugLevel = {
    LOG: "log",
    WARNING: "warn",
    ERROR: "error",
};

const loggerInstance = Object.freeze(new Logger());

export default loggerInstance;
