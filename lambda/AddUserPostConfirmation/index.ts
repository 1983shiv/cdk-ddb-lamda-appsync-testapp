import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
    region: "eu-west-1"
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
    }

    return event;
}
