import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";

export class EcrStack extends Stack {
  public readonly ecrRepository: ecr.Repository;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ecrRepository = new ecr.Repository(this, "EcrRepository", {
      repositoryName: "keep-notes-api",
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
