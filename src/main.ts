import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const logger = new Logger("Main");
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();// Starts listening for shutdown hooks
  await app.listen(port, ()=>{
    logger.log({
      "serverStatus":"Running",
      "serverPort":port,
      "processID": process.pid
    })
  });

  //Handle streams
  process.on('SIGTERM', ()=>{
    app.close().then(()=>{
      console.log("Server shutdown...")
    }).catch((error)=>console.log(`On server shutdown error ${error}`))
    console.log("SIGTERM recieved.")
    process.exit(0)
  })
  process.on('SIGINT', ()=>{
    app.close().then(()=>{
      console.log("Server shutdown...")
    }).catch((error)=>console.log(`On server shutdown error ${error}`))
    console.log("SIGINT recieved.")
    process.exit(0)
  })
}
bootstrap();
