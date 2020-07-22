import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';
import { ShellScriptAction } from '@aws-cdk/pipelines';

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();
 
    const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('/all/github/ndlib-git', { jsonField: 'oauth' }),
        owner: 'jgondron',
        repo: 'cdkpipelines-demo',
        trigger: codepipeline_actions.GitHubTrigger.POLL,
      }),

       // How it will be built and synthesized
       synthAction: SimpleSynthAction.standardNpmSynth({
         sourceArtifact,
         cloudAssemblyArtifact,
         
         // We need a build step to compile the TypeScript Lambda
         buildCommand: 'npm run build'
       }),
    });

    const preprod = new CdkpipelinesDemoStage(this, 'PreProd', {
      // env: { account: '333680067100', region: 'us-east-2' },
    }, {
      backendUrl: 'https://preprod.domain.com',
    });
    const preprodStage = pipeline.addApplicationStage(preprod);
    preprodStage.addActions(new ShellScriptAction({
      actionName: 'TestService',
      useOutputs: {
        // Get the stack Output from the Stage and make it available in
        // the shell script as $ENDPOINT_URL.
        ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput),
      },
      commands: [
        'echo Testing endpoint $ENDPOINT_URL',
        // Use 'curl' to GET the given URL and fail if it returns an error
        'curl -Ssf $ENDPOINT_URL',
      ],
    }));

    const prod = new CdkpipelinesDemoStage(this, 'Prod', {
      // env: { account: '333680067100', region: 'us-east-2' },
    }, {
      backendUrl: 'https://prod.domain.com',
    });
    const prodStage = pipeline.addApplicationStage(prod);
    prodStage.addActions(new ShellScriptAction({
      actionName: 'TestService',
      useOutputs: {
        // Get the stack Output from the Stage and make it available in
        // the shell script as $ENDPOINT_URL.
        ENDPOINT_URL: pipeline.stackOutput(prod.urlOutput),
      },
      commands: [
        'echo Testing endpoint $ENDPOINT_URL',
        // Use 'curl' to GET the given URL and fail if it returns an error
        'curl -Ssf $ENDPOINT_URL',
      ],
    }));
  }
}