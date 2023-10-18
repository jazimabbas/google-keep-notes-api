import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

interface IApiGWStackProps extends StackProps {
  nlb: elbv2.CfnLoadBalancer;
}

export class ApiGWStack extends Stack {
  public readonly nlb: elbv2.CfnLoadBalancer;

  constructor(scope: Construct, id: string, props: IApiGWStackProps) {
    super(scope, id, props);

    const INetworkLoadBalancer =
      elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(
        this,
        "INetworkLoadBalancer",
        {
          loadBalancerDnsName: props.nlb.attrDnsName,
          loadBalancerArn: props.nlb.ref,
        }
      );

    // Create a VPC Link
    const link = new apigateway.VpcLink(this, "VpcLink", {
      vpcLinkName: "KeepNotesVpcLink",
      targets: [INetworkLoadBalancer],
    });

    // Create a Regional REST API
    const restApi = new apigateway.RestApi(this, "Api", {
      restApiName: "KeepNotesApi",
      endpointTypes: [apigateway.EndpointType.REGIONAL],
    });

    const integration = new apigateway.Integration({
      type: apigateway.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: "ANY",
      options: {
        connectionType: apigateway.ConnectionType.VPC_LINK,
        vpcLink: link,
        requestParameters: {
          "integration.request.path.proxy": "method.request.path.proxy",
        },
      },
      uri: `http://${INetworkLoadBalancer.loadBalancerDnsName}:8000/{proxy}`,
    });
    const proxyResource = restApi.root.addResource("{proxy+}", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });
    proxyResource.addMethod("ANY", integration, {
      authorizationType: apigateway.AuthorizationType.NONE,
      requestParameters: {
        "method.request.path.proxy": true,
      },
    });
  }
}
