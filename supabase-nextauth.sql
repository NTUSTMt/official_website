-- Create a schema for NextAuth.js
create schema if not exists next_auth;

-- Create users table
create table if not exists next_auth.users (
    id uuid not null default uuid_generate_v4(),
    name text,
    email text,
    "emailVerified" timestamp with time zone,
    image text,
    constraint users_pkey primary key (id),
    constraint email_unique unique (email)
);

-- Create accounts table
create table if not exists next_auth.accounts (
    id uuid not null default uuid_generate_v4(),
    "userId" uuid not null,
    type text not null,
    provider text not null,
    "providerAccountId" text not null,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    constraint accounts_pkey primary key (id),
    constraint provider_unique unique (provider, "providerAccountId"),
    constraint accounts_userId_fkey foreign key ("userId") references next_auth.users (id) on delete cascade
);

-- Create sessions table
create table if not exists next_auth.sessions (
    id uuid not null default uuid_generate_v4(),
    expires timestamp with time zone not null,
    "sessionToken" text not null,
    "userId" uuid not null,
    constraint sessions_pkey primary key (id),
    constraint sessionToken_unique unique ("sessionToken"),
    constraint sessions_userId_fkey foreign key ("userId") references next_auth.users (id) on delete cascade
);

-- Create verification_tokens table
create table if not exists next_auth.verification_tokens (
    identifier text,
    token text,
    expires timestamp with time zone not null,
    constraint verification_tokens_pkey primary key (token),
    constraint token_identifier_unique unique (token, identifier)
);