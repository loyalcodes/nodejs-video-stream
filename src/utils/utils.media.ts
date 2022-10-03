
import { join } from "path"

 export const getMedia = (): string =>{
        const file = join(process.cwd(), `./src/assets/video.mp4`)
        if(file) return file
      }
      
export const getStreamableMedia = (): string =>{
        return join(process.cwd(), `./src/assets/sample.mkv`)
     }
