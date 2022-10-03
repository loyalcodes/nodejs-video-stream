import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';


async function bootstrap() {

  const logger = new Logger("Main");
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();// Starts listening for shutdown hooks
  const server = await app.listen(port, ()=>{
    logger.log({
      "serverStatus":"Running",
      "serverPort":port,
      "processID": process.pid
    })
  });

  //Handle Signals
  const signals = ['SIGTERM', 'SIGQUIT', 'SIGINT']
  signals.forEach(signal => {
    process.on(signal, () => {
      // Wait on other processes or connections to close or finish processing then stop server from accepting new requests
      logger.log(`${signal} recieved...`)
      server.close(function (err) {
        if (err) {
          logger.error(`${err} while shutting down application.`)
          process.exit(1)
        }
        process.exit(0)
      })
    })
  })
}
bootstrap();
