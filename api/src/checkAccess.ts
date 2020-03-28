import { MiddlewareFn } from 'type-graphql';

export const checkAccess: MiddlewareFn<any> = async ({ context }, next) => {
     console.log("checking access as middleware...");

     console.log(context);
     return next();
}

// enum Role {
//      logged_in,
//      administrator
//      anonymous,
// }