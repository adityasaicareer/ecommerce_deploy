import {Router} from 'express';
import {S3Client,ListObjectsV2Command,GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const s3=new S3Client({region:"ap-south-1"});
const route=Router();

route.get("/",async (req,res)=>{
    try{
        const listCommand=new ListObjectsV2Command({Bucket:"aditya-ecommerce-product-images",prefix:""});

        const data=await s3.send(listCommand);

        const objects=data.Contents;
        const urls = await Promise.all(objects.map(async obj => {
        const getCmd = new GetObjectCommand({ Bucket: "aditya-ecommerce-product-images", Key: obj.Key });
        const url = await getSignedUrl(s3, getCmd, { expiresIn: 3600 });
        return { key: obj.Key, url, size: obj.Size, lastModified: obj.LastModified };
    }));

    res.json({ images: urls });
    }
    catch(err)
    {
        console.log(err);
        res.json({error:err});
    }
})
export default route;

