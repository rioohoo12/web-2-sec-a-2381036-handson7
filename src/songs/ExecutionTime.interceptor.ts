import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { start } from "repl";
import { Observable, tap } from "rxjs";

export class ExecutionTime implements NestInterceptor {
  private readonly logger = new Logger(ExecutionTime.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const handler = context.getHandler();
    const methodName = handler.name;
    const className = context.getClass().name;

    this.logger.log(`Before... calling ${className}.${methodName}`);
    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `After... ${className}.${methodName} took ${Date.now() - startTime}ms`
        );
      })
    );
  }
}
