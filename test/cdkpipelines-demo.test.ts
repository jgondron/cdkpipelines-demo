import { expect as expectCDK, matchTemplate, MatchStyle, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkpipelinesDemo from '../lib/cdkpipelines-demo-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkpipelinesDemo.CdkpipelinesDemoStack(app, 'MyTestStack', { backendUrl: 'test.domain.com' });
    // THEN
    expectCDK(stack).to(haveResource('AWS::Lambda::Function'))
});
