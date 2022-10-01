import { Module } from '@nestjs/common';
import { StreamControler } from './stream/stream.controler';
import { StreamService } from './stream/stream.service';


@Module({
  imports: [],
  controllers: [StreamControler],
  providers: [StreamService],
})
export class AppModule {}
