import * as cdk from 'aws-cdk-lib';
import * as awsAppsync from 'aws-cdk-lib/aws-appsync';
import * as path from 'path';
// import * as IAM from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

interface AppsyncStackProps extends cdk.StackProps {
    userPool: UserPool;
    createTodoFunc: NodejsFunction;
    listTodoFunc: NodejsFunction;
    deleteTodoFunc: NodejsFunction
}

export class AppsyncStack extends cdk.Stack {
    public readonly api: awsAppsync.GraphqlApi;
    constructor(scope: Construct, id: string, props: AppsyncStackProps) {
        super(scope, id, props);
        this.api = this.createAppsyncApi(props);
        this.createTodoResolver(this, this.api, props);
        this.listTodoResolver(this, this.api, props);
        this.deleteTodoResolver(this, this.api, props);
    }

    createAppsyncApi(props: AppsyncStackProps) {
        const api = new awsAppsync.GraphqlApi(this, 'TodoAppsyncAPI', {
            name: 'TodoAppsyncAPI',
            definition: awsAppsync.Definition.fromFile(
                path.join(__dirname, '../schema/schema.graphql')
            ),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: awsAppsync.AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool: props.userPool,
                    },
                },
                additionalAuthorizationModes: [
                    {
                        authorizationType: awsAppsync.AuthorizationType.IAM,
                    },
                ],
            },
            logConfig: {
                fieldLogLevel: awsAppsync.FieldLogLevel.ALL,
            },
        });
        new cdk.CfnOutput(this, 'GraphQLAPIURL', {
            value: api.graphqlUrl,
        });
        return api;
    }
    createTodoResolver(scope: Construct, api: awsAppsync.GraphqlApi, props: AppsyncStackProps){
        const createTodoResolver = api.addLambdaDataSource('createTodoDataSource', props.createTodoFunc);
        createTodoResolver.createResolver('createTodoMutation', {
            typeName: 'Mutation',
            fieldName: 'createTodo',
        })    
    }

    listTodoResolver(scope: Construct, api: awsAppsync.GraphqlApi, props: AppsyncStackProps){
        const listTodoResolver = api.addLambdaDataSource('listTodoDataSource', props.listTodoFunc);
        listTodoResolver.createResolver('listTodoQuery', {
            typeName: 'Query',
            fieldName: 'listTodos',
        })    
    }

    deleteTodoResolver(scope: Construct, api: awsAppsync.GraphqlApi, props: AppsyncStackProps){
        const deleteTodoResolver = api.addLambdaDataSource('deleteTodoDataSource', props.deleteTodoFunc);
        deleteTodoResolver.createResolver('deleteTodoMutation', {
            typeName: 'Mutation',
            fieldName: 'deleteTodo',
        })    
    }
}
