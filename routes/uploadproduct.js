import {Router} from "express";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient,PutCommand} from "@aws-sdk/lib-dynamodb";
import multer from "multer";

const product=Router();

const dynamoclient=new DynamoDBClient({region:"ap-south-1"})
const documentclient=DynamoDBDocumentClient.from(dynamoclient);

const upload=multer({storage:multer.memoryStorage()})

product.post("/",async (req,res)=>{
    try{
        console.log(req.body)
        console.log(req.file)
        const {productid,productname,productquantity,productprice}=req.body;
        if(!productid)
        {
            res.status(400).send("No product id available");
        }

    // const item={productid,productname,productquantity,productprice,file}
    const params={
        TableName:"ecommerce",
        Item:req.body
    }
    const command=new PutCommand(params);
    const result=await documentclient.send(command)
    console.log("succesfully uploaded:DynamoDB");
    res.json({message:result})
    }
    catch(err)
    {
        console.log(err)
        res.json({error:err});
    }
    

})

export default product;