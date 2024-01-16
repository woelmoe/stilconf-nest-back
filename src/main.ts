import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { Server } from 'socket.io'

const io = new Server(8080, {
  cors: {
    origin: '*'
  }
  /* options */
})

io.on('connection', (socket) => {
  console.log(socket)
  // ...
})

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
