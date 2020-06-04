import { aws_lookups } from './helping/aws_lookups';

const argv = require('yargs').usage(
          'Usage: --deploy'
     )
     .describe('deploy', "deploy a scylla node")
     .argv;

import { EC2, SecurityHub } from 'aws-sdk';

interface ami {
     ami: string;
}
interface IDictionary<TValue> {
     [id: string]: TValue;
}
 
argv["region"] = "us-west-2";
argv.deploy = true;

(async () => {
     let ec2 = new EC2({ region: argv["region"] });
     let lookup = new aws_lookups(ec2);

     if (argv.test) {
          // var vpc = await lookup.getVPCByName("test");
          // console.log(vpc?.VpcId);

          // var securitygroup = await lookup.getSecurityGroupByName("scylla");
          // console.log(securitygroup?.GroupId);

          var subnet = await lookup.getSubnetByName("scylla", "a");
          console.log(subnet);
          return;
     }

     if (argv.deploy && argv["region"]) {
          console.log("deploying a scylla node to ec2...");

          var amis : IDictionary<ami> = {};
          amis["us-west-1"] = { ami: "ami-0b56dfd38c8384abb" }; // scylla 3.1.0
          amis["us-west-2"] = { ami: "ami-0037bb3e2df934333" };

          var subnet = await lookup.getSubnetByName("graph", argv["zone"]);
          if (!subnet?.SubnetId)
               throw Error("no subnet found");

          var securitygroup = await lookup.getSecurityGroupByName("graph");
          if (!securitygroup?.GroupId)
               throw Error("no security group found");

          console.log("...using subnet.. " + subnet.SubnetId);
          console.log("...using groupid " + securitygroup?.GroupId);

          var instanceParams : EC2.RunInstancesRequest = {
               ImageId: amis[argv["region"]].ami,
               InstanceType: 't2.micro',
               KeyName: argv["key"],
               MinCount: 1,
               MaxCount: 1,
               NetworkInterfaces: [
                    {
                         DeviceIndex: 0,
                         AssociatePublicIpAddress: true,
                         SubnetId: subnet?.SubnetId,
                         DeleteOnTermination: true,
                         PrivateIpAddress: argv["ip"],
                         Groups: [
                              securitygroup?.GroupId
                         ]
                    }
               ],
               BlockDeviceMappings: [
                    {
                         DeviceName: "/dev/xvdf",
                         Ebs: {
                              Iops: 100,
                              VolumeSize: 20,
                              VolumeType: "io1",
                              DeleteOnTermination: true
                         }
                    }
               ]
          };

          var data = await ec2.runInstances(instanceParams).promise();
          if (data && data.Instances && data.Instances.length > 0) {
               console.log(data?.Instances[0]?.InstanceId);

               var instanceId : string = data.Instances[0].InstanceId!;
               console.log("Created instance", instanceId);
               let tagParams : EC2.CreateTagsRequest = {
                         Resources: [instanceId],
                         Tags: [
                              {
                                   Key: 'Name',
                                   Value: 'scylla-' + argv["zone"] + "-" + argv["ip"].slice(-2)
                              }
                         ]
                    };
               var tagdata = await ec2.createTags(tagParams).promise();
               console.log("Instance created and tagged.");
               // console.log("data", data);
          }
     }
})();