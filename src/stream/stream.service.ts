import { Injectable, StreamableFile, Header, Headers, Res, HttpStatus, Get, NotFoundException, OnApplicationShutdown, Logger } from "@nestjs/common";
import { Response } from "express";
import { statSync, createReadStream, createWriteStream } from 'fs';
import { MediaUtils } from "src/utils/utils.media";


//Inject the service
@Injectable()
export class StreamService implements OnApplicationShutdown{

    onApplicationShutdown(signal: string) {
        console.log(`signal recieved: ${signal}`); 
    }

    private logger = new Logger("StreamService")

    async start( @Headers() headers, @Res() res: Response){

      const mediaUtils = new MediaUtils()
      const streamableMediaPath = mediaUtils.getStreamableMedia()
      const readStream = this.readStreamData()
      const writableStream = createWriteStream(streamableMediaPath);

      console.log(`===================READ STREAM DATA ==============`)

      readStream.on('data', (chunk) =>{
          writableStream.write(chunk);
          console.log(chunk) 
      });

      readStream.on('end', ()=>{

        console.log(" Completed .mp4 to .mkv ")

        const { size } = statSync(streamableMediaPath);
        const streamableFileRange = headers.range;

        if(streamableFileRange){
          const parts = streamableFileRange.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
          const chunkSize = (end - start) + 1;

          const readStreamfile = createReadStream(streamableMediaPath, { start, end, highWaterMark:60 });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
          };
          res.writeHead(HttpStatus.PARTIAL_CONTENT, head); // Expose data to client
          readStreamfile.pipe(res);
          console.log(`=================== HEADER CONTENT ==============`)
          console.log(`parts: ${parts} start: ${start}`)
        }else{

          const head = {
            'Content-Length': size,
          };

          res.writeHead(HttpStatus.OK, head);
          createReadStream(streamableMediaPath).pipe(res);
          console.log(`Header content: ${JSON.stringify(head)}`)
        }
       })
       readStream.on('error', (error)=>{
          console.log(`ReadStreamDataError: ${error}`)
       })
  }

  readStreamData(){ //Get stream data from mp4
    const mediaUtils = new MediaUtils()
    return createReadStream(mediaUtils.getMedia());
  }

}