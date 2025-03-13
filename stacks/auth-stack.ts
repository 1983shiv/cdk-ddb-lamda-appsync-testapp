import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_cognito } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

interface authStackProps extends cdk.StackProps {
    addUserPostConfirmation: NodejsFunction;
}

export class AuthStack extends cdk.Stack {
    public readonly todoUserPool: aws_cognito.UserPool;
    public readonly todoUserPoolClient: aws_cognito.UserPoolClient;

    constructor(scope: Construct, id: string, props: authStackProps) {
        super(scope, id, props);
        this.todoUserPool = this.CreateUserPool(props);
        this.todoUserPoolClient = this.CreateWebClient();
        this.output();
    }

    CreateUserPool(props: authStackProps) {
        const userPool = new aws_cognito.UserPool(this, 'TodoUserPool', {
            userPoolName: 'TODO-USER-POOL',
            selfSignUpEnabled: true,
            signInCaseSensitive: false,
            autoVerify: {
                email: true,
            },
            passwordPolicy: {
                minLength: 6,
                requireLowercase: false,
                requireDigits: false,
                requireSymbols: false,
                requireUppercase: false,
            },
            signInAliases: {
                email: true,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
            },
            customAttributes: {
                name: new aws_cognito.StringAttribute({
                    minLen: 2,
                    maxLen: 24,
                }),
            },
            // Post signin or signup, which function should trigger?
            lambdaTriggers: {
                postConfirmation: props.addUserPostConfirmation,
            },
        });

        return userPool;
    }
    CreateWebClient(){
        const client = new aws_cognito.UserPoolClient(this, 'TODO-USER-POOL-CLIENT', {
            userPool: this.todoUserPool,
            authFlows: {
                userPassword: true,
                userSrp: true,
            },
            
        });
        return client;
    }
    output(){
        new cdk.CfnOutput(this, 'TodoPoolId', {
            value: this.todoUserPool.userPoolId
        });
        new cdk.CfnOutput(this, "TodoPoolClientId", {
            value: this.todoUserPoolClient.userPoolClientId
        })
    }
}
