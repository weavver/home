import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};



export type Application = {
   __typename?: 'application';
  id: Scalars['Float'];
  name: Scalars['String'];
  client_id?: Maybe<Scalars['String']>;
  client_secret?: Maybe<Scalars['String']>;
  host_name?: Maybe<Scalars['String']>;
  host_email?: Maybe<Scalars['String']>;
  host_url?: Maybe<Scalars['String']>;
  name_initials: Scalars['String'];
  added_at: Scalars['DateTime'];
};

export type Application_Input = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  client_id?: Maybe<Scalars['String']>;
  client_secret?: Maybe<Scalars['String']>;
  host_name?: Maybe<Scalars['String']>;
  host_email?: Maybe<Scalars['String']>;
  host_url?: Maybe<Scalars['String']>;
};

export type Center = {
   __typename?: 'center';
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  smtp_server?: Maybe<Scalars['String']>;
  smtp_port?: Maybe<Scalars['String']>;
  smtp_user?: Maybe<Scalars['String']>;
  smtp_password: Scalars['String'];
  twilio_api_key?: Maybe<Scalars['String']>;
};

export type Center_Input = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  smtp_server?: Maybe<Scalars['String']>;
  smtp_port?: Maybe<Scalars['String']>;
  smtp_user?: Maybe<Scalars['String']>;
  smtp_password?: Maybe<Scalars['String']>;
  twilio_api_key?: Maybe<Scalars['String']>;
};


export type Filter_Input = {
  id?: Maybe<Array<Scalars['Int']>>;
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type Identities_Add = {
  email: Scalars['String'];
};

export type Identity = {
   __typename?: 'identity';
  id: Scalars['Float'];
  email: Scalars['String'];
  name_given?: Maybe<Scalars['String']>;
  name_family?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  added_at: Scalars['DateTime'];
};

export type Mutation = {
   __typename?: 'Mutation';
  centers_set: Center;
  centers_delete: Scalars['Boolean'];
  echo: Scalars['String'];
  identities_add: Identity;
  identity_property_set: Scalars['String'];
  identity_password_set: Scalars['Boolean'];
  identity_email_reset_code: Scalars['String'];
  application_getByClientId: Application;
  application_giveConsent: Oauth2_Uriparams;
  applications_set: Application;
  applications_delete: Scalars['Boolean'];
};


export type MutationCenters_SetArgs = {
  center: Center_Input;
};


export type MutationCenters_DeleteArgs = {
  center: Center_Input;
};


export type MutationEchoArgs = {
  data: Scalars['String'];
};


export type MutationIdentities_AddArgs = {
  data: Identities_Add;
};


export type MutationIdentity_Property_SetArgs = {
  value: Scalars['String'];
  property: Scalars['String'];
};


export type MutationIdentity_Password_SetArgs = {
  password_new: Scalars['String'];
  password_current: Scalars['String'];
};


export type MutationIdentity_Email_Reset_CodeArgs = {
  center_id: Scalars['Float'];
  email: Scalars['String'];
};


export type MutationApplication_GetByClientIdArgs = {
  client_id: Scalars['String'];
};


export type MutationApplication_GiveConsentArgs = {
  client_id: Scalars['String'];
};


export type MutationApplications_SetArgs = {
  application: Application_Input;
};


export type MutationApplications_DeleteArgs = {
  application: Application_Input;
};

export type Oauth2_Uriparams = {
   __typename?: 'oauth2_uriparams';
  code: Scalars['String'];
  scope: Scalars['String'];
  authuser?: Maybe<Scalars['String']>;
  hd?: Maybe<Scalars['String']>;
  prompt?: Maybe<Scalars['String']>;
};

export type Query = {
   __typename?: 'Query';
  centers?: Maybe<Array<Center>>;
  I: Identity;
  identities?: Maybe<Array<Identity>>;
  applications: Array<Application>;
};


export type QueryCentersArgs = {
  filter_input: Filter_Input;
};


export type QueryIdentitiesArgs = {
  filter_input: Filter_Input;
};


export type QueryApplicationsArgs = {
  filter_input: Filter_Input;
};

export type ApplicationsQueryVariables = {
  filter_input: Filter_Input;
};


export type ApplicationsQuery = (
  { __typename?: 'Query' }
  & { applications: Array<(
    { __typename?: 'application' }
    & Pick<Application, 'id' | 'name' | 'host_name' | 'host_url' | 'host_email' | 'client_id' | 'client_secret'>
  )> }
);

export type Applications_SetMutationVariables = {
  application: Application_Input;
};


export type Applications_SetMutation = (
  { __typename?: 'Mutation' }
  & { applications_set: (
    { __typename?: 'application' }
    & Pick<Application, 'id' | 'name' | 'host_url' | 'client_id' | 'client_secret'>
  ) }
);

export type Applications_DeleteMutationVariables = {
  application: Application_Input;
};


export type Applications_DeleteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'applications_delete'>
);

export type Application_GetByClientIdMutationVariables = {
  client_id: Scalars['String'];
};


export type Application_GetByClientIdMutation = (
  { __typename?: 'Mutation' }
  & { application_getByClientId: (
    { __typename?: 'application' }
    & Pick<Application, 'id' | 'name'>
  ) }
);

export type Application_GiveConsentMutationVariables = {
  client_id: Scalars['String'];
};


export type Application_GiveConsentMutation = (
  { __typename?: 'Mutation' }
  & { application_giveConsent: (
    { __typename?: 'oauth2_uriparams' }
    & Pick<Oauth2_Uriparams, 'code' | 'scope' | 'authuser' | 'hd' | 'prompt'>
  ) }
);

export type CentersQueryVariables = {
  filter_input: Filter_Input;
};


export type CentersQuery = (
  { __typename?: 'Query' }
  & { centers?: Maybe<Array<(
    { __typename?: 'center' }
    & Pick<Center, 'id' | 'name' | 'description'>
  )>> }
);

export type Centers_SetMutationVariables = {
  center: Center_Input;
};


export type Centers_SetMutation = (
  { __typename?: 'Mutation' }
  & { centers_set: (
    { __typename?: 'center' }
    & Pick<Center, 'id' | 'name' | 'smtp_server' | 'smtp_port' | 'smtp_password' | 'twilio_api_key'>
  ) }
);

export type Centers_DeleteMutationVariables = {
  center: Center_Input;
};


export type Centers_DeleteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'centers_delete'>
);

export type IQueryVariables = {};


export type IQuery = (
  { __typename?: 'Query' }
  & { I: (
    { __typename?: 'identity' }
    & Pick<Identity, 'id' | 'name' | 'name_given' | 'name_family' | 'email'>
  ) }
);

export type IdentitiesQueryVariables = {
  filter_input: Filter_Input;
};


export type IdentitiesQuery = (
  { __typename?: 'Query' }
  & { identities?: Maybe<Array<(
    { __typename?: 'identity' }
    & Pick<Identity, 'id' | 'name' | 'email' | 'name_given' | 'name_family'>
  )>> }
);

export type EchoMutationVariables = {
  data: Scalars['String'];
};


export type EchoMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'echo'>
);

export const ApplicationsDocument = gql`
    query applications($filter_input: filter_input!) {
  applications(filter_input: $filter_input) {
    id
    name
    host_name
    host_url
    host_email
    client_id
    client_secret
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ApplicationsGQL extends Apollo.Query<ApplicationsQuery, ApplicationsQueryVariables> {
    document = ApplicationsDocument;
    
  }
export const Applications_SetDocument = gql`
    mutation applications_set($application: application_input!) {
  applications_set(application: $application) {
    id
    name
    host_url
    client_id
    client_secret
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Applications_SetGQL extends Apollo.Mutation<Applications_SetMutation, Applications_SetMutationVariables> {
    document = Applications_SetDocument;
    
  }
export const Applications_DeleteDocument = gql`
    mutation applications_delete($application: application_input!) {
  applications_delete(application: $application)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Applications_DeleteGQL extends Apollo.Mutation<Applications_DeleteMutation, Applications_DeleteMutationVariables> {
    document = Applications_DeleteDocument;
    
  }
export const Application_GetByClientIdDocument = gql`
    mutation application_getByClientId($client_id: String!) {
  application_getByClientId(client_id: $client_id) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Application_GetByClientIdGQL extends Apollo.Mutation<Application_GetByClientIdMutation, Application_GetByClientIdMutationVariables> {
    document = Application_GetByClientIdDocument;
    
  }
export const Application_GiveConsentDocument = gql`
    mutation application_giveConsent($client_id: String!) {
  application_giveConsent(client_id: $client_id) {
    code
    scope
    authuser
    hd
    prompt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Application_GiveConsentGQL extends Apollo.Mutation<Application_GiveConsentMutation, Application_GiveConsentMutationVariables> {
    document = Application_GiveConsentDocument;
    
  }
export const CentersDocument = gql`
    query centers($filter_input: filter_input!) {
  centers(filter_input: $filter_input) {
    id
    name
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CentersGQL extends Apollo.Query<CentersQuery, CentersQueryVariables> {
    document = CentersDocument;
    
  }
export const Centers_SetDocument = gql`
    mutation centers_set($center: center_input!) {
  centers_set(center: $center) {
    id
    name
    smtp_server
    smtp_port
    smtp_password
    twilio_api_key
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Centers_SetGQL extends Apollo.Mutation<Centers_SetMutation, Centers_SetMutationVariables> {
    document = Centers_SetDocument;
    
  }
export const Centers_DeleteDocument = gql`
    mutation centers_delete($center: center_input!) {
  centers_delete(center: $center)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class Centers_DeleteGQL extends Apollo.Mutation<Centers_DeleteMutation, Centers_DeleteMutationVariables> {
    document = Centers_DeleteDocument;
    
  }
export const IDocument = gql`
    query I {
  I {
    id
    name
    name_given
    name_family
    email
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGQL extends Apollo.Query<IQuery, IQueryVariables> {
    document = IDocument;
    
  }
export const IdentitiesDocument = gql`
    query identities($filter_input: filter_input!) {
  identities(filter_input: $filter_input) {
    id
    name
    email
    name_given
    name_family
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IdentitiesGQL extends Apollo.Query<IdentitiesQuery, IdentitiesQueryVariables> {
    document = IdentitiesDocument;
    
  }
export const EchoDocument = gql`
    mutation echo($data: String!) {
  echo(data: $data)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EchoGQL extends Apollo.Mutation<EchoMutation, EchoMutationVariables> {
    document = EchoDocument;
    
  }

export const Applications = gql`
    query applications($filter_input: filter_input!) {
  applications(filter_input: $filter_input) {
    id
    name
    host_name
    host_url
    host_email
    client_id
    client_secret
  }
}
    `;
export const Applications_Set = gql`
    mutation applications_set($application: application_input!) {
  applications_set(application: $application) {
    id
    name
    host_url
    client_id
    client_secret
  }
}
    `;
export const Applications_Delete = gql`
    mutation applications_delete($application: application_input!) {
  applications_delete(application: $application)
}
    `;
export const Application_GetByClientId = gql`
    mutation application_getByClientId($client_id: String!) {
  application_getByClientId(client_id: $client_id) {
    id
    name
  }
}
    `;
export const Application_GiveConsent = gql`
    mutation application_giveConsent($client_id: String!) {
  application_giveConsent(client_id: $client_id) {
    code
    scope
    authuser
    hd
    prompt
  }
}
    `;
export const Centers = gql`
    query centers($filter_input: filter_input!) {
  centers(filter_input: $filter_input) {
    id
    name
    description
  }
}
    `;
export const Centers_Set = gql`
    mutation centers_set($center: center_input!) {
  centers_set(center: $center) {
    id
    name
    smtp_server
    smtp_port
    smtp_password
    twilio_api_key
  }
}
    `;
export const Centers_Delete = gql`
    mutation centers_delete($center: center_input!) {
  centers_delete(center: $center)
}
    `;
export const I = gql`
    query I {
  I {
    id
    name
    name_given
    name_family
    email
  }
}
    `;
export const Identities = gql`
    query identities($filter_input: filter_input!) {
  identities(filter_input: $filter_input) {
    id
    name
    email
    name_given
    name_family
  }
}
    `;
export const Echo = gql`
    mutation echo($data: String!) {
  echo(data: $data)
}
    `;