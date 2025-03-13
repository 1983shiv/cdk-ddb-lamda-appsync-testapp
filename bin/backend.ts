#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../stacks/database-stack';
import { ComputeStack } from "../stacks/compute-stack";

const app = new cdk.App();
const databaseStack = new DatabaseStack(app, 'DatabaseStack');
const computeStack = new ComputeStack(app, 'ComputeStack', {
  usersTable: databaseStack.usersTable
});