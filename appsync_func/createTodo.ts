import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AppSyncResolverEvent } from "aws-lambda";
import { ulid } from "ulid";

const ddbClient = new DynamoDBClient({
    region: process.env.AWS_REGION
});

const TABLE_NAME = 'Todos'

export const handler = async (event: AppSyncResolverEvent<{ input: { title: string, UserID: string } }>) => {
    console.log('event:::', JSON.stringify(event, null, 2));
    const { UserID, title } = event.arguments.input;
    const TodoID = ulid();
    // const now = new Date().toISOString();
    const item: PutItemCommandInput = {
        TableName: TABLE_NAME,
        Item: marshall({
            UserID,
            TodoID,
            title,
            completed: false
        })
    }

    try {
        const command = new PutItemCommand(item);
        await ddbClient.send(command);
    } catch (error) {
        console.log('error:::', error);
    }

    return { 
        UserID,
        TodoID,
        title,
        completed: false
    }
}
