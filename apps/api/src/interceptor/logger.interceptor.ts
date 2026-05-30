import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError, tap, throwError } from "rxjs";
import { randomUUID } from "crypto";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const requestId = randomUUID();
    const startTime = process.hrtime.bigint();

    request.requestId = requestId;

    return next.handle().pipe(
      tap(() => {
        const responseTime = this.getResponseTime(startTime);

        const logData = this.buildLog({
          type: "REQUEST",
          request,
          statusCode: response.statusCode,
          responseTime,
        });

        this.logger.log(`\n${JSON.stringify(logData, null, 2)}`);
      }),
      catchError((error) => {
        const responseTime = this.getResponseTime(startTime);

        const logData = this.buildLog({
          type: "ERROR",
          request,
          statusCode: error?.status ?? 500,
          responseTime,
          error,
        });

        this.logger.error(`\n${JSON.stringify(logData, null, 2)}`);

        return throwError(() => error);
      }),
    );
  }

  private getResponseTime(startTime: bigint): string {
    const duration =
      Number(process.hrtime.bigint() - startTime) / 1_000_000;

    return `${duration.toFixed(2)}ms`;
  }

  private buildLog({
    type,
    request,
    statusCode,
    responseTime,
    error,
  }: {
    type: "REQUEST" | "ERROR";
    request: any;
    statusCode: number;
    responseTime: string;
    error?: Error;
  }) {
    const {
      method,
      originalUrl,
      ip,
      headers,
      query,
      params,
      body,
    } = request;

    return {
      requestId: request.requestId,
      type,
      method,
      url: originalUrl,
      statusCode,
      responseTime,
      userId: request.user?.id ?? null,
      ip,
      userAgent: headers["user-agent"],
      query,
      params,
      body,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
      timestamp: new Date().toISOString(),
    };
  }
}