import { NotFoundException } from "@nestjs/common"
import { join } from "path"

export class MediaUtils{
     getMedia (): any {
        const filePath = join(process.cwd(), `./src/assets/video.mp4`)
        if(filePath) return filePath
        return new NotFoundException(null, "Streamable file not found")
     }
    
    
    
}