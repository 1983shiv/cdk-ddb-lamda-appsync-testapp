import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION as string
});

exports.handler = async function(
    event: PostConfirmationConfirmSignUpTriggerEvent
): Promise<PostConfirmationConfirmSignUpTriggerEvent>{
    console.log({event})

    const date = new Date();
    const isoDate = date.toISOString();

    const params = {
        TableName: "Users",
        Item: marshall({
            UserID: event.request.userAttributes.sub,
            email: event.request.userAttributes.email,
            name: event.request.userAttributes.name,
            CreatedAt: isoDate,
            UpdatedAt: isoDate,
            __typename: "User",
        })
    }

    try {
        await client.send(new PutItemCommand(params));
    } catch (error) {
        console.log(error)
        throw error;
    }

    return event;
}
