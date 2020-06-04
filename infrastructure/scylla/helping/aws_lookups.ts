import { EC2 } from 'aws-sdk';

export class aws_lookups {
     constructor (public ec2 : EC2) { }

     async getVPCByName(name : string) : Promise<EC2.Vpc | undefined> {
          var vpcs = await this.ec2.describeVpcs().promise();
          var vpc = vpcs?.Vpcs?.find(async vpc => { return await this.hasTag(vpc.Tags, "Name", name) });
          return vpc;
     }

     async getSecurityGroupByName(name : string) : Promise<EC2.SecurityGroup | undefined> {
          var securitygroups = await this.ec2.describeSecurityGroups().promise();
          var securitygroup = securitygroups?.SecurityGroups?.find(subnet => subnet.GroupName == name);
          return securitygroup;
     }

     async getSubnetByName(name : string, zone : string) : Promise<EC2.Subnet | undefined> {
          // let params: EC2.DescribeSecurityGroupsRequest = {
          //           GroupNames: [ name ]
          //      };
          var subnets = await this.ec2.describeSubnets().promise();
          if (subnets.Subnets) {
               for (var subnet of subnets?.Subnets)
               {
                    var bName = await this.hasTag(subnet.Tags, "Name", name);
                    var bOrder = await this.hasTag(subnet.Tags, "Zone", zone);

                    if (bName == true && bOrder == true) {
                         return subnet;
                    }
               }
          }
          return undefined;
     }

     async hasTag(tags : EC2.TagList | undefined, key : string, value : string) : Promise<boolean> {
          var items = tags?.filter(tag => tag.Key == key && tag.Value == value);

          if (items && items.length == 1) {
               // console.log(items, key, value);
               return true;
          }
          else {
               // console.log("not a match");
               return false;
          }
     }
}