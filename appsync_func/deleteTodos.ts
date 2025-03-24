import { DynamoDBClient, DeleteItemCommand, DeleteItemCommandInput, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AppSyncResolverEvent, AppSyncIdentityCognito } from "aws-lambda";


const ddbClient = new DynamoDBClient({
    region: process.env.AWS_REGION as string
});

// const TABLE_NAME = 'Todos'

export const handler = async (event: AppSyncResolverEvent<any>): Promise<boolean> => {
    try {
        const UserID = (event.identity as AppSyncIdentityCognito).username;
        const title = event.arguments.title;
        const todoId = await getTodoId(UserID, title);
        console.log('todoId:::', todoId);
        const params: DeleteItemCommandInput = {
            TableName: "Todos",
            Key: marshall({
                UserID: UserID,
                TodoId: todoId[0].TodoID
            })
        }
        const command = new DeleteItemCommand(params);
        const data = await ddbClient.send(command);
        if(data){
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log('error:::', error);
        throw error;
    }    
}

const getTodoId = async (UserID: string, title: string): Promise<any> => {
    console.log("UserID: ", UserID)
    console.log("title: ", title)

    try {
        const command = new QueryCommand({
            TableName: "Todos",
            IndexName: "getTodoId",
            KeyConditionExpression: "#DDB_UserID = :pkey and #DDB_title = :skey",
            ExpressionAttributeNames: {
                "#DDB_UserID": "UserID",
                "#DDB_title": "title"
            },
            ExpressionAttributeValues: {
                ":pkey": { S: UserID },
                ":skey": { S: title }
            }
        })
        try {
            const response = await ddbClient.send(command);

            // Unmarshalling DynamoDB items into JS objects and casting to TS types
            const result = (response.Items || []).map((i) => unmarshall(i)) as any[];
            console.log("results ", result)
            return result;
        } catch (error) {
            console.log(`Failed to fetch data from DynamoDB::: ${JSON.stringify(
                error,
                null,
                2
            )}`);
            throw error;
        }
    } catch (error) {
        console.log('error from getTodoId func:::', error);
        throw error;
    }
}