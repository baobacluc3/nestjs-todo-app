// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TrimPipe } from './common/pipes/trim.pipe';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();


  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
    new TrimPipe(),
  );

   // Global interceptors
   app.useGlobalInterceptors(
    new LoggingInterceptor(),  // Add logging interceptor
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );

  // Global filters (order matters - most specific first, then more general)
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new AllExceptionsFilter(),
  );
  
  
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('A simple Todo API built with NestJS with JWT Authentication')
    .setVersion('1.0')
    .addTag('todos')
    .addTag('users')
    .addTag('auth')
    .addTag('admin')
    .addTag('public')
    .addBearerAuth() // Add Bearer Auth support to Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();