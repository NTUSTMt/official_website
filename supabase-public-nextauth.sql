-- Create users table in public schema
create table if not exists public.users (
    id uuid not null default uuid_generate_v4(),
    name text,
    email text,
    "emailVerified" timestamp with time zone,
    image text,
    constraint users_pkey primary key (id),
    constraint email_unique unique (email)
);

-- Create accounts table in public schema
create table if not exists public.accounts (
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
    constraint accounts_userId_fkey foreign key ("userId") references public.users (id) on delete cascade
);

-- Create sessions table in public schema
create table if not exists public.sessions (
    id uuid not null default uuid_generate_v4(),
    expires timestamp with time zone not null,
    "sessionToken" text not null,
    "userId" uuid not null,
    constraint sessions_pkey primary key (id),
    constraint sessionToken_unique unique ("sessionToken"),
    constraint sessions_userId_fkey foreign key ("userId") references public.users (id) on delete cascade
);

-- Create verification_tokens table in public schema
create table if not exists public.verification_tokens (
    identifier text,
    token text,
    expires timestamp with time zone not null,
    constraint verification_tokens_pkey primary key (token),
    constraint token_identifier_unique unique (token, identifier)
);