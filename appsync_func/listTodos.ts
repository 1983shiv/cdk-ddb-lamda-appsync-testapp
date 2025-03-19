import { DynamoDBClient, ScanCommand, ScanCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AppSyncResolverEvent, AppSyncIdentityCognito } from "aws-lambda";


const ddbClient = new DynamoDBClient({
    region: process.env.AWS_REGION as string
});

// const TABLE_NAME = 'Todos'

export const handler = async (event: AppSyncResolverEvent<any>) => {
    try {
        const identity = event.identity as AppSyncIdentityCognito;
        const UserID = identity.sub;
        console.log('UserID:::', UserID);
        const params: QueryCommandInput = {
            TableName: "Todos",
            KeyConditionExpression: "UserID = :UserID",
            ExpressionAttributeValues: {
                ":UserID": { S: UserID }
            }
        }

        const command = new QueryCommand(params);
        const data = await ddbClient.send(command);
        const todos = data.Items?.map((item) => unmarshall(item));
        return todos;
    } catch (error) {
        console.log('error:::', error);
        throw error;
    }    
}