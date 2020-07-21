#!/usr/bin/env node
import { App } from '@aws-cdk/core';
import { CdkpipelinesDemoPipelineStack } from '../lib/cdkpipelines-demo-pipeline-stack';
import { CdkpipelinesDemoStage } from '../lib/cdkpipelines-demo-stage';

const app = new App();

new CdkpipelinesDemoStage(app, 'Dev', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
new CdkpipelinesDemoPipelineStack(app, 'CdkpipelinesDemoPipelineStack', {
  env: { account: '333680067100', region: 'us-east-2' },
});

app.synth();