import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';  
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';      // The CloudFront CDK Library
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'; 
import path = require('path');

export class CdkDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myBucket = new s3.Bucket(this, 'rs-school-deployment-react-1', {
      versioned: false,
      accessControl: s3.BucketAccessControl.PRIVATE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });


    const accessIdentity = new cloudfront.OriginAccessIdentity(this, 'RsSchoolDeploymentOriginAccessIdentity');
    myBucket.grantRead(accessIdentity);

    const s3Origin = new origins.S3Origin(myBucket, {
      originAccessIdentity: accessIdentity,
    });


    const distribution = new cloudfront.Distribution(this, 'RsSchoolDeploymentCloudFrontDistribution', {
      defaultBehavior: { 
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
    });

    new BucketDeployment(this, 'RsSchoolDeploymentReactSpa', {
      sources: [
        Source.asset(path.resolve(__dirname, '../../dist')),
      ],
      destinationBucket: myBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
