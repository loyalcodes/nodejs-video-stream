import { Injectable, StreamableFile, Header, Headers, Res, HttpStatus, Get, NotFoundException, OnApplicationShutdown, Logger } from "@nestjs/common";
import { Response } from "express";
import { statSync, createReadStream } from 'fs';
import { MediaUtils } from "src/utils/utils.media";


//Inject the service
@Injectable()
export class StreamService implements OnApplicationShutdown{

    onApplicationShutdown(signal: string) {
        console.log(`signal recieved: ${signal}`); 
    }

    private logger = new Logger("StreamService")
    
    async start( @Headers() headers, @Res() res: Response){ // Start video streaming while waiting on resources
    this.logger.verbose(`Started streaming for ${process.pid}`)
    const mediaUtils = new MediaUtils()
    const videoPath = mediaUtils.getMedia()
    const { size } = statSync(videoPath);
    const videoRange = headers.range;
    let parts: any, start: any, chunkSize: any, end: any = null;
    if (videoRange) {
       parts = videoRange.replace(/bytes=/, "").split("-");
       start = parseInt(parts[0], 10);
       end = parts[1] ? parseInt(parts[1], 10) : size - 1;
       chunkSize = (end - start) + 1;
      const readStreamfile = createReadStream(videoPath, { start, end, highWaterMark:60 });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunkSize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); // Expose data to client
      readStreamfile.pipe(res);
      this.logger.verbose(`Current streaming data: ${JSON.stringify(
        {
            "parts": parts,
            "chunkSize": chunkSize,
            "end": end
        }
      )}`)
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head);
      createReadStream(videoPath).pipe(res); // Expose StreamableData
      this.logger.verbose(`Current streaming data: ${JSON.stringify(
        {
            "parts": parts,
            "chunkSize": chunkSize,
            "end": end
        }
      )}`)
    }
  } 
}