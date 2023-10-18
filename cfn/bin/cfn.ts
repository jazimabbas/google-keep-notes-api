#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { EcrStack } from "../lib/EcrStack";
import { NetworkStack } from "../lib/NetworkStack";
import { RdsStack } from "../lib/RdsStack";
import { EcsBackendStack } from "../lib/EcsBackendStack";
import { ApiGWStack } from "../lib/ApiGWStack";

const app = new cdk.App();

const ecrStack = new EcrStack(app, "EcrStack", {});

const networkStack = new NetworkStack(app, "NetworkStack", {});

new ApiGWStack(app, "ApiGWStack", {
  nlb: networkStack.nlb,
});

const rdsStack = new RdsStack(app, "RdsStack", {
  rdsSubnets: networkStack.rdsSubnets,
  vpc: networkStack.vpc,
  rdsSG: networkStack.rdsSG,
});

new EcsBackendStack(app, "EcsBackendStack", {
  ecrRepository: ecrStack.ecrRepository,
  vpc: networkStack.vpc,
  rdsInstance: rdsStack.rdsInstance,
  ecsSG: networkStack.ecsSG,
  containerPort: 8000,
  nlb: networkStack.nlb,
});
