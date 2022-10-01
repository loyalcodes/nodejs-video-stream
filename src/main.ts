import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const shutDownGracefully = () => process.exit(0)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();// Starts listening for shutdown hooks
  await app.listen(3000, ()=>{
    console.log({
      "serverPort":3000,
      "processID": process.pid
    })
  });

  //Handle streams
  process.on('SIGTERM', ()=>{
    console.log("SIGTERM recieved.")
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
