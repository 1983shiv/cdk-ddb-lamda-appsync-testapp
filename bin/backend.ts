#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../stacks/database-stack';
import { ComputeStack } from "../stacks/compute-stack";
import { AuthStack } from "../stacks/auth-stack";
import { AppsyncStack } from "../stacks/appsync-stack";

import * as dotenv from "dotenv"
dotenv.config()

const app = new cdk.App();
const databaseStack = new DatabaseStack(app, 'DatabaseStack');
const computeStack = new ComputeStack(app, 'ComputeStack', {
  usersTable: databaseStack.usersTable,
  todosTable: databaseStack.todosTable
});
const authStack = new AuthStack(app, 'AuthStack', {
  addUserPostConfirmation: computeStack.addUserToTableFunc
});

const appsyncStack = new AppsyncStack(app, 'AppsyncStack', {
  userPool: authStack.todoUserPool,
  createTodoFunc: computeStack.createTodoFunc,
  listTodoFunc: computeStack.listTodosFunc,
  deleteTodoFunc: computeStack.deleteTodoFunc
})