import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DatabaseStack extends cdk.Stack {
    public readonly usersTable: Table;
    public readonly todosTable: Table;
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
        this.todosTable = new Table(this, 'TodosTable', {
            partitionKey: {
                name: 'UserID',
                type: AttributeType.STRING
            },
            sortKey: {
                name: 'TodoID',
                type: AttributeType.STRING
            },
            tableName: "Todos",
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        this.todosTable.addGlobalSecondaryIndex({
            indexName: 'getTodoId',
            partitionKey: {
                name: 'UserID',
                type: AttributeType.STRING
            },
            sortKey: {
                name: 'title',
                type: AttributeType.STRING
            },
        })
    }
}