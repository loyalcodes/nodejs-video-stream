import { Controller, Get, Header, Headers, Res, HttpStatus, Logger } from "@nestjs/common";
import { StreamService } from "./stream.service";
import { Response } from "express";
import { logMessage } from "src/utils/utils.logging";

@Controller()
export class StreamController {
 constructor(private readonly streamService: StreamService){}
    
    private logger = new Logger("StreamControler")

    @Get('stream')
    @Header('Accept-Ranges', 'bytes')
    @Header('Content-Type', 'video/mp4')
    initStream(@Headers() headers, @Res() res: Response){
        this.logger.verbose(`Incoming stream request for ${ process.pid }`)
        logMessage(`Incoming stream request for ${ process.pid }`)
       return this.streamService.start(headers, res);
    }

    @Get('serverError')
    mediaError(@Res() res: Response){
        logMessage("serverError: ")
        res.send({
            status: res.sendStatus(500),
        })
    }
    
}