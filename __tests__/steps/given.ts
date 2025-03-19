import * as cognito from "@aws-sdk/client-cognito-identity-provider"

import Chance from "chance";
const chance = new Chance();

const cognitoClient = new cognito.CognitoIdentityProviderClient({ region: process.env.AWS_REGION as string });

export const a_random_user = () => {
    const firstName = chance.first({ nationality: 'en'});
    const lastName = chance.last({ nationality: 'en'});
    const email = `${firstName}.${lastName}@example.com`;
    const password = chance.string({ length: 8 });
    const name = `${firstName} ${lastName}`;
    return { name, email, password}
}

export const an_authenticated_user = async():Promise<any> => {
    const { name, email, password} = a_random_user();
    const userPoolId = process.env.ID_USER_POOL
    const clientId = process.env.CLIENT_USER_POOL_ID
    console.log(`userPoolId : ${userPoolId} and clientId : ${clientId}`)

    console.log(`User signUp from appsync-todo.test -- [${email}]`)
    const params = new cognito.SignUpCommand({
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: "name", Value: name }
        ],
    })
    
    const signUpResponse = await cognitoClient.send(params);
    const userSub = signUpResponse.UserSub

    console.log(`${userSub} - confirming sign up`)

    const adminCmd: cognito.AdminGetUserCommandInput = {
        Username: userSub as string,
        UserPoolId: userPoolId as string
    }

    await cognitoClient.send(new cognito.AdminConfirmSignUpCommand(adminCmd))
    console.log(`${email} --> Signed Up`)

    const authRequest: cognito.InitiateAuthCommandInput = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    }

    const authResponse = await cognitoClient.send(new cognito.InitiateAuthCommand(authRequest))
    console.log(`${email} --> Authenticated`)

    return {
        username: userSub as string,
        name,
        email,
        idToken: authResponse.AuthenticationResult?.IdToken as string,
        accessToken: authResponse.AuthenticationResult?.AccessToken as string
    }

}