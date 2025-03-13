import * as cdk from 'aws-cdk-lib';
import * as iam from "aws-cdk-lib/aws-iam";
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path = require('path');

interface computeStack extends cdk.StackProps {
    usersTable: Table;
}

export class ComputeStack extends cdk.Stack {
    public readonly addUserToTableFunc: NodejsFunction;
    constructor(scope: Construct, id: string, props: computeStack){
        super(scope, id, props);
        this.addUserToTableFunc = this.addUserToUsersTable(props);
    }

    addUserToUsersTable(props: computeStack){
        const func = new NodejsFunction(this, "addUserFunc", {
            functionName: "addUserFunc",
            runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
            entry: path.join(__dirname, '../lambda/AddUserPostConfirmation/index.ts'),
            handler: "handler",
            environment: {
                TABLE_NAME: props.usersTable.tableName
            }
        })
        func.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["dynamodb:PutItem"],
                resources: [props.usersTable.tableArn as string]
            })
        )
        return func;
    }
    
}