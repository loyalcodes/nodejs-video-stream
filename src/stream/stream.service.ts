import { Injectable, StreamableFile, Header, Headers, Res, HttpStatus, Get, NotFoundException, OnApplicationShutdown, Logger } from "@nestjs/common";
import { Response } from "express";
import { statSync, createReadStream, createWriteStream } from 'fs';
import { logMessage } from "src/utils/utils.logging";
import { getMedia, getStreamableMedia } from "src/utils/utils.media";



//Inject the service
@Injectable()
export class StreamService implements OnApplicationShutdown{

    onApplicationShutdown(signal: string) {
        console.log(`signal recieved: ${signal}`); 
    }

    async start( @Headers() headers, @Res() res: Response){

      try{
      const streamableMediaPath = getStreamableMedia()
      const readStream = this.readStreamData()
      const writableStream = createWriteStream(streamableMediaPath);
      const StringDecoder = require('string_decoder').StringDecoder;
      const decoder = new StringDecoder('utf8');

      
      console.log(`Converting file...`)
      logMessage(`Converting file...`)

      // Now get data from mp4 file | Stream buffers
      readStream.on('data', (chunk) =>{
          writableStream.write(chunk);
          console.log(chunk)
         // logMessage(decoder.write(chunk)) 
      });

     //Data has been converted successfully. Do something with new streamable data.
     //Ideally, this is where the .mkv data is being served to client
      readStream.on('end', () => {

        console.log(" Completed .mp4 to .mkv ")
        logMessage("File converted successfully.")
        const { size } = statSync(streamableMediaPath);
        const streamableFileRange = headers.range;

        if(streamableFileRange){

          //Breakdown the streamable data
          const parts = streamableFileRange.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
          const chunkSize = (end - start) + 1;

          //Once that is done, assemble all and create a new streamable data | create response header data available for client
          const readStreamfile = createReadStream(streamableMediaPath, { start, end, highWaterMark:60 });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
          };

          res.writeHead(HttpStatus.PARTIAL_CONTENT, head); // Expose data to client
          readStreamfile.pipe(res);
          console.log(`parts: ${parts} start: ${start}`)
          logMessage(`parts: ${parts} start: ${start}`)
          logMessage(`Chunk sent ${chunkSize}`)

        }else{

          const head = {
            'Content-Length': size,
          };

          res.writeHead(HttpStatus.OK, head); 
          createReadStream(streamableMediaPath).pipe(res); // Render stream data to memory {actual file}
          console.log(`Header content: ${JSON.stringify(head)}`)
          logMessage(`Header content: ${JSON.stringify(head)}`)
        }
       })

       //This may happen due to some system changes or file data straucture
       //Is about time we direct the user
       readStream.on('error', (error)=>{
          console.log(`ReadStreamDataError: ${error}`)
          logMessage(`ReadStreamDataError: ${error}`)
          res.redirect('/serverError')
       })

      //Catch error and redirect user
      }catch (error){
        console.log(`StreamService Error: ${error}`)
        logMessage(`StreamService Error: ${error}`)
        res.redirect('/serverError')
      }
  }
  readStreamData(): any{ //Get stream data from mp4
    return createReadStream(getMedia());
  }

}