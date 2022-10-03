import { createWriteStream } from "fs";
import { join } from "path";

// Write messages to a flat file in memory
export const logMessage = (message: string) =>{
    const log_file = createWriteStream(join(process.cwd(), `./logs/debug.log`), {flags : 'a'});
    message = new Date().toISOString() + " " + message + "\n";
    log_file.write(message)
}