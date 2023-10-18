import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class NetworkStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly ecsSubnets: ec2.SelectedSubnets;
  public readonly rdsSubnets: ec2.SelectedSubnets;
  public readonly containerPort = 8000;
  public readonly rdsSG: ec2.SecurityGroup;
  public readonly ecsSG: ec2.SecurityGroup;
  public readonly nlb: elbv2.CfnLoadBalancer;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "vpc", {
      vpcName: "KeepNotesVpc",
      createInternetGateway: true,
      maxAzs: 2,

      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "publicSubnets",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "ecsSubnets",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: "rdsSubnets",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    this.ecsSubnets = this.vpc.selectSubnets({ subnetGroupName: "ecsSubnets" });
    this.rdsSubnets = this.vpc.selectSubnets({ subnetGroupName: "rdsSubnets" });
    const publicSubnets = this.vpc.selectSubnets({
      subnetGroupName: "publicSubnets",
    });

    // ====================== Security Groups ===================================
    // 1. NLB Security Group
    const nlbSG = new ec2.SecurityGroup(this, "NLBSecurityGroup", {
      vpc: this.vpc,
      description: "Access to internal loadbalancer",
      allowAllOutbound: true,
      disableInlineRules: true,
    });

    // 2. ECS Security Group
    this.ecsSG = new ec2.SecurityGroup(this, "EcsSecurityGroup", {
      vpc: this.vpc,
      description: "Access to ECS",
      allowAllOutbound: true,
      securityGroupName: "EcsSecurityGroup",
    });

    // allow Public Traffic to NLB Security group
    nlbSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());

    // allow NLB security group to access ECS
    this.ecsSG.connections.allowFrom(nlbSG, ec2.Port.allTraffic());

    // 3. RDS Security Group
    this.rdsSG = new ec2.SecurityGroup(this, "RdsSecurityGroup", {
      vpc: this.vpc,
      allowAllOutbound: true,
      description: "Access to RDS",
      securityGroupName: "RdsSecurityGroup",
    });

    // allow ECS security group to access RDS
    this.rdsSG.connections.allowFrom(this.ecsSG, ec2.Port.allTraffic());
    // ========================= End of SG ====================================

    // Private Network Load Balancer
    this.nlb = new elbv2.CfnLoadBalancer(this, "NLB", {
      name: "KeepNotesNLB",
      scheme: "internal",
      type: "network",
      subnets: publicSubnets.subnetIds,
      securityGroups: [nlbSG.securityGroupId],
    });
  }
}
