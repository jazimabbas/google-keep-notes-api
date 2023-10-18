import { Stack, StackProps, RemovalPolicy, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

interface INetworkStackProps extends StackProps {
  vpc: ec2.Vpc;
  rdsSubnets: ec2.SelectedSubnets;
  rdsSG: ec2.SecurityGroup;
}

export class RdsStack extends Stack {
  public readonly rdsInstance: rds.DatabaseInstance;

  constructor(scope: Construct, id: string, props: INetworkStackProps) {
    super(scope, id, props);

    const rdsSubnetGroup = new rds.SubnetGroup(this, "SubnetGroup", {
      vpc: props.vpc,
      description: "RDS Subnet group configuration",
      vpcSubnets: props.rdsSubnets,
      subnetGroupName: "rdsSubnetGroup",
    });

    // create rds mysql instance
    this.rdsInstance = new rds.DatabaseInstance(this, "MySQLInstance", {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      vpc: props.vpc,
      backupRetention: Duration.days(0),
      credentials: rds.Credentials.fromGeneratedSecret("keepnotes"),
      databaseName: "keepnotes",
      deleteAutomatedBackups: true,
      instanceIdentifier: "google-keep-notes-mysql",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO
      ),
      multiAz: true,
      removalPolicy: RemovalPolicy.DESTROY,
      securityGroups: [props.rdsSG],
      vpcSubnets: props.rdsSubnets,
      subnetGroup: rdsSubnetGroup,
      allocatedStorage: 20,
    });
  }
}
