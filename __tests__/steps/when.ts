import * as cognito from "@aws-sdk/client-cognito-identity-provider"

import * as dotenv from "dotenv"
dotenv.config()

// region: "eu-west-1"
const cognitoClient = new cognito.CognitoIdentityProviderClient({ region: "eu-west-1" });

export const a_user_signs_up = async (email:string, password:string, name:string ):Promise<string> => {
    const userPoolId = process.env.ID_USER_POOL || "";
    const clientId = process.env.CLIENT_USER_POOL_ID || "";
    // const client = new cognito.CognitoIdentityProviderClient({});
    const username = email;
    console.log(`${email} --> Signing Up`)
    const command = new cognito.SignUpCommand({
        ClientId: clientId,
        Username: username,
        Password: password,
        UserAttributes: [
            { Name: "name", Value: name }
        ],
    });

    const signUpResponse = await cognitoClient.send(command);
    const userSub = signUpResponse.UserSub
    const adminCmd: cognito.AdminGetUserCommandInput = {
        Username: userSub as string,
        UserPoolId: userPoolId as string
    }
    await cognitoClient.send(new cognito.AdminConfirmSignUpCommand(adminCmd))
    console.log(`${email} --> Signed Up`)

    return userSub as string;
}