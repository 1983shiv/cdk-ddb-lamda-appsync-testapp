import * as cognito from "@aws-sdk/client-cognito-identity-provider"
import { makeGraphQLRequest } from "../test_cases/utils"
import * as dotenv from "dotenv"
dotenv.config()


interface CreateTodoInput {
    UserID: string,
    title: string
}

interface CreateTodoResponse {
    UserID: string,
    TodoID: string,
    title: string,
    completed: boolean

}

// region: "eu-west-1"
const cognitoClient = new cognito.CognitoIdentityProviderClient({ region: process.env.AWS_REGION as string });


export const we_invoke_create_todo = async(user:any, todoData:CreateTodoInput):Promise<any> => {
    const createTodoMutation = `
        mutation CreateTodo($UserID: String!, $title: String!) {
            createTodo(UserID: $UserID, title: $title) {
                UserID
                TodoID
                title
                completed
            }
        }
    `;
    const variables = {
        input: todoData
    }

    let result: any;
    try {
        result = await makeGraphQLRequest(createTodoMutation, variables, user.accessToken)
    } catch (error) {
        console.log(error)
        throw error;
    }

    console.log(`Results ::: ${result}`)
    console.log(`[${user.username}] === Created a TODO`)
    return result.createTodo as CreateTodoResponse
}

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
