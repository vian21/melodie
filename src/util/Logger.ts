/**
 * Logger module
 *
 */
class _Logger {
    print(level:DebugLevel, ...message: unknown[]) {
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

    log(...args: unknown[]) {
        this.print(DebugLevel.LOG, args);
    }

    warn(...args: unknown[]) {
        this.print(DebugLevel.WARNING, args);
    }

    error(...args: unknown[]) {
        this.print(DebugLevel.ERROR, args);
    }
}

enum DebugLevel {
    LOG = "log",
    WARNING = "warn",
    ERROR = "error",
};

const Logger = Object.freeze(new _Logger());

export default Logger;
