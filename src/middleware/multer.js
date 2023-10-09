import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(__dirname,"../utils/imagesFile"))
        console.log("imagePath",path.join(__dirname,"../utils/imagesFile"))
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname)
        console.log("fileName",Date.now()+file.originalname)
    }
})

const upload = multer({storage:storage})

export default upload