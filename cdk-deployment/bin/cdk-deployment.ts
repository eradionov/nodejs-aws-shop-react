#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkDeploymentStack } from '../lib/cdk-deployment-stack';

const app = new cdk.App();
new CdkDeploymentStack(app, 'CdkDeploymentStack', {
});