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
  host_name?: Maybe<Scalars['String']>;
  host_email?: Maybe<Scalars['String']>;
  host_url?: Maybe<Scalars['String']>;
};

export type Center = {
   __typename?: 'center';
  id: Scalars['Float'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
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
  echo: Scalars['String'];
  identities_add: Identity;
  identity_property_set: Scalars['String'];
  identity_password_set: Scalars['Boolean'];
  identity_email_reset_code: Scalars['String'];
  applications_set: Scalars['Boolean'];
  applications_delete: Scalars['Boolean'];
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


export type MutationApplications_SetArgs = {
  application: Application_Input;
};


export type MutationApplications_DeleteArgs = {
  application: Application_Input;
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
    & Pick<Application, 'id' | 'name' | 'host_name'>
  )> }
);

export type Applications_SetMutationVariables = {
  application: Application_Input;
};


export type Applications_SetMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'applications_set'>
);

export type Applications_DeleteMutationVariables = {
  application: Application_Input;
};


export type Applications_DeleteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'applications_delete'>
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

export type IQueryVariables = {};


export type IQuery = (
  { __typename?: 'Query' }
  & { I: (
    { __typename?: 'identity' }
    & Pick<Identity, 'name' | 'name_given' | 'name_family' | 'email'>
  ) }
);

export type IdentitiesQueryVariables = {
  filter_input: Filter_Input;
};


export type IdentitiesQuery = (
  { __typename?: 'Query' }
  & { identities?: Maybe<Array<(
    { __typename?: 'identity' }
    & Pick<Identity, 'id' | 'email' | 'name_given' | 'name_family'>
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
  applications_set(application: $application)
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
export const IDocument = gql`
    query I {
  I {
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
  }
}
    `;
export const Applications_Set = gql`
    mutation applications_set($application: application_input!) {
  applications_set(application: $application)
}
    `;
export const Applications_Delete = gql`
    mutation applications_delete($application: application_input!) {
  applications_delete(application: $application)
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
export const I = gql`
    query I {
  I {
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