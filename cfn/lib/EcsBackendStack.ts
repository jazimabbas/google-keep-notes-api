import { RemovalPolicy, Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as rds from "aws-cdk-lib/aws-rds";
import { config } from "dotenv";

config();

interface IEcsBackendStackProps extends StackProps {
  ecrRepository: ecr.Repository;
  vpc: ec2.Vpc;
  rdsInstance: rds.DatabaseInstance;
  ecsSG: ec2.SecurityGroup;
  containerPort: number;
  nlb: elbv2.CfnLoadBalancer;
}

export class EcsBackendStack extends Stack {
  private readonly containerName = "keep-notes-api";
  private readonly serviceName = "keep-notes-backend-service";

  constructor(scope: Construct, id: string, props: IEcsBackendStackProps) {
    super(scope, id, props);

    // ECS Cluster
    const cluster = new ecs.Cluster(this, "cluster", {
      clusterName: "KeepNotesCluster",
      vpc: props.vpc,
    });

    //  ECS Task execution role
    const executionRole = new iam.Role(this, "EcsTaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        ),
      ],
    });

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "TaskDefinition",
      {
        cpu: 256,
        memoryLimitMiB: 512,
        executionRole,
      }
    );

    const backendServiceLogGroup = new logs.LogGroup(
      this,
      "backendServiceLogGroup",
      {
        retention: logs.RetentionDays.ONE_DAY,
        removalPolicy: RemovalPolicy.DESTROY,
      }
    );

    const backendServiceLogDriver = new ecs.AwsLogDriver({
      logGroup: backendServiceLogGroup,
      streamPrefix: "backend-service",
    });

    const repo = ecr.Repository.fromRepositoryName(
      this,
      "keep-notes-api-repo",
      props.ecrRepository.repositoryName
    );

    const image = ecs.ContainerImage.fromEcrRepository(repo);

    const container = taskDefinition.addContainer("container", {
      image,
      containerName: this.containerName,
      cpu: 256,
      environment: {
        NODE_OPTIONS: "-r tsconfig-paths/register",
        DB_PORT: props.rdsInstance.dbInstanceEndpointPort,
        DB_HOST: props.rdsInstance.dbInstanceEndpointAddress,
        DB_USERNAME: "keepnotes",
        DB_DATABASE: "keepnotes",
        JWT_SECRET: "this is secret",
        DB_PASSWORD: process.env.DATABASE_PASSWORD as string,
      },

      logging: backendServiceLogDriver,
    });

    container.addPortMappings({
      containerPort: 8000,
    });

    const service = new ecs.FargateService(this, "service", {
      cluster,
      taskDefinition,
      desiredCount: 2,
      maxHealthyPercent: 200,
      minHealthyPercent: 50,
      securityGroups: [props.ecsSG],
      serviceName: this.serviceName,
      vpcSubnets: {
        subnetGroupName: "ecsSubnets",
      },
      enableExecuteCommand: true,
    });

    // NLB target group
    const nlbTargetGroup = new elbv2.NetworkTargetGroup(
      this,
      "NLBTargetGroup",
      {
        port: 8000,
        healthCheck: {
          healthyThresholdCount: 2,
          interval: Duration.seconds(60),
          port: `${props.containerPort}`,
          protocol: elbv2.Protocol.TCP,
          timeout: Duration.seconds(10),
          unhealthyThresholdCount: 2,
        },
        protocol: elbv2.Protocol.TCP,
        targetGroupName: "NLBTargetGroup",
        targetType: elbv2.TargetType.IP,
        vpc: props.vpc,
      }
    );

    nlbTargetGroup.addTarget(service);

    const INetworkLoadBalancer =
      elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(
        this,
        "INetworkLoadBalancer",
        {
          loadBalancerArn: props.nlb.ref,
        }
      );

    // Add Listener to NLB
    INetworkLoadBalancer.addListener("NLBListener", {
      port: 8000,
      protocol: elbv2.Protocol.TCP,
      defaultTargetGroups: [nlbTargetGroup],
    });
  }
}
