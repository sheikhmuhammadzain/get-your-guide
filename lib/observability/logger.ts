type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, message: string, payload?: Record<string, unknown>) {
  const body = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(payload ?? {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(body));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(body));
    return;
  }

  console.log(JSON.stringify(body));
}

export const logger = {
  info: (message: string, payload?: Record<string, unknown>) => write("info", message, payload),
  warn: (message: string, payload?: Record<string, unknown>) => write("warn", message, payload),
  error: (message: string, payload?: Record<string, unknown>) => write("error", message, payload),
};
