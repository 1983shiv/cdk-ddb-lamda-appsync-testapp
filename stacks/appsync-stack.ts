import * as cdk from 'aws-cdk-lib';
import * as awsAppsync from 'aws-cdk-lib/aws-appsync';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

interface AppsyncStackProps extends cdk.StackProps {
    userPool: UserPool;
    createTodoFunc: NodejsFunction;
}

export class AppsyncStack extends cdk.Stack {
    public readonly api: awsAppsync.GraphqlApi;
    constructor(scope: Construct, id: string, props: AppsyncStackProps) {
        super(scope, id, props);
        this.api = this.createAppsyncApi(props);
    }

    createAppsyncApi(props: AppsyncStackProps) {
        const api = new awsAppsync.GraphqlApi(this, 'TodoAppsyncAPI', {
            name: 'TodoAppsyncAPI',
            definition: awsAppsync.Definition.fromFile(
                path.join(__dirname, '../schema/schema.graphql')
            ),
            // schema: awsAppsync.SchemaFile.fromAsset(
            //     path.join(__dirname, '../schema/schema.graphql')
            // ),
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
}
