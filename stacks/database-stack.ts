import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DatabaseStack extends cdk.Stack {
    public readonly usersTable: Table;
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.usersTable = new Table(this, 'UserTable', {
            partitionKey: {
                name: 'UserID',
                type: AttributeType.STRING
            },
            tableName: "Users",
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
    }
}