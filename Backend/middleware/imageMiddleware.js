import multer from "multer";
const storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,"uploads/");

    },
    filename: function(req,file,cb){
        cb(null,Date.now()+" "+file.originalname);

    }
})
const uploads=multer(
    {storage:storage

    }
);
export default uploads;