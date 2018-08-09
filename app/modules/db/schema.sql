DROP TABLE contact;

CREATE TABLE contact
(
    id serial primary key,
    email text COLLATE pg_catalog."default" NOT NULL,
    message text COLLATE pg_catalog."default",
    name text COLLATE pg_catalog."default",
    date date NOT NULL
);

DROP TABLE conversation;

CREATE TABLE conversation
(
    _id serial primary key,
    id text COLLATE pg_catalog."default",
    conversation_id text COLLATE pg_catalog."default",
    intents jsonb,
    entities jsonb,
    input jsonb,
    output jsonb,
    context jsonb,
    date timestamp with time zone
);

DROP TABLE customer;

CREATE TABLE customer
(
    _id serial primary key,
    customer_id text COLLATE pg_catalog."default",
    name text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    facebook jsonb,
    conversation jsonb
);

DROP TABLE story;

CREATE TABLE story
(
    id serial primary key,
    conversation_id text COLLATE pg_catalog."default" NOT NULL,
    internalization text COLLATE pg_catalog."default",
    externalization text COLLATE pg_catalog."default",
    date date NOT NULL
);

DROP TABLE story_template;

CREATE TABLE story_template
(
    id serial primary key,
    interview_type text COLLATE pg_catalog."default" NOT NULL,
    nodes jsonb,
    templates jsonb,
    date date NOT NULL,
);

DROP TABLE subscriber;

CREATE TABLE subscriber
(
    id serial primary key,
    email text COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL
);

DROP TABLE transcript;

CREATE TABLE transcript
(
    id serial primary key,
    conversation_id text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default",
    transcript jsonb,
    date date NOT NULL
);
