import multer from "multer";
import path, {dirname} from "path";
import { fileURLToPath } from "url";//ES6 uses fileURLToPath and dirname from path
const __dirname = dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname,"../utils/imagesFile"))
        console.log("imagePath",path.join(__dirname,"../utils/imagesFile"))
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname)
        console.log("fileName",Date.now()+file.originalname)
    },
    fileFilter: function(req,file,cb){
        let ext = path.extname(file.originalname);
        if(ext !== ".mp4" && ext !== ".mkv" && ext !== ".mp3" && ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png"){
            cb(new Error("file type is not supported"),false);
            return
        }
        cb(null, true)
    }
})

const upload = multer({storage:storage})

export default upload