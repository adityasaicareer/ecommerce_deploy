import {Router} from "express";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient,GetCommand,ScanCommand} from "@aws-sdk/lib-dynamodb";
const Getproduct=Router();

const ddb=new DynamoDBClient({region:"ap-south-1"});
const ddbclient=DynamoDBDocumentClient.from(ddb);

Getproduct.get("/", async (req,res)=>{

    try{
        const result = await ddbclient.send(new ScanCommand({TableName:"ecommerce"}))
        res.json(result.Items);
        console.log(result.Items);
    }
    catch(err)
    {
        console.log(err);
        res.json({error:err})
    }

})

export default Getproduct;