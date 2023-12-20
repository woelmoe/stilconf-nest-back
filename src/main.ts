import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

console.log(process.env.STILCONF_PORT)
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  const config = new DocumentBuilder()
    .setTitle('Stilconf doca')
    .setDescription('Stilconf routes')
    .setVersion('1.0')
    .addTag('stilconf')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(process.env.STILCONF_PORT)
}
bootstrap()
