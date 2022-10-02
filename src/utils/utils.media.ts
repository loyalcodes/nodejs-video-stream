import { NotFoundException } from "@nestjs/common"
import { join } from "path"
import Transcoder from 'stream-transcoder';

export class MediaUtils{
     getMedia (): any {
        const filePath = join(process.cwd(), `./src/assets/video.mp4`)
        if(filePath) return filePath
        return new NotFoundException(null, "Streamable file not found")
     }
    
    mediaTranscoder(){
       return new Transcoder(null)
    	    .maxSize(320, 240)
    	    .videoCodec('h264')
    	    .videoBitrate(800 * 1000)
    	    .fps(25)
    	    .audioCodec('libfaac')
    	    .sampleRate(44100)
    	    .channels(2)
    	    .audioBitrate(128 * 1000)
    	    .format('mkv')
    	    .on('finish', function() {
    	    	
    	    })
    	    .stream().pipe(null);
    }
    
}