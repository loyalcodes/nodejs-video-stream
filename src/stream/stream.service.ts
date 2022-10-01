import { Injectable, StreamableFile, Header, Headers, Res, HttpStatus, Get, NotFoundException } from "@nestjs/common";
import { Response } from "express";
import { statSync, createReadStream } from 'fs';
import { join } from "path";
import { Utils } from "src/utils/utils.media";

//Inject the service
@Injectable()
export class StreamService {
    
    async start( @Headers() headers, @Res() res: Response){
    const videoPath = new Utils().getMedia()
    const { size } = statSync(videoPath);
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunkSize = (end - start) + 1;
      const readStreamfile = createReadStream(videoPath, { start, end, highWaterMark:60 });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunkSize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
      readStreamfile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head);
      createReadStream(videoPath).pipe(res);
    }
  } 
}