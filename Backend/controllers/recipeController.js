import Recipe from "../models/Recipe.js";

export const createRecipe = async (req, res) => {
    try {
        const { name, description, price, category, preparationTime, isAvailable } = req.body;

        if (!name || !description || !price || !category || !preparationTime || isAvailable === undefined) {
            return res.status(400).json({
                success: false,
                message: "all fields are required",
            });
        }

        if (req.file?.cloudinaryUrl) {
            req.body.image = req.file.cloudinaryUrl;
        }

        req.body.createdBy = req.userExist.id;
        const newRecipe = await Recipe.create(req.body);

        return res.status(201).json({
            success: true,
            message: "recipe created successfully",
            data: newRecipe,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        if (req.file?.cloudinaryUrl) {
            req.body.image = req.file.cloudinaryUrl;
        }

        // Do not allow a malformed multipart request to overwrite fields with
        // undefined values. The existing image is retained unless a new upload
        // completed successfully above.
        const allowedFields = ["name", "description", "price", "category", "preparationTime", "isAvailable", "image"];
        const changes = Object.fromEntries(
            Object.entries(req.body).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
        );

        const updates = await Recipe.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.userExist.id },
            { $set: changes },
            { new: true, runValidators: true }
        );

        if (!updates) {
            return res.status(404).json({
                success: false,
                message: "recipe not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "recipe updated successfully",
            data: updates,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const getAll= async(req,res)=>{
    try{
const filter = ["admin", "vendor"].includes(req.userExist?.role)
    ? { createdBy: req.userExist.id }
    : {};
const gets= await Recipe.find(filter);
if(!gets){
    return res.status(404).json({
        success:false,
        message:"no recipes found",
        
    })
}
return res.status(200).json({
    success:true,
    message:"all recipes fetched successfully",
    data:gets
})
    }catch(err){
        return res.status(500).json({
            status:false,
            message:err.message
        })
    }
}

export const getById=async(req,res)=>{
try{
    const getId=await Recipe.findById(req.params.id);
    if(!getId){
        return res.status(404).json({
            success:false,
            message:"recipe not found"
        })
    }
return res.status(200).json({
    success:true,
    message:"recipe fetched successfully",
    data:getId
})
}catch(err){
    return res.status(500).json({
        success:false,
        message:err.message
    })
}
}

export const deleteRecipe= async(req,res)=>{
    try{
const del=await Recipe.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.userExist.id,
});
if (!del) {
    return res.status(404).json({
        success: false,
        message: "Recipe not found or does not belong to this vendor",
    });
}
return res.status(200).json({
    success:true,
message:"recipe deleted successfully",
data:del
})
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
