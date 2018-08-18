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

-- get conversation data set

select conversation_id,
EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) as minutes,
EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as seconds,
counter from
       (select
                conversation_id,
                (array_agg(date order by date asc))[1] as date_first_entry,
                (array_agg(date order by date asc))[count(conversation_id)] as date_last_entry,
                count(conversation_id) as counter
                from conversation group by conversation_id having count(conversation_id)>3) as x
group by conversation_id, date_last_entry, date_first_entry, counter having EXTRACT(Minutes FROM date_last_entry::timestamp - date_first_entry::timestamp)>=1

--get total count


select count(*) from (select conversation_id,
date_first_entry,
EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) as minutes,
EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as seconds,
date_last_entry,
counter from
       (select
                conversation_id,
                (array_agg(date order by date asc))[1] as date_first_entry,
                (array_agg(date order by date asc))[count(conversation_id)] as date_last_entry,
                count(conversation_id) as counter
                from conversation group by conversation_id having count(conversation_id)>3) as x
group by conversation_id, date_last_entry, date_first_entry, counter having EXTRACT(Minutes FROM date_last_entry::timestamp - date_first_entry::timestamp)>=1
) as hh

-- get avg stats

select avg(total_seconds)/60 as minutes, CAST (avg(counter) AS DOUBLE PRECISION) as counter
        from
        (select conversation_id,
        EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp) * 60 +
        EXTRACT(Seconds FROM date_last_entry::timestamp - date_first_entry::timestamp) as total_seconds,
        counter from
        (select
        conversation_id,
        (array_agg(date order by date asc))[1] as date_first_entry,
        (array_agg(date order by date asc))[count(conversation_id)] as date_last_entry,
        count(conversation_id) as counter from conversation group by conversation_id
        having count(conversation_id)>3) as x
        group by conversation_id, date_last_entry, date_first_entry, counter
        having EXTRACT(MINUTES FROM date_last_entry::timestamp - date_first_entry::timestamp)>=1) as kj