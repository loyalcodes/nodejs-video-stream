import { Controller, Get, Header, Headers, Res, HttpStatus } from "@nestjs/common";
import { StreamService } from "./stream.service";
import { Response } from "express";

@Controller()
export class StreamControler {
 constructor(private readonly streamService: StreamService){}

    @Get('stream')
    @Header('Accept-Ranges', 'bytes')
    @Header('Content-Type', 'video/mp4')
    initStream(@Headers() headers, @Res() res: Response){
       return this.streamService.start(headers, res);
    }

}