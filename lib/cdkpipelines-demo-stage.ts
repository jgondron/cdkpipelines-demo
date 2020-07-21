import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { CdkpipelinesDemoStack, CdkpipelinesDemoStackProps } from './cdkpipelines-demo-stack';

/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDemoStage extends Stage {
  public readonly urlOutput: CfnOutput;
  
  constructor(scope: Construct, id: string, props: StageProps, serviceProps: CdkpipelinesDemoStackProps) {
    super(scope, id, props);

    const service = new CdkpipelinesDemoStack(this, 'WebService', serviceProps);
    
    // Expose CdkpipelinesDemoStack's output one level higher
    this.urlOutput = service.urlOutput;
  }
}