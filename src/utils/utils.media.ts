import { NotFoundException } from "@nestjs/common"
import { createWriteStream } from "fs";
import { join } from "path"

export class MediaUtils{
     getMedia (): any {
        const filePath = join(process.cwd(), `./src/assets/video.mp4`)
        if(filePath) return filePath
        return new NotFoundException(null, "Streamable file not found")
     }

	 getStreamableMedia (): any {
        return join(process.cwd(), `./src/assets/sample.mkv`)
     }
}