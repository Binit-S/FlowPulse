/**
 * Lightweight structured logger for FlowPulse.
 * Outputs JSON-formatted logs compatible with Google Cloud Logging.
 */
export const logger = {
  /** Log informational messages */
  info(message: string, data?: Record<string, unknown>) {
    console.log(JSON.stringify({ severity: "INFO", message, ...data, timestamp: new Date().toISOString() }));
  },
  /** Log warning messages */
  warn(message: string, data?: Record<string, unknown>) {
    console.warn(JSON.stringify({ severity: "WARNING", message, ...data, timestamp: new Date().toISOString() }));
  },
  /** Log error messages with optional error object */
  error(message: string, error?: unknown, data?: Record<string, unknown>) {
    const errorInfo = error instanceof Error ? { errorMessage: error.message, stack: error.stack } : { errorMessage: String(error) };
    console.error(JSON.stringify({ severity: "ERROR", message, ...errorInfo, ...data, timestamp: new Date().toISOString() }));
  },
};
