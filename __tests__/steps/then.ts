import { DynamoDBClient, GetItemCommand  } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ddbclient = new DynamoDBClient({
    region: "eu-west-1"
});


export const user_exists_in_UsersTable = async( userSub:string):Promise<any> => {
    let Item: unknown;

    console.log(`Looking for a , ${userSub}`)
    const params = {
        TableName: "Users",
        Key: {
            UserID: {S: userSub}
        }
    }

    try {
        const getItemResponse = await ddbclient.send(new GetItemCommand(params));
        if(getItemResponse.Item){
            Item = unmarshall(getItemResponse.Item)
        }
    } catch (error) {
        console.log('Error getting user', error);
    }

    console.log(`Found user: ${JSON.stringify(Item)}`)
    return Item;
}