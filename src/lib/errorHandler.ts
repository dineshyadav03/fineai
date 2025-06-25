// Error handling and monitoring utilities
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public timestamp: Date;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export function logError(error: Error | AppError, context?: string) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context: context || 'Unknown',
    ...(error instanceof AppError && {
      statusCode: error.statusCode,
      isOperational: error.isOperational,
    }),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', errorInfo);
  }

  // In production, you would send this to a monitoring service
  // Example integrations:
  // - Sentry: Sentry.captureException(error, { extra: errorInfo });
  // - LogRocket: LogRocket.captureException(error);
  // - Custom logging service: sendToLoggingService(errorInfo);
}

export function handleApiError(error: unknown, context: string = 'API'): Response {
  logError(error instanceof Error ? error : new Error(String(error)), context);

  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        statusCode: error.statusCode,
        timestamp: error.timestamp,
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Generic error response
  return new Response(
    JSON.stringify({
      error: 'Internal server error',
      statusCode: 500,
      timestamp: new Date(),
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function validateEnvironmentVariables() {
  const required = [
    'NEXT_PUBLIC_COHERE_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new AppError(
      `Missing required environment variables: ${missing.join(', ')}`,
      500,
      false
    );
  }
} 