--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: backups; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.backups (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    file_name text NOT NULL,
    file_size integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    completed_at timestamp without time zone,
    error text
);


ALTER TABLE public.backups OWNER TO neondb_owner;

--
-- Name: backups_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.backups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.backups_id_seq OWNER TO neondb_owner;

--
-- Name: backups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.backups_id_seq OWNED BY public.backups.id;


--
-- Name: newsletters; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.newsletters (
    id integer NOT NULL,
    content text NOT NULL,
    title text NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.newsletters OWNER TO neondb_owner;

--
-- Name: newsletters_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.newsletters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.newsletters_id_seq OWNER TO neondb_owner;

--
-- Name: newsletters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.newsletters_id_seq OWNED BY public.newsletters.id;


--
-- Name: post_accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.post_accounts (
    id integer NOT NULL,
    post_id integer NOT NULL,
    account_id integer NOT NULL
);


ALTER TABLE public.post_accounts OWNER TO neondb_owner;

--
-- Name: post_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.post_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_accounts_id_seq OWNER TO neondb_owner;

--
-- Name: post_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.post_accounts_id_seq OWNED BY public.post_accounts.id;


--
-- Name: post_analytics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.post_analytics (
    id integer NOT NULL,
    post_id integer NOT NULL,
    impressions integer DEFAULT 0,
    clicks integer DEFAULT 0,
    likes integer DEFAULT 0,
    shares integer DEFAULT 0,
    comments integer DEFAULT 0,
    engagement_rate integer DEFAULT 0,
    demographic_data jsonb,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.post_analytics OWNER TO neondb_owner;

--
-- Name: post_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.post_analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_analytics_id_seq OWNER TO neondb_owner;

--
-- Name: post_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.post_analytics_id_seq OWNED BY public.post_analytics.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    content text NOT NULL,
    scheduled_date timestamp without time zone NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    user_id integer NOT NULL,
    image_url text,
    account_id integer,
    last_edited_at timestamp without time zone,
    last_edited_by_user_id integer,
    platform_post_id text,
    visibility text DEFAULT 'public'::text,
    article_url text,
    post_type text DEFAULT 'post'::text,
    publish_status text DEFAULT 'draft'::text,
    failure_reason text,
    deleted_at timestamp without time zone
);


ALTER TABLE public.posts OWNER TO neondb_owner;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO neondb_owner;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: social_accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.social_accounts (
    id integer NOT NULL,
    platform text NOT NULL,
    account_name text NOT NULL,
    user_id integer NOT NULL,
    access_token text,
    refresh_token text,
    token_expires_at timestamp without time zone,
    platform_user_id text,
    platform_page_id text
);


ALTER TABLE public.social_accounts OWNER TO neondb_owner;

--
-- Name: social_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.social_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_accounts_id_seq OWNER TO neondb_owner;

--
-- Name: social_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.social_accounts_id_seq OWNED BY public.social_accounts.id;


--
-- Name: subtasks; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subtasks (
    id integer NOT NULL,
    title text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    todo_id integer NOT NULL
);


ALTER TABLE public.subtasks OWNER TO neondb_owner;

--
-- Name: subtasks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.subtasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subtasks_id_seq OWNER TO neondb_owner;

--
-- Name: subtasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.subtasks_id_seq OWNED BY public.subtasks.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    title text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    user_id integer NOT NULL,
    description text,
    assigned_to_user_id integer,
    deadline timestamp without time zone
);


ALTER TABLE public.todos OWNER TO neondb_owner;

--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todos_id_seq OWNER TO neondb_owner;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: backups id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backups ALTER COLUMN id SET DEFAULT nextval('public.backups_id_seq'::regclass);


--
-- Name: newsletters id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.newsletters ALTER COLUMN id SET DEFAULT nextval('public.newsletters_id_seq'::regclass);


--
-- Name: post_accounts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_accounts ALTER COLUMN id SET DEFAULT nextval('public.post_accounts_id_seq'::regclass);


--
-- Name: post_analytics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_analytics ALTER COLUMN id SET DEFAULT nextval('public.post_analytics_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: social_accounts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_accounts ALTER COLUMN id SET DEFAULT nextval('public.social_accounts_id_seq'::regclass);


--
-- Name: subtasks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subtasks ALTER COLUMN id SET DEFAULT nextval('public.subtasks_id_seq'::regclass);


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: backups; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.backups (id, created_at, file_name, file_size, status, completed_at, error) FROM stdin;
1	2025-03-06 11:35:04.787304	backup-2025-03-06T11-35-01-730Z.sql	0	completed	2025-03-06 11:35:10.649	\N
2	2025-03-06 11:37:50.332621	backup-2025-03-06T11-37-49-858Z.sql	0	completed	2025-03-06 11:37:53.352	\N
3	2025-03-06 11:41:08.980001	backup-2025-03-06T11-41-01-044Z.sql	0	completed	2025-03-06 11:41:22.763	\N
4	2025-03-06 14:34:52.755785	backup-2025-03-06T14-34-51-978Z.sql	0	completed	2025-03-06 14:35:11.535	\N
5	2025-03-06 15:56:40.942218	backup-2025-03-06T15-56-40-086Z.sql	0	completed	2025-03-06 15:56:46.005	\N
6	2025-03-06 16:51:38.077096	backup-2025-03-06T16-51-36-726Z.sql	0	completed	2025-03-06 16:51:57.03	\N
7	2025-03-06 17:24:14.910331	backup-2025-03-06T17-24-14-131Z.sql	0	completed	2025-03-06 17:24:31.525	\N
8	2025-03-06 17:51:02.198778	backup-2025-03-06T17-51-01-317Z.sql	0	completed	2025-03-06 17:51:18.588	\N
9	2025-03-06 18:13:51.341457	backup-2025-03-06T18-13-50-571Z.sql	0	completed	2025-03-06 18:14:04.082	\N
10	2025-03-06 18:56:08.546434	backup-2025-03-06T18-56-07-699Z.sql	0	completed	2025-03-06 18:56:24.659	\N
11	2025-03-06 19:29:10.760948	backup-2025-03-06T19-29-09-653Z.sql	0	completed	2025-03-06 19:29:15.619	\N
12	2025-03-06 21:05:24.280997	backup-2025-03-06T21-05-22-744Z.sql	0	completed	2025-03-06 21:05:42.015	\N
13	2025-03-06 22:58:30.659386	backup-2025-03-06T22-58-29-824Z.sql	0	completed	2025-03-06 22:58:48.485	\N
14	2025-03-07 00:41:34.672212	backup-2025-03-07T00-41-33-904Z.sql	0	completed	2025-03-07 00:41:46.646	\N
15	2025-03-07 01:03:46.244312	backup-2025-03-07T01-03-45-525Z.sql	0	completed	2025-03-07 01:03:58.561	\N
16	2025-03-07 02:23:51.333357	backup-2025-03-07T02-23-50-625Z.sql	0	completed	2025-03-07 02:24:05.407	\N
17	2025-03-07 04:15:59.338758	backup-2025-03-07T04-15-58-634Z.sql	0	completed	2025-03-07 04:16:05.759	\N
18	2025-03-07 05:08:54.210923	backup-2025-03-07T05-08-53-553Z.sql	0	completed	2025-03-07 05:09:11.707	\N
19	2025-03-07 07:26:48.765799	backup-2025-03-07T07-26-48-061Z.sql	0	completed	2025-03-07 07:27:05.947	\N
20	2025-03-07 08:11:00.304212	backup-2025-03-07T08-10-59-614Z.sql	0	completed	2025-03-07 08:11:16.027	\N
21	2025-03-07 09:24:59.117196	backup-2025-03-07T09-24-58-363Z.sql	0	completed	2025-03-07 09:25:21.567	\N
22	2025-03-07 09:52:45.426774	backup-2025-03-07T09-52-44-677Z.sql	0	completed	2025-03-07 09:52:50.534	\N
23	2025-03-07 10:26:23.699962	backup-2025-03-07T10-26-23-042Z.sql	0	completed	2025-03-07 10:26:29.238	\N
24	2025-03-07 10:58:43.958517	backup-2025-03-07T10-58-43-170Z.sql	0	completed	2025-03-07 10:59:08.101	\N
25	2025-03-07 11:19:13.727034	backup-2025-03-07T11-19-13-105Z.sql	0	completed	2025-03-07 11:19:31.656	\N
26	2025-03-07 13:16:31.474771	backup-2025-03-07T13-16-30-705Z.sql	0	completed	2025-03-07 13:16:52.572	\N
27	2025-03-07 13:46:32.544479	backup-2025-03-07T13-46-31-867Z.sql	0	completed	2025-03-07 13:46:47.589	\N
28	2025-03-07 14:19:59.566617	backup-2025-03-07T14-19-58-482Z.sql	0	completed	2025-03-07 14:20:03.795	\N
29	2025-03-07 14:37:16.587595	backup-2025-03-07T14-37-15-082Z.sql	0	completed	2025-03-07 14:37:20.247	\N
30	2025-03-07 14:38:05.524743	backup-2025-03-07T14-38-05-039Z.sql	0	completed	2025-03-07 14:38:08.634	\N
31	2025-03-07 15:10:17.458062	backup-2025-03-07T15-10-16-315Z.sql	0	completed	2025-03-07 15:10:35.196	\N
32	2025-03-07 15:41:58.025977	backup-2025-03-07T15-41-57-290Z.sql	0	completed	2025-03-07 15:42:19.403	\N
33	2025-03-07 16:52:03.58074	backup-2025-03-07T16-52-02-874Z.sql	0	completed	2025-03-07 16:52:08.659	\N
34	2025-03-07 18:18:49.262311	backup-2025-03-07T18-18-47-300Z.sql	0	completed	2025-03-07 18:19:08.094	\N
35	2025-03-07 20:37:12.433856	backup-2025-03-07T20-37-11-739Z.sql	0	completed	2025-03-07 20:37:18.724	\N
36	2025-03-07 21:16:51.171791	backup-2025-03-07T21-16-50-500Z.sql	0	completed	2025-03-07 21:17:09.817	\N
37	2025-03-07 22:58:29.815934	backup-2025-03-07T22-58-28-995Z.sql	0	completed	2025-03-07 22:58:40.783	\N
38	2025-03-08 00:06:31.042038	backup-2025-03-08T00-06-30-051Z.sql	0	completed	2025-03-08 00:06:36.262	\N
39	2025-03-08 00:25:34.449884	backup-2025-03-08T00-25-33-803Z.sql	0	completed	2025-03-08 00:25:56.967	\N
40	2025-03-08 01:30:41.047241	backup-2025-03-08T01-30-40-387Z.sql	0	completed	2025-03-08 01:30:58.39	\N
41	2025-03-08 02:08:47.075883	backup-2025-03-08T02-08-46-443Z.sql	0	completed	2025-03-08 02:09:09.641	\N
42	2025-03-08 02:48:28.37662	backup-2025-03-08T02-48-27-704Z.sql	0	completed	2025-03-08 02:48:46.194	\N
43	2025-03-08 03:31:31.235305	backup-2025-03-08T03-31-30-561Z.sql	0	completed	2025-03-08 03:31:36.518	\N
44	2025-03-08 06:56:33.364716	backup-2025-03-08T06-56-32-505Z.sql	0	completed	2025-03-08 06:57:03.013	\N
45	2025-03-08 07:09:12.173083	backup-2025-03-08T07-09-11-514Z.sql	0	completed	2025-03-08 07:09:16.164	\N
46	2025-03-08 07:18:44.021427	backup-2025-03-08T07-18-43-391Z.sql	0	completed	2025-03-08 07:18:48.643	\N
47	2025-03-08 08:01:21.023797	backup-2025-03-08T08-01-20-296Z.sql	0	completed	2025-03-08 08:01:45.128	\N
48	2025-03-08 08:23:36.550473	backup-2025-03-08T08-23-35-833Z.sql	0	completed	2025-03-08 08:24:00.472	\N
49	2025-03-08 09:05:49.313324	backup-2025-03-08T09-05-48-663Z.sql	0	completed	2025-03-08 09:06:12.654	\N
50	2025-03-08 09:38:32.681363	backup-2025-03-08T09-38-31-923Z.sql	0	completed	2025-03-08 09:38:53.595	\N
51	2025-03-08 11:16:38.643953	backup-2025-03-08T11-16-37-903Z.sql	0	completed	2025-03-08 11:16:59.239	\N
52	2025-03-08 11:48:44.168164	backup-2025-03-08T11-48-43-494Z.sql	0	completed	2025-03-08 11:49:06.432	\N
53	2025-03-08 12:50:19.906465	backup-2025-03-08T12-50-19-215Z.sql	0	completed	2025-03-08 12:50:40.126	\N
54	2025-03-08 13:26:50.313179	backup-2025-03-08T13-26-49-703Z.sql	0	completed	2025-03-08 13:27:12.265	\N
55	2025-03-08 14:11:18.330134	backup-2025-03-08T14-11-17-782Z.sql	0	completed	2025-03-08 14:11:39.89	\N
56	2025-03-08 16:08:46.650904	backup-2025-03-08T16-08-46-042Z.sql	0	completed	2025-03-08 16:09:12.462	\N
57	2025-03-08 17:13:36.284317	backup-2025-03-08T17-13-35-579Z.sql	0	completed	2025-03-08 17:14:00.176	\N
58	2025-03-08 19:28:35.623469	backup-2025-03-08T19-28-34-890Z.sql	0	completed	2025-03-08 19:29:02.622	\N
59	2025-03-08 20:03:40.600345	backup-2025-03-08T20-03-39-772Z.sql	0	completed	2025-03-08 20:03:59.963	\N
60	2025-03-08 20:45:34.462242	backup-2025-03-08T20-45-33-822Z.sql	0	completed	2025-03-08 20:45:55.573	\N
61	2025-03-08 22:23:37.064448	backup-2025-03-08T22-23-36-017Z.sql	0	completed	2025-03-08 22:23:49.94	\N
62	2025-03-08 23:01:00.233924	backup-2025-03-08T23-00-59-583Z.sql	0	completed	2025-03-08 23:01:24.822	\N
63	2025-03-09 01:01:51.821763	backup-2025-03-09T01-01-51-179Z.sql	0	completed	2025-03-09 01:01:56.983	\N
64	2025-03-09 02:31:48.042146	backup-2025-03-09T02-31-47-422Z.sql	0	completed	2025-03-09 02:32:11.465	\N
65	2025-03-09 03:00:05.329185	backup-2025-03-09T03-00-00-965Z.sql	0	completed	2025-03-09 03:00:13.664	\N
66	2025-03-09 04:16:37.165283	backup-2025-03-09T04-16-36-327Z.sql	0	completed	2025-03-09 04:16:50.425	\N
67	2025-03-09 05:18:48.364388	backup-2025-03-09T05-18-47-589Z.sql	0	completed	2025-03-09 05:19:09.981	\N
68	2025-03-09 05:40:09.570796	backup-2025-03-09T05-40-08-728Z.sql	0	completed	2025-03-09 05:40:33.916	\N
69	2025-03-09 05:56:24.213183	backup-2025-03-09T05-56-23-549Z.sql	0	completed	2025-03-09 05:56:45.339	\N
70	2025-03-09 06:21:38.807497	backup-2025-03-09T06-21-38-117Z.sql	0	completed	2025-03-09 06:22:07.631	\N
71	2025-03-09 07:18:23.974214	backup-2025-03-09T07-18-23-286Z.sql	0	completed	2025-03-09 07:18:49.506	\N
72	2025-03-09 08:34:01.018642	backup-2025-03-09T08-34-00-337Z.sql	0	completed	2025-03-09 08:34:23.629	\N
73	2025-03-09 09:06:25.984169	backup-2025-03-09T09-06-25-349Z.sql	0	completed	2025-03-09 09:06:54.564	\N
74	2025-03-09 09:41:02.488443	backup-2025-03-09T09-41-01-823Z.sql	0	completed	2025-03-09 09:41:28.271	\N
75	2025-03-09 11:11:24.544968	backup-2025-03-09T11-11-23-808Z.sql	0	completed	2025-03-09 11:11:43.976	\N
76	2025-03-09 11:43:47.552155	backup-2025-03-09T11-43-45-495Z.sql	0	completed	2025-03-09 11:44:11.141	\N
77	2025-03-09 15:21:12.765449	backup-2025-03-09T15-21-12-083Z.sql	0	completed	2025-03-09 15:21:42.036	\N
78	2025-03-09 16:04:29.851535	backup-2025-03-09T16-04-29-211Z.sql	0	completed	2025-03-09 16:04:50.007	\N
79	2025-03-09 18:13:47.856785	backup-2025-03-09T18-13-47-213Z.sql	0	completed	2025-03-09 18:14:08.993	\N
80	2025-03-09 19:26:44.858629	backup-2025-03-09T19-26-44-247Z.sql	0	completed	2025-03-09 19:27:06.513	\N
81	2025-03-09 22:09:01.817342	backup-2025-03-09T22-09-00-887Z.sql	0	completed	2025-03-09 22:09:21.711	\N
82	2025-03-09 22:48:47.617937	backup-2025-03-09T22-48-46-947Z.sql	0	completed	2025-03-09 22:49:05.201	\N
83	2025-03-09 23:15:23.254548	backup-2025-03-09T23-15-22-570Z.sql	0	completed	2025-03-09 23:15:44.067	\N
84	2025-03-10 00:54:57.166949	backup-2025-03-10T00-54-56-486Z.sql	0	completed	2025-03-10 00:55:13.724	\N
85	2025-03-10 01:18:37.837639	backup-2025-03-10T01-18-36-877Z.sql	0	completed	2025-03-10 01:19:07.124	\N
86	2025-03-10 02:08:29.246441	backup-2025-03-10T02-08-28-647Z.sql	0	completed	2025-03-10 02:08:49.874	\N
87	2025-03-10 02:45:42.001985	backup-2025-03-10T02-45-41-333Z.sql	0	completed	2025-03-10 02:46:01.294	\N
88	2025-03-10 03:08:21.465449	backup-2025-03-10T03-08-20-815Z.sql	0	completed	2025-03-10 03:08:43.478	\N
89	2025-03-10 03:39:05.927799	backup-2025-03-10T03-39-05-260Z.sql	0	completed	2025-03-10 03:39:25.708	\N
90	2025-03-10 04:44:43.698477	backup-2025-03-10T04-44-43-036Z.sql	0	completed	2025-03-10 04:45:05.369	\N
91	2025-03-10 05:51:27.351469	backup-2025-03-10T05-51-26-668Z.sql	0	completed	2025-03-10 05:51:45.154	\N
92	2025-03-10 06:54:03.823243	backup-2025-03-10T06-54-03-138Z.sql	0	completed	2025-03-10 06:54:25.121	\N
93	2025-03-10 08:33:46.672106	backup-2025-03-10T08-33-46-033Z.sql	0	completed	2025-03-10 08:34:06.047	\N
94	2025-03-10 10:43:29.997825	backup-2025-03-10T10-43-29-361Z.sql	0	completed	2025-03-10 10:43:52.948	\N
95	2025-03-10 11:40:22.149157	backup-2025-03-10T11-40-21-493Z.sql	0	completed	2025-03-10 11:40:45.14	\N
96	2025-03-10 12:13:38.477874	backup-2025-03-10T12-13-37-758Z.sql	0	completed	2025-03-10 12:13:53.193	\N
97	2025-03-10 12:29:09.097842	backup-2025-03-10T12-29-08-394Z.sql	0	completed	2025-03-10 12:29:31.63	\N
98	2025-03-10 13:13:58.484757	backup-2025-03-10T13-13-57-675Z.sql	0	completed	2025-03-10 13:14:23.154	\N
99	2025-03-10 14:26:37.002423	backup-2025-03-10T14-26-35-795Z.sql	0	completed	2025-03-10 14:26:52.288	\N
100	2025-03-10 15:34:55.782089	backup-2025-03-10T15-34-55-051Z.sql	0	completed	2025-03-10 15:35:22.227	\N
101	2025-03-10 17:02:10.264632	backup-2025-03-10T17-02-09-602Z.sql	0	completed	2025-03-10 17:02:33.229	\N
102	2025-03-10 17:56:29.841856	backup-2025-03-10T17-56-29-188Z.sql	0	completed	2025-03-10 17:56:47.905	\N
103	2025-03-10 18:31:41.431097	backup-2025-03-10T18-31-40-545Z.sql	0	completed	2025-03-10 18:32:08.476	\N
104	2025-03-10 18:53:47.163952	backup-2025-03-10T18-53-46-425Z.sql	0	completed	2025-03-10 18:54:06.998	\N
105	2025-03-10 19:26:30.283219	backup-2025-03-10T19-26-29-448Z.sql	0	completed	2025-03-10 19:26:58.976	\N
106	2025-03-10 19:49:02.33981	backup-2025-03-10T19-49-01-650Z.sql	0	completed	2025-03-10 19:49:29.607	\N
107	2025-03-10 20:08:44.808875	backup-2025-03-10T20-08-44-144Z.sql	0	completed	2025-03-10 20:09:02.56	\N
108	2025-03-10 20:30:15.405928	backup-2025-03-10T20-30-14-539Z.sql	0	completed	2025-03-10 20:30:42.765	\N
109	2025-03-10 21:05:49.899549	backup-2025-03-10T21-05-49-226Z.sql	0	completed	2025-03-10 21:06:11.235	\N
110	2025-03-10 21:41:33.356566	backup-2025-03-10T21-41-32-589Z.sql	0	completed	2025-03-10 21:41:54.478	\N
111	2025-03-10 22:33:42.750185	backup-2025-03-10T22-33-42-138Z.sql	0	completed	2025-03-10 22:34:08.316	\N
112	2025-03-10 23:29:13.918257	backup-2025-03-10T23-29-13-265Z.sql	0	completed	2025-03-10 23:29:34.49	\N
113	2025-03-11 00:41:59.64166	backup-2025-03-11T00-41-58-984Z.sql	0	completed	2025-03-11 00:42:13.755	\N
114	2025-03-11 01:22:17.961981	backup-2025-03-11T01-22-17-267Z.sql	0	completed	2025-03-11 01:22:37.501	\N
115	2025-03-11 02:12:31.282107	backup-2025-03-11T02-12-30-606Z.sql	0	completed	2025-03-11 02:12:52.215	\N
116	2025-03-11 02:36:33.157953	backup-2025-03-11T02-36-32-530Z.sql	0	completed	2025-03-11 02:36:53.596	\N
117	2025-03-11 06:20:29.548278	backup-2025-03-11T06-20-28-853Z.sql	0	completed	2025-03-11 06:20:52.223	\N
118	2025-03-11 07:21:25.162799	backup-2025-03-11T07-21-24-472Z.sql	0	completed	2025-03-11 07:21:48.326	\N
119	2025-03-11 07:54:47.939995	backup-2025-03-11T07-54-47-274Z.sql	0	completed	2025-03-11 07:55:18.822	\N
120	2025-03-11 10:09:23.426884	backup-2025-03-11T10-09-22-768Z.sql	0	completed	2025-03-11 10:09:44.49	\N
121	2025-03-11 10:56:34.666055	backup-2025-03-11T10-56-34-001Z.sql	0	completed	2025-03-11 10:56:52.888	\N
122	2025-03-11 12:15:27.894215	backup-2025-03-11T12-15-27-095Z.sql	0	completed	2025-03-11 12:15:48.936	\N
123	2025-03-11 12:34:22.574912	backup-2025-03-11T12-34-21-806Z.sql	0	completed	2025-03-11 12:34:34.297	\N
124	2025-03-11 13:27:38.779201	backup-2025-03-11T13-27-37-957Z.sql	0	completed	2025-03-11 13:27:56.788	\N
125	2025-03-11 15:02:34.484039	backup-2025-03-11T15-02-33-809Z.sql	0	completed	2025-03-11 15:03:05.432	\N
126	2025-03-11 17:16:38.661221	backup-2025-03-11T17-16-37-999Z.sql	0	completed	2025-03-11 17:17:03.896	\N
127	2025-03-11 17:37:11.198037	backup-2025-03-11T17-37-10-494Z.sql	0	completed	2025-03-11 17:37:33.669	\N
128	2025-03-11 18:44:32.606073	backup-2025-03-11T18-44-31-914Z.sql	0	completed	2025-03-11 18:44:56.354	\N
129	2025-03-11 19:39:59.02794	backup-2025-03-11T19-39-58-346Z.sql	0	completed	2025-03-11 19:40:23.433	\N
130	2025-03-11 20:54:39.941661	backup-2025-03-11T20-54-39-148Z.sql	0	completed	2025-03-11 20:55:04.421	\N
131	2025-03-11 21:52:51.459249	backup-2025-03-11T21-52-50-255Z.sql	0	completed	2025-03-11 21:53:13.34	\N
132	2025-03-11 22:30:06.888385	backup-2025-03-11T22-30-05-127Z.sql	0	completed	2025-03-11 22:30:40.151	\N
133	2025-03-12 00:50:53.407742	backup-2025-03-12T00-50-52-652Z.sql	0	completed	2025-03-12 00:51:12.096	\N
134	2025-03-12 01:42:01.87366	backup-2025-03-12T01-42-01-203Z.sql	0	completed	2025-03-12 01:42:22.611	\N
135	2025-03-12 03:02:32.243885	backup-2025-03-12T03-02-31-611Z.sql	0	completed	2025-03-12 03:02:57.268	\N
136	2025-03-12 05:14:00.323057	backup-2025-03-12T05-13-59-638Z.sql	0	completed	2025-03-12 05:14:38.183	\N
137	2025-03-12 05:41:22.460135	backup-2025-03-12T05-41-21-827Z.sql	0	completed	2025-03-12 05:41:47.365	\N
138	2025-03-12 06:09:33.342537	backup-2025-03-12T06-09-32-754Z.sql	0	completed	2025-03-12 06:09:55.432	\N
139	2025-03-12 07:07:24.431296	backup-2025-03-12T07-07-23-752Z.sql	0	completed	2025-03-12 07:07:52.259	\N
140	2025-03-12 07:39:52.246331	backup-2025-03-12T07-39-51-605Z.sql	0	completed	2025-03-12 07:40:19.879	\N
141	2025-03-12 09:26:21.422588	backup-2025-03-12T09-26-20-741Z.sql	0	completed	2025-03-12 09:26:44.741	\N
142	2025-03-12 10:45:35.881392	backup-2025-03-12T10-45-35-034Z.sql	0	completed	2025-03-12 10:46:00.297	\N
143	2025-03-12 11:01:23.360083	backup-2025-03-12T11-01-22-781Z.sql	0	completed	2025-03-12 11:01:48.676	\N
144	2025-03-12 11:32:20.133274	backup-2025-03-12T11-32-19-417Z.sql	0	completed	2025-03-12 11:32:44.792	\N
145	2025-03-12 11:59:50.481234	backup-2025-03-12T11-59-49-749Z.sql	0	completed	2025-03-12 12:00:20.436	\N
146	2025-03-12 12:17:23.598227	backup-2025-03-12T12-17-22-889Z.sql	0	completed	2025-03-12 12:17:28.519	\N
147	2025-03-12 13:09:32.926807	backup-2025-03-12T13-09-32-142Z.sql	0	completed	2025-03-12 13:09:47.844	\N
148	2025-03-12 13:49:05.26868	backup-2025-03-12T13-49-04-645Z.sql	0	completed	2025-03-12 13:49:28.035	\N
149	2025-03-12 14:29:36.092185	backup-2025-03-12T14-29-35-298Z.sql	0	completed	2025-03-12 14:29:54.504	\N
150	2025-03-12 16:59:49.910247	backup-2025-03-12T16-59-49-207Z.sql	0	completed	2025-03-12 17:00:13.606	\N
151	2025-03-12 17:49:27.729902	backup-2025-03-12T17-49-27-020Z.sql	0	completed	2025-03-12 17:49:54.345	\N
152	2025-03-12 18:39:39.536329	backup-2025-03-12T18-39-38-815Z.sql	0	completed	2025-03-12 18:39:44.7	\N
153	2025-03-12 21:30:17.624559	backup-2025-03-12T21-30-16-941Z.sql	0	completed	2025-03-12 21:30:36.362	\N
154	2025-03-12 23:05:54.393633	backup-2025-03-12T23-05-53-588Z.sql	0	completed	2025-03-12 23:06:12.976	\N
155	2025-03-12 23:35:24.071659	backup-2025-03-12T23-35-22-761Z.sql	0	completed	2025-03-12 23:35:42.283	\N
156	2025-03-13 00:34:28.77295	backup-2025-03-13T00-34-28-100Z.sql	0	completed	2025-03-13 00:35:00.571	\N
157	2025-03-13 00:56:58.936306	backup-2025-03-13T00-56-58-251Z.sql	0	completed	2025-03-13 00:57:21.128	\N
158	2025-03-13 01:52:19.900052	backup-2025-03-13T01-52-19-220Z.sql	0	completed	2025-03-13 01:52:41.158	\N
159	2025-03-13 03:34:29.716281	backup-2025-03-13T03-34-29-047Z.sql	0	completed	2025-03-13 03:34:58.836	\N
160	2025-03-13 04:19:12.437167	backup-2025-03-13T04-19-11-785Z.sql	0	completed	2025-03-13 04:19:30.547	\N
161	2025-03-13 04:47:06.825884	backup-2025-03-13T04-47-05-684Z.sql	0	completed	2025-03-13 04:47:29.689	\N
162	2025-03-13 05:14:26.271206	backup-2025-03-13T05-14-25-565Z.sql	0	completed	2025-03-13 05:14:44.4	\N
163	2025-03-13 05:46:13.212551	backup-2025-03-13T05-46-12-452Z.sql	0	completed	2025-03-13 05:46:27.431	\N
164	2025-03-13 06:11:46.382986	backup-2025-03-13T06-11-45-722Z.sql	0	completed	2025-03-13 06:12:09.502	\N
165	2025-03-13 06:34:58.003152	backup-2025-03-13T06-34-57-295Z.sql	0	completed	2025-03-13 06:35:14.565	\N
166	2025-03-13 07:04:32.248573	backup-2025-03-13T07-04-31-573Z.sql	0	completed	2025-03-13 07:04:51.582	\N
167	2025-03-13 08:35:30.449159	backup-2025-03-13T08-35-29-753Z.sql	0	completed	2025-03-13 08:35:49.891	\N
168	2025-03-13 09:40:38.396971	backup-2025-03-13T09-40-37-681Z.sql	0	completed	2025-03-13 09:40:59.504	\N
169	2025-03-13 10:14:13.186142	backup-2025-03-13T10-14-12-516Z.sql	0	completed	2025-03-13 10:14:35.381	\N
170	2025-03-13 13:19:18.04351	backup-2025-03-13T13-19-17-448Z.sql	0	completed	2025-03-13 13:19:40.965	\N
171	2025-03-13 14:31:25.617497	backup-2025-03-13T14-31-24-967Z.sql	0	completed	2025-03-13 14:31:46.642	\N
172	2025-03-13 15:42:31.572288	backup-2025-03-13T15-42-30-932Z.sql	0	completed	2025-03-13 15:42:51.224	\N
173	2025-03-13 16:27:25.159754	backup-2025-03-13T16-27-24-484Z.sql	0	completed	2025-03-13 16:27:30.087	\N
174	2025-03-13 17:12:27.831651	backup-2025-03-13T17-12-27-205Z.sql	0	completed	2025-03-13 17:12:49.171	\N
175	2025-03-13 20:27:27.631806	backup-2025-03-13T20-27-26-981Z.sql	0	completed	2025-03-13 20:27:47.764	\N
176	2025-03-13 21:33:02.836571	backup-2025-03-13T21-33-02-164Z.sql	0	completed	2025-03-13 21:33:26.456	\N
177	2025-03-13 22:01:55.177865	backup-2025-03-13T22-01-54-495Z.sql	0	completed	2025-03-13 22:02:13.965	\N
178	2025-03-13 23:47:26.623764	backup-2025-03-13T23-47-25-959Z.sql	0	completed	2025-03-13 23:47:32.064	\N
179	2025-03-14 00:21:04.283	backup-2025-03-14T00-21-03-632Z.sql	0	completed	2025-03-14 00:21:09.53	\N
180	2025-03-14 00:39:17.720651	backup-2025-03-14T00-39-17-092Z.sql	0	completed	2025-03-14 00:39:43.869	\N
181	2025-03-14 01:45:22.196679	backup-2025-03-14T01-45-21-414Z.sql	0	completed	2025-03-14 01:45:27.367	\N
182	2025-03-14 02:40:11.721926	backup-2025-03-14T02-40-11-063Z.sql	0	completed	2025-03-14 02:40:32.191	\N
183	2025-03-14 03:19:09.369772	backup-2025-03-14T03-19-08-603Z.sql	0	completed	2025-03-14 03:19:31.929	\N
184	2025-03-14 03:41:39.715748	backup-2025-03-14T03-41-38-955Z.sql	0	completed	2025-03-14 03:41:53.782	\N
185	2025-03-14 04:30:51.523403	backup-2025-03-14T04-30-50-880Z.sql	0	completed	2025-03-14 04:31:12.945	\N
186	2025-03-14 04:47:24.791268	backup-2025-03-14T04-47-24-182Z.sql	0	completed	2025-03-14 04:47:51.831	\N
187	2025-03-14 05:59:21.816297	backup-2025-03-14T05-59-21-132Z.sql	0	completed	2025-03-14 05:59:40.952	\N
188	2025-03-14 06:21:10.963208	backup-2025-03-14T06-21-10-233Z.sql	0	completed	2025-03-14 06:21:38.24	\N
189	2025-03-14 07:52:09.522186	backup-2025-03-14T07-52-08-864Z.sql	0	completed	2025-03-14 07:52:30.172	\N
190	2025-03-14 08:22:17.903199	backup-2025-03-14T08-22-17-237Z.sql	0	completed	2025-03-14 08:22:45.029	\N
191	2025-03-14 09:06:13.185363	backup-2025-03-14T09-06-12-508Z.sql	0	completed	2025-03-14 09:06:41.104	\N
192	2025-03-14 10:35:20.724856	backup-2025-03-14T10-35-19-771Z.sql	0	completed	2025-03-14 10:35:46.582	\N
193	2025-03-14 11:24:24.935883	backup-2025-03-14T11-24-24-286Z.sql	0	completed	2025-03-14 11:24:45.749	\N
194	2025-03-14 11:44:19.434413	backup-2025-03-14T11-44-18-751Z.sql	0	completed	2025-03-14 11:44:43.579	\N
195	2025-03-14 12:54:04.713105	backup-2025-03-14T12-54-04-038Z.sql	0	completed	2025-03-14 12:54:25.1	\N
196	2025-03-14 15:26:33.762093	backup-2025-03-14T15-26-32-932Z.sql	0	completed	2025-03-14 15:26:46.526	\N
197	2025-03-14 16:21:01.444939	backup-2025-03-14T16-21-00-098Z.sql	0	completed	2025-03-14 16:21:27.756	\N
198	2025-03-14 18:15:05.70196	backup-2025-03-14T18-15-04-719Z.sql	0	completed	2025-03-14 18:15:33.93	\N
199	2025-03-14 19:06:50.841015	backup-2025-03-14T19-06-50-186Z.sql	0	completed	2025-03-14 19:07:09.93	\N
200	2025-03-14 20:48:32.247209	backup-2025-03-14T20-48-31-568Z.sql	0	completed	2025-03-14 20:48:37.163	\N
201	2025-03-14 21:09:38.032366	backup-2025-03-14T21-09-37-429Z.sql	0	completed	2025-03-14 21:10:01.944	\N
202	2025-03-14 22:22:31.384889	backup-2025-03-14T22-22-30-796Z.sql	0	completed	2025-03-14 22:22:56.669	\N
203	2025-03-14 22:47:26.067016	backup-2025-03-14T22-47-25-446Z.sql	0	completed	2025-03-14 22:47:51.987	\N
204	2025-03-14 23:11:44.759318	backup-2025-03-14T23-11-44-176Z.sql	0	completed	2025-03-14 23:12:10.184	\N
205	2025-03-14 23:57:21.533698	backup-2025-03-14T23-57-20-918Z.sql	0	completed	2025-03-14 23:57:35.01	\N
206	2025-03-15 00:49:17.649457	backup-2025-03-15T00-49-17-070Z.sql	0	completed	2025-03-15 00:49:34.957	\N
207	2025-03-15 02:17:31.64207	backup-2025-03-15T02-17-31-053Z.sql	0	completed	2025-03-15 02:17:49.836	\N
208	2025-03-15 03:35:51.998533	backup-2025-03-15T03-35-51-324Z.sql	0	completed	2025-03-15 03:36:13.239	\N
209	2025-03-15 05:52:27.031169	backup-2025-03-15T05-52-26-431Z.sql	0	completed	2025-03-15 05:52:54.683	\N
210	2025-03-15 06:16:43.500869	backup-2025-03-15T06-16-42-687Z.sql	0	completed	2025-03-15 06:17:05.462	\N
211	2025-03-15 06:47:28.462803	backup-2025-03-15T06-47-27-892Z.sql	0	completed	2025-03-15 06:47:42.774	\N
212	2025-03-15 08:04:00.968621	backup-2025-03-15T08-04-00-339Z.sql	0	completed	2025-03-15 08:04:23.082	\N
213	2025-03-15 08:27:30.803645	backup-2025-03-15T08-27-30-160Z.sql	0	completed	2025-03-15 08:27:53.134	\N
214	2025-03-15 09:29:54.757289	backup-2025-03-15T09-29-54-144Z.sql	0	completed	2025-03-15 09:30:17.331	\N
215	2025-03-15 11:07:30.959514	backup-2025-03-15T11-07-30-231Z.sql	0	completed	2025-03-15 11:07:49.468	\N
216	2025-03-15 12:31:02.206099	backup-2025-03-15T12-31-01-520Z.sql	0	completed	2025-03-15 12:31:34.656	\N
217	2025-03-15 13:54:31.513137	backup-2025-03-15T13-54-30-878Z.sql	0	completed	2025-03-15 13:54:53.702	\N
218	2025-03-15 14:22:56.510994	backup-2025-03-15T14-22-55-877Z.sql	0	completed	2025-03-15 14:23:17.439	\N
219	2025-03-15 15:25:45.663958	backup-2025-03-15T15-25-44-992Z.sql	0	completed	2025-03-15 15:26:06.51	\N
220	2025-03-15 15:41:36.074214	backup-2025-03-15T15-41-35-384Z.sql	0	completed	2025-03-15 15:42:04.579	\N
221	2025-03-15 16:17:06.665889	backup-2025-03-15T16-17-06-058Z.sql	0	completed	2025-03-15 16:17:27.745	\N
222	2025-03-15 16:47:22.578161	backup-2025-03-15T16-47-21-901Z.sql	0	completed	2025-03-15 16:47:49.651	\N
223	2025-03-15 17:07:14.803523	backup-2025-03-15T17-07-13-944Z.sql	0	completed	2025-03-15 17:07:28.787	\N
224	2025-03-15 18:02:40.924794	backup-2025-03-15T18-02-40-362Z.sql	0	completed	2025-03-15 18:03:00.347	\N
225	2025-03-15 18:42:06.199087	backup-2025-03-15T18-42-05-514Z.sql	0	completed	2025-03-15 18:42:21.985	\N
226	2025-03-15 18:59:30.552573	backup-2025-03-15T18-59-29-930Z.sql	0	completed	2025-03-15 18:59:56.264	\N
227	2025-03-15 19:19:24.642052	backup-2025-03-15T19-19-24-035Z.sql	0	completed	2025-03-15 19:19:38.153	\N
228	2025-03-15 20:20:55.519801	backup-2025-03-15T20-20-54-893Z.sql	0	completed	2025-03-15 20:21:21.932	\N
229	2025-03-15 20:56:04.704493	backup-2025-03-15T20-56-04-054Z.sql	0	completed	2025-03-15 20:56:25.773	\N
230	2025-03-15 21:19:02.362853	backup-2025-03-15T21-19-01-751Z.sql	0	completed	2025-03-15 21:19:24.197	\N
231	2025-03-15 22:07:30.661993	backup-2025-03-15T22-07-30-073Z.sql	0	completed	2025-03-15 22:07:52.101	\N
232	2025-03-15 22:54:19.587257	backup-2025-03-15T22-54-19-008Z.sql	0	completed	2025-03-15 22:54:38.096	\N
233	2025-03-15 23:22:00.826208	backup-2025-03-15T23-22-00-064Z.sql	0	completed	2025-03-15 23:22:26.054	\N
234	2025-03-15 23:45:26.659694	backup-2025-03-15T23-45-26-073Z.sql	0	completed	2025-03-15 23:45:52.541	\N
235	2025-03-16 00:29:04.292225	backup-2025-03-16T00-29-01-615Z.sql	0	completed	2025-03-16 00:29:27.731	\N
236	2025-03-16 01:35:03.731806	backup-2025-03-16T01-35-03-015Z.sql	0	completed	2025-03-16 01:35:18.113	\N
237	2025-03-16 02:06:59.116897	backup-2025-03-16T02-06-58-499Z.sql	0	completed	2025-03-16 02:07:18.292	\N
238	2025-03-16 02:47:10.227297	backup-2025-03-16T02-47-09-517Z.sql	0	completed	2025-03-16 02:47:26.955	\N
239	2025-03-16 03:00:05.698944	backup-2025-03-16T03-00-00-749Z.sql	0	completed	2025-03-16 03:00:13.216	\N
240	2025-03-16 04:21:43.303471	backup-2025-03-16T04-21-42-466Z.sql	0	completed	2025-03-16 04:22:06.563	\N
241	2025-03-16 04:41:22.598509	backup-2025-03-16T04-41-21-983Z.sql	0	completed	2025-03-16 04:41:45.637	\N
242	2025-03-16 06:46:48.0128	backup-2025-03-16T06-46-47-345Z.sql	0	completed	2025-03-16 06:47:11.256	\N
243	2025-03-16 08:01:17.499021	backup-2025-03-16T08-01-16-945Z.sql	0	completed	2025-03-16 08:01:38.111	\N
244	2025-03-16 08:46:08.190737	backup-2025-03-16T08-46-07-572Z.sql	0	completed	2025-03-16 08:46:30.69	\N
245	2025-03-16 09:02:00.319386	backup-2025-03-16T09-01-59-161Z.sql	0	completed	2025-03-16 09:02:22.813	\N
246	2025-03-16 09:25:13.860271	backup-2025-03-16T09-25-12-908Z.sql	0	completed	2025-03-16 09:25:38.653	\N
247	2025-03-16 10:19:20.359733	backup-2025-03-16T10-19-19-763Z.sql	0	completed	2025-03-16 10:19:42.902	\N
248	2025-03-16 11:14:33.156426	backup-2025-03-16T11-14-32-597Z.sql	0	completed	2025-03-16 11:14:56.932	\N
249	2025-03-16 11:39:26.462673	backup-2025-03-16T11-39-25-878Z.sql	0	completed	2025-03-16 11:39:33.245	\N
250	2025-03-16 13:14:31.525035	backup-2025-03-16T13-14-30-811Z.sql	0	completed	2025-03-16 13:14:53.763	\N
251	2025-03-16 13:51:04.525988	backup-2025-03-16T13-51-03-838Z.sql	0	completed	2025-03-16 13:51:22.46	\N
252	2025-03-16 14:53:23.561669	backup-2025-03-16T14-53-22-954Z.sql	0	completed	2025-03-16 14:53:27.673	\N
253	2025-03-16 16:07:27.642402	backup-2025-03-16T16-07-27-022Z.sql	0	completed	2025-03-16 16:07:48.091	\N
254	2025-03-16 16:25:07.887033	backup-2025-03-16T16-25-07-090Z.sql	0	completed	2025-03-16 16:25:31.455	\N
255	2025-03-16 18:07:23.586953	backup-2025-03-16T18-07-22-586Z.sql	0	completed	2025-03-16 18:07:42.835	\N
256	2025-03-16 18:44:16.447793	backup-2025-03-16T18-44-15-805Z.sql	0	completed	2025-03-16 18:44:41.975	\N
257	2025-03-16 19:52:25.317828	backup-2025-03-16T19-52-24-543Z.sql	0	completed	2025-03-16 19:52:48.639	\N
258	2025-03-16 20:35:35.991624	backup-2025-03-16T20-35-34-983Z.sql	0	completed	2025-03-16 20:35:57.204	\N
259	2025-03-16 22:45:24.001031	backup-2025-03-16T22-45-23-201Z.sql	0	completed	2025-03-16 22:45:52.359	\N
260	2025-03-16 23:14:52.248974	backup-2025-03-16T23-14-51-636Z.sql	0	completed	2025-03-16 23:15:12.323	\N
261	2025-03-17 00:19:23.966012	backup-2025-03-17T00-19-23-026Z.sql	0	completed	2025-03-17 00:19:41.608	\N
262	2025-03-17 01:06:46.451281	backup-2025-03-17T01-06-45-856Z.sql	0	completed	2025-03-17 01:06:59.681	\N
263	2025-03-17 01:57:34.092032	backup-2025-03-17T01-57-33-479Z.sql	0	completed	2025-03-17 01:58:02.916	\N
264	2025-03-17 03:15:37.621233	backup-2025-03-17T03-15-36-831Z.sql	0	completed	2025-03-17 03:15:56.878	\N
265	2025-03-17 04:09:33.085024	backup-2025-03-17T04-09-32-465Z.sql	0	completed	2025-03-17 04:09:53.107	\N
266	2025-03-17 05:39:27.845661	backup-2025-03-17T05-39-27-245Z.sql	0	completed	2025-03-17 05:39:54.34	\N
267	2025-03-17 06:11:13.985498	backup-2025-03-17T06-11-13-366Z.sql	0	completed	2025-03-17 06:11:54.233	\N
268	2025-03-17 06:35:44.297153	backup-2025-03-17T06-35-43-705Z.sql	0	completed	2025-03-17 06:36:03.955	\N
269	2025-03-17 06:54:21.503304	backup-2025-03-17T06-54-20-740Z.sql	0	completed	2025-03-17 06:54:41.162	\N
270	2025-03-17 07:06:16.532718	backup-2025-03-17T07-06-15-004Z.sql	0	completed	2025-03-17 07:06:19.862	\N
271	2025-03-17 07:13:42.539433	backup-2025-03-17T07-13-39-249Z.sql	0	completed	2025-03-17 07:13:46.122	\N
272	2025-03-17 07:14:54.289678	backup-2025-03-17T07-14-40-863Z.sql	0	completed	2025-03-17 07:15:05.071	\N
273	2025-03-17 07:19:35.757098	backup-2025-03-17T07-19-32-730Z.sql	0	pending	\N	\N
\.


--
-- Data for Name: newsletters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.newsletters (id, content, title, user_id) FROM stdin;
4	siehe geplante Posts 24.03.	MÄRZ NEWS: Fachbeitrag 1 (Markttrends) - ok	8
3	siehe geplante Posts 10.03.	MÄRZ NEWS: Fachbeitrag 1 (Sozialimmobilien) - ok	8
2	Vermarktungsstart & Exklusivmandat Biesenthal und Projektvorstellung\nErfolgsstories\nVollvermietung Lützowufer gem. Post melden\nVermietungserfolg an Betreiber in Dessau-Rosslau gem. Postmelden	MÄRZ NEWS INHALT 1 - ok	8
\.


--
-- Data for Name: post_accounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.post_accounts (id, post_id, account_id) FROM stdin;
\.


--
-- Data for Name: post_analytics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.post_analytics (id, post_id, impressions, clicks, likes, shares, comments, engagement_rate, demographic_data, updated_at) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.posts (id, content, scheduled_date, approved, user_id, image_url, account_id, last_edited_at, last_edited_by_user_id, platform_post_id, visibility, article_url, post_type, publish_status, failure_reason, deleted_at) FROM stdin;
35	jusvi5-mitryj-hotpiF	2025-02-25 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 13:23:01.974
33	ARTIKEL REPOST: Scheidungsimmobilie Scheidungsimmobilie: Zwangsversteigerung ist der teuerste Fehler ⚖️ \r\n\r\nTrennung und Immobilienbesitz – eine oft komplexe Kombination mit erheblichen finanziellen Risiken. Wer sich nicht einigt, riskiert eine Zwangsversteigerung – und damit in der Regel einen Verlust von bis zu 30 % des Marktwerts. Warum eine Zwangsversteigerung unbedingt vermieden werden sollte: \r\n🔹 Preisverfall – Immobilien werden unter Marktwert verkauft, da Käufer auf Schnäppchenjagd sind. \r\n\r\n🔹 Verlust der Kontrolle – Das Gericht bestimmt den Wert, den Zeitpunkt und die Bedingungen des Verkaufs. \r\n\r\n🔹Langwieriger Prozess – Streitigkeiten eskalieren oft weiter und belasten alle Beteiligten finanziell und emotional. \r\n\r\n🚀 Bessere Alternativen:\r\n ✔ Einvernehmlicher Verkauf – Ein strategisch geführter Marktverkauf erzielt den besten Preis. \r\n✔ Auszahlung eines Partners – Erfordert eine saubere Finanzierungsstruktur, um tragfähig zu bleiben. \r\n✔ Zwischenlösung Vermietung – Kann in bestimmten Marktphasen sinnvoll sein, erfordert aber wirtschaftliche Zusammenarbeit. \r\n\r\nFazit: \r\nWer frühzeitig professionelle Beratung einholt, sichert den wirtschaftlich besten Weg. Ein erfahrener Makler kann als neutraler Vermittler agieren und eine marktgerechte Lösung mit maximaler Wertschöpfung finden. \r\n\r\n💬 Wie sehen Sie die aktuelle Entwicklung bei Scheidungsimmobilien? Lassen Sie uns in den Austausch gehen. \r\n\r\nJudith Lenz\r\n#Immobilienstrategie#Zwangsversteigerung#Vermögenssicherung#YOURTIMES #REALESTATE	2025-03-04 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 13:23:05.417
73	🤗 Heute ist der Feiertag der Umarmung – also komm her! 😂\r\n\r\nOb virtuell, in Gedanken oder ganz real: Eine Umarmung kann Wunder wirken! Sie sagt „Ich mag Dich“, „Ich bin für Dich da“ oder einfach „Du bist nicht allein“.\r\n\r\nAlso, lasst uns heute mal großzügig sein – umarmen wir Freundinnen, Kollegen, die Kaffeetasse oder notfalls auch den nächsten Baum. 🌳😆\r\n\r\n💬 Wann hast Du das letzte Mal eine richtig gute Umarmung bekommen? Schreib’s in die Kommentare – oder noch besser: Hol Dir heute eine ab! 🤗❤️\r\n\r\n#FeiertagDerUmarmung #SpreadTheHug #Menschlichkeit #Zusammenhalt #HugsForEveryone #YOURTIMES #JudithLenz	2025-06-28 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
95	3. Advent – Gemeinsam in die Zukunft blicken. 🎄✨\r\n\r\nMit der dritten Adventskerze rückt das Jahresende näher – eine Zeit, um sowohl zurück als auch nach vorne zu schauen.\r\n\r\nIn der Immobilienbranche bedeutet dies: Erfolge reflektieren, Herausforderungen annehmen und Chancen erkennen. Ob nachhaltige Wohnkonzepte, zukunftsweisende Projekte oder vertrauensvolle Partnerschaften – es sind Werte wie Beständigkeit und Innovation, die uns leiten.\r\n\r\nLassen Sie uns diesen Moment nutzen, um mit Zuversicht in die Zukunft zu blicken. Wir wünschen Ihnen einen besinnlichen dritten Advent!\r\n\r\n#YOURTIMES #YOURTIMESREALESTATE #Immobilien #Advent #Werte #ZukunftGestalten	2025-12-13 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
96	4. Advent – Zeit für das Wesentliche. 🎄🕯️\r\n\r\nDer vierte Advent ist da – ein Moment, um zur Ruhe zu kommen und sich auf das Wesentliche zu besinnen.\r\n\r\nIn der schnelllebigen Immobilienwelt sind es Vertrauen, Verlässlichkeit und Qualität, die den Unterschied machen. Gemeinsam mit unseren Partnern, Kundinnen und Kunden arbeiten wir daran, Werte zu schaffen, die Bestand haben – über den Jahreswechsel hinaus.\r\n\r\nDas gesamte Team von YOUR TIMES REAL ESTATE wünscht Ihnen einen besinnlichen vierten Advent und eine wundervolle Weihnachtszeit!\r\n\r\n#YOURTIMES #YOURTIMESREALESTATE #Immobilien #Advent #Besinnlichkeit #Vertrauen	2025-12-20 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
97	Dritter Advent – Der Zauber der kleinen Momente ✨\r\n\r\nMit jedem Adventssonntag rückt Weihnachten näher – und doch geht es nicht nur um das große Fest, sondern um die kleinen, stillen Augenblicke davor. 🎄\r\n\r\nDer Duft von frisch gebackenen Plätzchen, ein freundliches Lächeln im Vorweihnachtstrubel, eine liebevolle Nachricht von einem Menschen, den man viel zu selten sieht… Das sind die wahren Geschenke der Adventszeit.\r\n\r\nHeute zünde ich die dritte Kerze an und erinnere mich daran, dass es oft die kleinen Dinge sind, die das Herz erwärmen. 💛\r\n\r\nWas war Dein schönster kleine-Momente-Moment in dieser Adventszeit?\r\n\r\n#DritterAdvent #Weihnachtszauber #Dankbarkeit #ImmobilienvermarktungIstVertrauenssache	2025-12-13 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
98	Vierter Advent – Die Magie der Vorfreude 🎄\r\n\r\nDie letzte Kerze brennt – der vierte Advent ist da. ✨ Weihnachten steht vor der Tür, und mit ihm die ganz besondere Magie der Vorfreude.\r\n\r\nFür mich bedeutet Vorfreude:\r\n🌟 Zeit mit den Liebsten verbringen\r\n🌟 Einen Moment der Stille genießen\r\n🌟 Zurückblicken und dankbar sein\r\n\r\nWährend die Welt draußen noch einmal ins Jahresendspurt-Chaos verfällt, versuche ich bewusst, diesen Sonntag zu genießen. Denn die schönsten Momente sind oft die, in denen wir einfach nur da sind – mit offenen Herzen und voller Freude auf das, was kommt. 💛\r\n\r\nWie fühlst Du Dich kurz vor Weihnachten? Voller Vorfreude oder noch im Endspurt-Modus? 🎁\r\n\r\n#VierterAdvent #Vorfreude #Besinnlichkeit #ImmobilienvermarktungIstVertrauenssache	2025-12-20 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
87	📢 Wissen schafft Vertrauen – Tag der Informationsfreiheit 🏡🔍\r\n\r\nTransparenz ist der Schlüssel zu fundierten Entscheidungen – gerade auf dem Immobilienmarkt. Käufer, Verkäufer und Investoren stehen oft vor komplexen Fragen zu Markttrends, Finanzierung oder Vertragsdetails. Deshalb setzen wir bei YOUR TIMES REAL ESTATE auf offene Kommunikation und fundierte Beratung.\r\n\r\n🔹 Klare Informationen – Keine versteckten Klauseln, sondern verständliche und ehrliche Beratung.\r\n🔹 Marktkenntnis teilen – Wer die richtigen Fakten kennt, trifft die besten Entscheidungen.\r\n🔹 Vertrauen aufbauen – Transparenz sorgt für Sicherheit und eine erfolgreiche Zusammenarbeit.\r\n\r\nUnser Ziel: Immobiliengeschäfte, die auf Wissen, Fairness und Vertrauen basieren. Lassen Sie uns den Tag der Informationsfreiheit nutzen, um Barrieren abzubauen und Immobilienwissen für alle zugänglich zu machen.\r\n\r\n#YOURTIMES #Immobilien #Informationsfreiheit #Transparenz #Vertrauen #WissenIstMacht #Immobilienberatung	2025-03-15 23:00:00	t	8	\N	7	2025-03-10 09:54:05.727	8	\N	public	\N	post	draft	\N	\N
34	ARTIKEL REPOST: Scheidungsimmobilie Scheidungsimmobilie: Zwangsversteigerung ist der teuerste Fehler ⚖️ Trennung und Immobilienbesitz – eine oft komplexe Kombination mit erheblichen finanziellen Risiken. Wer sich nicht einigt, riskiert eine Zwangsversteigerung – und damit in der Regel einen Verlust von bis zu 30 % des Marktwerts. Warum eine Zwangsversteigerung unbedingt vermieden werden sollte: 🔹 Preisverfall – Immobilien werden unter Marktwert verkauft, da Käufer auf Schnäppchenjagd sind. 🔹 Verlust der Kontrolle – Das Gericht bestimmt den Wert, den Zeitpunkt und die Bedingungen des Verkaufs. 🔹Langwieriger Prozess – Streitigkeiten eskalieren oft weiter und belasten alle Beteiligten finanziell und emotional. 🚀 Bessere Alternativen: ✔ Einvernehmlicher Verkauf – Ein strategisch geführter Marktverkauf erzielt den besten Preis. ✔ Auszahlung eines Partners – Erfordert eine saubere Finanzierungsstruktur, um tragfähig zu bleiben. ✔ Zwischenlösung Vermietung – Kann in bestimmten Marktphasen sinnvoll sein, erfordert aber wirtschaftliche Zusammenarbeit. Fazit: Wer frühzeitig professionelle Beratung einholt, sichert den wirtschaftlich besten Weg. Ein erfahrener Makler kann als neutraler Vermittler agieren und eine marktgerechte Lösung mit maximaler Wertschöpfung finden. 💬 Wie sehen Sie die aktuelle Entwicklung bei Scheidungsimmobilien? Lassen Sie uns in den Austausch gehen. Judith Lenz Hashtag#Immobilienstrategie Hashtag#Zwangsversteigerung Hashtag#Vermögenssicherung Hashtag#YOURTIMES 	2025-03-04 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 13:23:08.078
37	ARTIKEL REPOST:\r\nScheidungsimmobilie: Zwangsversteigerung ist der teuerste Fehler ⚖️ \r\n\r\nTrennung und Immobilienbesitz – eine oft komplexe Kombination mit erheblichen finanziellen Risiken. \r\n\r\nWer sich nicht einigt, riskiert eine Zwangsversteigerung – und damit in der Regel einen Verlust von bis zu 30 % des Marktwerts. \r\n\r\nWarum eine Zwangsversteigerung unbedingt vermieden werden sollte: \r\n🔹 Preisverfall – Immobilien werden unter Marktwert verkauft, da Käufer auf Schnäppchenjagd sind. \r\n🔹 Verlust der Kontrolle – Das Gericht bestimmt den Wert, den Zeitpunkt und die Bedingungen des Verkaufs. \r\n🔹Langwieriger Prozess – Streitigkeiten eskalieren oft weiter und belasten alle Beteiligten finanziell und emotional. \r\n\r\nBessere Alternativen: \r\n✔ Einvernehmlicher Verkauf – Ein strategisch geführter Marktverkauf erzielt den besten Preis. \r\n✔ Auszahlung eines Partners – Erfordert eine saubere Finanzierungsstruktur, um tragfähig zu bleiben. \r\n✔ Zwischenlösung Vermietung – Kann in bestimmten Marktphasen sinnvoll sein, erfordert aber wirtschaftliche Zusammenarbeit. \r\n\r\nFazit: Wer frühzeitig professionelle Beratung einholt, sichert den wirtschaftlich besten Weg. Ein erfahrener Makler kann als neutraler Vermittler agieren und eine marktgerechte Lösung mit maximaler Wertschöpfung finden. \r\n\r\n💬 Lesen Sie mehr dazu in der aktuellen Kolumne von Judith Lenz\r\n\r\n#mmobilienstrategie#Zwangsversteigerung#Vermögenssicherung#YOURTIMES #REALESTATE	2025-03-04 23:00:00	t	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-03-05 11:09:11.19
39	JL: 21. Februar oder 21. März?\n\n\n🗣️ Die Muttersprache – ein Schlüssel zur Seele Am 21. Februar feiern wir den Internationalen Tag der Muttersprache – einen Tag, der uns daran erinnert, wie kostbar und prägend unsere Sprache ist. Sie ist weit mehr als ein Kommunikationsmittel: \nUnsere Muttersprache bringt uns mit unserer Kultur, unseren Erinnerungen und unserer Identität in Verbindung. Für mich ist die Muttersprache ein Stück Heimat, ein Anker in einer sich ständig verändernden Welt. Sie trägt die Geschichten unserer Kindheit und formt, wie wir denken und fühlen. Gleichzeitig lädt sie uns ein, andere Sprachen und Kulturen zu entdecken – und so unseren Horizont zu erweitern. \nGerade die deutsche Sprache mit ihren Worten ist sehr präzise und drückt so viel mehr aus, als uns im Alltag bewusst ist.\n\nGern dazu eines meiner Lieblingsbeispiele: Das Wort "Nachrichten" - da es täglich von den meisten Menschen als auch von den Medien verwendet wird. Das Wort stammt aus dem 17. Jahrhundert für älter Nachrichtung = das wonach man sich zu richten hat - also eine Anweisung!\n😉 Damit lasse ich das gern mit einem Augenzwinkern so stehen und Raum für die eigenen Gedanken 😉\n\nWas bedeutet eure Muttersprache für euch? Gibt es ein Wort, ein Sprichwort oder eine Erinnerung, die ihr mit ihr verbindet? Ich freue mich, wenn ihr eure Gedanken dazu mit mir teilt. \n\n#TagDerMuttersprache #SpracheVerbindet #KulturelleWurzeln #Wertschätzung #YOURTIMES #REALESTATE #Berlin	2025-02-20 23:00:00	t	8	\N	6	2025-02-20 16:07:37.013	7	\N	public	\N	post	deleted	\N	2025-02-27 11:15:10.614
36	REPOST ARTIKEL:\r\n🏡 Immobilienfinanzierung 2025: Strengere Vergabekriterien – aber keine Sackgasse 💡\r\n\r\nDie Kreditlandschaft hat sich spürbar verändert: Höhere Eigenkapitalanforderungen, strengere Bonitätsprüfungen und selektivere Banken machen Finanzierungen herausfordernder – selbst für finanzstarke Käufer.\r\n\r\nDoch wer strategisch vorgeht, sich exzellent vorbereitet und die richtigen Partner an seiner Seite hat, kann weiterhin attraktive Finanzierungsmodelle realisieren. Worauf es ankommt:\r\n\r\n✔ Differenzierte Bankenstrategien nutzen – Kreditinstitute bewerten Risikoprofile unterschiedlich. Ein gezielter Vergleich kann erhebliche Konditionsvorteile bringen.\r\n\r\n✔ Finanzielle Hebel identifizieren – Der kluge Verkauf von Bestandsimmobilien oder Eigenkapital-Optimierung durch clevere Strukturierung sind entscheidend.\r\n\r\n✔ Immobilienwert vs. Finanzierungsspielraum – Die regional divergierende Marktentwicklung eröffnet Potenziale, die strategisch genutzt werden können.\r\n\r\nMarktkenntnis und Expertise sind essenziell – Finanzierungsentscheidungen erfordern präzise Marktanalysen, bankenübergreifende Verhandlungen und ein starkes Netzwerk.\r\n\r\n💬 Wie bewerten Sie die aktuellen Entwicklungen? Lesen Sie dazu mehr in der aktuellen Kolumne von Judith Lenz\r\n\r\nHashtag#Immobilienstrategie Hashtag#Finanzierungsoptimierung Hashtag#Marktdynamik Hashtag#YOURTIMES #REALESTATE	2025-02-24 23:00:00	t	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-02-27 11:15:13.959
46	VORLAGE 2	2025-02-20 23:00:00	f	8	/uploads/183bf5cfb635513fe6b8733512d0c3af	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 16:27:57.556
45	VORLAGE 1	2025-02-20 23:00:00	f	8	/uploads/b1c3ae6250efe5c6c0ed37e18cd6ce2c	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 16:28:00.617
44	ZITAT VORLAGEN (swisslife, finde ich nicht so super...)	2025-02-20 23:00:00	f	8	/uploads/9680afbe5bcb367db2506ba1b556804c	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 17:28:58.093
47	VORLAGE 3, FAVORIT	2025-02-20 23:00:00	f	8	/uploads/c063926cf8c917794a59857e7d62ba4a	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 17:29:01.753
42	Spontaner Kommentar @JL zur Immobilienfinanzierung 	2025-02-24 23:00:00	t	8	\N	6	2025-02-20 13:31:39.991	8	\N	public	\N	post	deleted	\N	2025-02-27 11:15:16.527
41	🌟 Tag des Kompliments – Ein kleiner Moment, der Großes bewirken kann 🌟 \n\nHeute ist der 1. März, der internationale Tag des Kompliments – und ich finde, das ist der perfekte Anlass, um innezuhalten und ein paar liebe Worte zu verteilen. 🗣️❤️ \n\nEgal, ob im Job oder privat – wir alle wissen, wie gut es tut, ein ehrliches Kompliment zu bekommen. Ein „Du machst das großartig!“ oder „Danke, dass Du da bist!“ kann manchmal den Unterschied machen und jemandem den Tag retten. In der Immobilienbranche geht es nicht nur um Zahlen und Verträge – es sind Menschen, die sich tagtäglich einsetzen. 🤝 \nVertrauen aufzubauen, Beziehungen zu stärken und das Gefühl zu vermitteln: „Du bist wichtig, und Deine Arbeit zählt!“ Das ist es, was uns antreibt, was uns verbindet und was am Ende jeden Erfolg ausmacht. ✨ Deshalb möchte ich heute ein großes Dankeschön an mein Team, meine Partnerinnen und Partner sowie meine Kundinnen und Kunden richten: Ihr seid einfach wunderbar, und ohne Euch wäre nichts von all dem möglich. Eure Leidenschaft, Euer Einsatz und Eure Menschlichkeit sind unbezahlbar! 🙏 \n\nLasst uns den Tag nutzen, um ein bisschen Licht in den Alltag anderer zu bringen – mit einem ehrlichen Kompliment, einem warmen Lächeln oder einfach ein paar netten Worten. \n\n💬 Was war das schönste Kompliment, das Du je bekommen hast? Schreib es gern in die Kommentare – ich freue mich drauf!\n\n#Vertrauen #Komplimente #YOURTIMES #REALESTATE	2025-02-28 23:00:00	t	8	\N	6	2025-02-20 15:39:16.267	7	\N	public	\N	post	deleted	\N	2025-03-03 09:18:25.529
38	REPOST YT zum Artikel:\n\nEin wichtiger Beitrag zu einem oft unterschätzten Thema! 🙌 Eine Scheidung ist emotional herausfordernd genug – da sollte die Immobilie(n) nicht noch zur zusätzlichen Belastung werden. Die größten Fehler entstehen oft durch fehlende Einigkeit oder mangelnde Beratung. Eine sachliche Kommunikation ist in den meisten Fällen dann auch leider nicht mehr möglich.\n\nMeine Erfahrung zeigt: Wer frühzeitig Klarheit schafft und sich professionell begleiten lässt, kann finanziellen Schaden vermeiden und die bestmögliche Lösung für alle Beteiligten finden. 💡	2025-03-04 23:00:00	t	8	\N	6	2025-02-20 15:09:20.393	7	\N	public	\N	post	deleted	\N	2025-03-05 11:09:14.372
53	LinkedIn-Beitrag zum Veröffentlichen des Artikels:\r\n\r\nMarkttrends 2025: Chancen für Anleger\r\n\r\n·         Preisstabilisierung: +1,5% bei Eigentumswohnungen (vdp Q1 2025)\r\n\r\n·         Hotspots: Leipzig, Dresden mit 4-5% NAR.\r\n\r\n·         Nachhaltigkeit: KfW-40 steigert Werte um 8-12%\r\n\r\n·         Gewerbe: Hotelrenditen bis 5%, 15 Jahre Pacht.\r\n\r\n·         Finanzierung: Forward-Darlehen unter 3%, ROI +12-18% bei Asset-Flips\r\n\r\n·         Expertise: Marktanalyse steigert Werte um bis zu 20%\r\n\r\nFazit: Jetzt strategisch investieren.\r\n\r\nMehr in der Kolumne von Judith Lenz: (Link)	2025-03-23 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
54	JL Repost/Kommentar\r\n\r\nHier darfst du gerne aktiv werden 😊	2025-03-23 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
50	Artikel REPOST:\r\n\r\nSozialimmobilien: Pflegeheime als strategische Anlage 2025\r\n\r\n·         Stabile NAR von 4-6 % durch 20-25-jährige Pachtverträge.\r\n\r\n·         Nachfrage steigt bis 2030 um 20 % (Bulwiengesa).\r\n\r\n·         KfW-Förderungen (15 %) und § 7b EStG optimieren IRR.\r\n\r\n·         Risiken: Standort und Betreiberbonität entscheidend.\r\n\r\n·         Alternativen: Asset-Flip oder langfristiger Halt.\r\n\r\n·         Maklerrolle: Wertsteigerung um bis zu 25 %.\r\n\r\nFazit: Frühzeitige Planung sichert Rendite.\r\n\r\nMehr in der Kolumne von Judith Lenz: (Link)\r\n	2025-03-16 23:00:00	f	8	\N	7	2025-03-17 07:01:39.727	8	\N	public	\N	post	draft	\N	\N
51	Ein Thema, das niemals an Präsenz verlieren wird!\n🙌 Bei unserem neuen Projekt #Service-Wohnen Biesenthal ist genau zu erkennen, warum #HealthCare Immobilien und der damit verbundene dringend benötigte Wohnraum für Senioren so gefragt ist: 69 altersgerechte, barrierefreie Wohneinheiten mit Pflege- und Betreuungsservices. \nZiel des Pflegedienstes ist es, dass ältere Menschen trotz oder wegen des Pflegebedarfs in ihrer Wohnung und in ihrem vertrauten Umfeld wohnen und leben können. Dabei sollten Sie nicht isoliert, sondern Teil des Sozialraums, Teil der Quartiersgemeinschaft bilden.\n\nIn den betreuten Wohngemeinschaften übernimmt der Pflegedienst die fachkundige Pflege und Versorgung der Bewohner. Das schließt die Grund- und Behandlungspflege, hauswirtschaftliche Versorgung, soziale Betreuung und Bereitstellung von Pflegemitteln sowie die Medikamentenversorgung mit ein. Das Begegnungszentrum für Mieter und Besucher fördert die Kommunikation und das menschliche Miteinander.\n\n#Gemeinschaftlich #miteinander - dieses Projekt als auch unsere vorigen HealthCare Objekte sind mein persönlicher Beitrag und meine absolute Überzeugung aus der Tiefe meines Herzens etwas für diese Altersgruppe proaktiv tun zu dürfen und sie nicht an den Rand der Gesellschaft zu stellen! \nDenn wenn es gut läuft, dürfen wir alle alt werden und benötigen eines Tages Hilfe....\n	2025-03-09 23:00:00	t	8	\N	6	2025-03-08 17:36:40.88	7	\N	public	\N	post	deleted	\N	2025-03-10 09:49:30.24
49	ARTIKEL:\n\nKW11 März 2025\n\nEine Kolumne von Judith Lenz\n\nHealth-Care-Immobilien: Strategische Investments in Pflegeheime vermeiden Marktrisiken\n\nHealth-Care-Immobilien, insbesondere Pflegeheime, sind für institutionelle Anleger und Projektentwickler eine resiliente Anlageklasse, die 2025 konjunkturelle Volatilität umgeht. Die Kombination aus stabilen Cashflows, steigender Nachfrage und staatlicher Förderung macht sie zu einer strategischen Wahl – doch nur mit der richtigen Planung wird das volle Renditepotenzial ausgeschöpft.\n\nMarktstabilität durch demografische Trends\nDie demografische Alterung in Deutschland treibt die Nachfrage nach Pflegeplätzen unaufhaltsam an. Laut Bulwiengesa wird der Bedarf bis 2030 um 20 % steigen, was die Leerstandsrisiken minimiert. Langfristige Pachtverträge mit Betreibern – oft über 20-25 Jahre – sichern Nettoanfangsrenditen (NAR) zwischen 4-6 %, unabhängig von Marktschwankungen. Für Investoren bedeutet das: planbare Erträge bei geringer Abhängigkeit von Zinsentwicklungen oder konjunkturellen Zyklen.\n\nFinanzielle Hebel und Förderungen\nDie Finanzierungsstruktur eines Pflegeheim-Investments kann durch staatliche Programme optimiert werden. Neue KfW-Zuschüsse ab 2025 decken bis zu 15 % der Baukosten, während Sonderabschreibungen nach § 7b EStG die steuerliche Belastung senken. Eine energetische Sanierung auf Effizienzklasse A erhöht den Verkehrswert um bis zu 10 %, was die interne Rendite (IRR) signifikant steigert. Projektentwickler sollten diese Hebel in der Due-Diligence-Prüfung berücksichtigen, um die Kapitalstruktur zu maximieren.\n\nRisiken und deren Management\nOhne sorgfältige Standortanalyse drohen suboptimale Erträge. Urbane Randlagen mit guter Anbindung sind entscheidend, da sie Betreiberattraktivität und Wertstabilität sichern. Ein weiteres Risiko ist die Betreiberinsolvenz – hier empfiehlt sich eine Bonitätsprüfung und die Zusammenarbeit mit etablierten Pflegekonzernen. Alternativ kann eine schlechte Marktphase durch eine temporäre Vermietung überbrückt werden, vorausgesetzt, die bauliche Substanz entspricht den Anforderungen des Pflegemarktes.\n\nAlternative Strategien: Asset-Flip oder langfristiger Halt\nNeben dem klassischen Buy-and-Hold-Ansatz bietet sich für liquide Investoren ein Asset-Flip an: Kauf eines Bestandsobjekts, Modernisierung (z. B. energetische Sanierung) und Verkauf mit einem Aufschlag von 15-20 %. Dies erfordert jedoch eine präzise Marktkenntnis und Liquiditätsreserven. Langfristiger Halt hingegen maximiert die Wertschöpfung durch kontinuierliche Mieteinnahmen und steigende Immobilienwerte, insbesondere bei steueroptimierten Finanzierungsmodellen wie Forward-Darlehen.\n\nDie Rolle des Immobilienspezialisten\nEin erfahrener Makler ist hier unerlässlich. Von der Standortanalyse über die Verhandlung mit Betreibern bis zur Vermarktung – professionelle Begleitung sichert die Rendite und minimiert Risiken. Eine fundierte Wertermittlung, gepaart mit einem strategischen Verkaufsprozess, kann den Exit-Wert um bis zu 25 % über dem Marktdurchschnitt platzieren.\n\nFazit\nPflegeheime sind 2025 eine strategische Anlageoption, die Marktrisiken umgeht und stabile Erträge liefert. Eine Kombination aus demografischer Nachfrage, finanziellen Hebeln und professioneller Vermarktung macht sie zur idealen Wahl für institutionelle Portfolios. Frühzeitige Planung und Expertise sind der Schlüssel zum Erfolg.\n\n\nHinweise\nIn diesem Text wird aus Gründen der besseren Lesbarkeit das generische Maskulinum verwendet. Weibliche und anderweitige Geschlechteridentitäten werden dabei ausdrücklich mitgemeint, soweit es für die Aussage erforderlich ist. Dieser Beitrag stellt keine Steuer- oder Rechtsberatung im Einzelfall dar. Bitte lassen Sie die Sachverhalte in Ihrem konkreten Einzelfall von einem Rechtsanwalt und/oder Steuerberater klären.	2025-03-16 23:00:00	t	8	\N	7	2025-03-13 18:36:49.43	7	\N	public	\N	post	draft	\N	\N
52	ARTIKEL \r\n\r\nKW13 März 2025\r\n\r\nEine Kolumne von Judith Lenz\r\n\r\n\r\nMarkttrends 2025: Chancen für Anleger\r\n\r\nDer Immobilienmarkt 2025 bietet institutionellen Anlegern und Projektentwicklern ein stabiles Fundament für strategische Investments. Preisstabilisierung, regionale Hotspots und nachhaltige Bauweise prägen die Trends – wer diese Dynamiken versteht, kann die Nettoanfangsrendite (NAR) gezielt steigern. Dieser Beitrag beleuchtet die aktuellen Entwicklungen und zeigt, wie Investoren Kapital effizient einsetzen können.\r\n\r\nEin stabiler Markt mit moderatem Wachstum\r\nNach Jahren volatiler Preisentwicklungen zeigt der Markt 2025 eine wohltuende Konsolidierung. Der Verband deutscher Pfandbriefbanken (vdp) meldet für Q1 einen Anstieg der Eigentumswohnungspreise um 1,5 %, während Gewerbeimmobilien in zweitklassigen Lagen eine Wertsteigerung von bis zu 3 % verzeichnen. Diese Stabilität reduziert spekulative Unsicherheiten und begünstigt langfristige Anlagestrategien, insbesondere in mittelgroßen Städten wie Leipzig oder Dresden, wo Wohnanlagen NARs von 4-5 % erzielen.\r\n\r\nNachhaltigkeit als Investitionskatalysator\r\nEnergieeffizienz ist kein Trend mehr, sondern ein Muss. Objekte mit KfW-40-Standard oder höher (z. B. Effizienzklasse A+) erzielen Verkaufswerte, die den Marktdurchschnitt um 8-12 % übertreffen. Neue Förderprogramme ab 2025 – etwa Zuschüsse von bis zu 15 % für erneuerbare Energien – senken die Kapitalkosten und steigern die interne Rendite (IRR). Ohne energetische Modernisierung drohen Bestandsimmobilien dagegen ein Abschlag von bis zu 20 %, ein Risiko, das bei der Due-Diligence-Prüfung Priorität haben sollte.\r\n\r\nRegionale Märkte im Aufwind\r\nMetropolen wie Berlin oder München bleiben teuer, doch der Fokus verschiebt sich auf Randlagen und aufstrebende Regionen. Grundstücke ohne Baurecht in Speckgürteln großer Städte bieten spekulative Potenziale von 15-20 %, wenn Baugenehmigungen gesichert werden. Gewerbeimmobilien, insbesondere Hotelprojekte, profitieren vom anhaltenden Tourismusboom – hier sind NARs von 5 % bei Pachtverträgen über 15 Jahre realistisch. Investoren sollten Marktberichte genau analysieren, um diese Chancen zu priorisieren.\r\n\r\nFinanzierung: Flexibilität als Vorteil\r\nDie richtige Kapitalstruktur entscheidet über den Erfolg. Forward-Darlehen sichern Zinssätze von aktuell unter 3 % für künftige Projekte, während Eigenkapitalquoten von 30-40 % die Bankenfinanzierung erleichtern. Steuerliche Vorteile wie § 7b EStG (Sonderabschreibungen) und regionale Förderungen für Gewerbeimmobilien optimieren die Liquidität. Ein Asset-Flip – Kauf, Modernisierung, Verkauf – kann innerhalb von 18 Monaten den ROI um 12-18 % steigern, erfordert jedoch eine präzise Exit-Strategie.\r\n\r\nMarkteintritt: Timing und Expertise\r\nDer Erfolg hängt vom Timing ab. Frühzeitige Marktanalysen und die Zusammenarbeit mit Experten sind unerlässlich, um Hotspots wie Dresden oder spekulative Grundstücke zu identifizieren. Ein erfahrener Immobilienberater unterstützt bei der Wertermittlung, Verhandlung mit Behörden und der Entwicklung eines Vermarktungskonzepts, das den Verkaufswert um bis zu 20 % steigert. Ohne diese Expertise drohen Verzögerungen oder Fehlentscheidungen, die die Rendite schmälern.\r\n\r\nFazit\r\n2025 ist ein Jahr der Chancen für institutionelle Anleger. Stabile Preise, nachhaltige Investments und regionale Dynamiken bieten Potenzial für renditestarke Portfolios. Wer jetzt mit fundierter Analyse und professioneller Unterstützung handelt, positioniert sich für langfristigen Erfolg.\r\n\r\nHinweise\r\nIn diesem Text wird aus Gründen der besseren Lesbarkeit das generische Maskulinum verwendet. Weibliche und anderweitige Geschlechteridentitäten werden dabei ausdrücklich mitgemeint, soweit es für die Aussage erforderlich ist. Dieser Beitrag stellt keine Steuer- oder Rechtsberatung im Einzelfall dar. Bitte lassen Sie die Sachverhalte in Ihrem konkreten Einzelfall von einem Rechtsanwalt und/oder Steuerberater klären.	2025-03-23 23:00:00	t	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
40	JL -> da muss ich noch dran pfeilen - der fühlt sich nicht rund an. ggf. terminieren wir den später: \n\nVertrauen schafft Werte – Meine Vision für exklusive Immobiliengeschäfte Als Immobilienmaklerin in Berlin ist es mir ein Herzensanliegen, nicht nur erstklassige Objekte zu vermitteln, sondern echte Lebensräume und langfristige Beziehungen aufzubauen. Gerade in Zeiten, in denen Transparenz und Diskretion immer wichtiger werden, setze ich auf exklusive Off-Market-Transaktionen – basierend auf Vertrauen, Integrität und persönlicher Nähe. Es erfüllt mich mit Stolz, mit Partnern zusammenzuarbeiten, die dieselben Werte teilen und so gemeinsam nachhaltige Investmentchancen realisieren. \n\nFür mich bedeutet echtes Vertrauen mehr als nur ein gutes Geschäft: Es öffnet Türen zu außergewöhnlichen Projekten und schafft eine Basis, auf der langfristiger Erfolg wächst. 🤝 \n\nIch freue mich auf den Austausch mit Ihnen: Wie erleben Sie Vertrauen in Ihrem Geschäftsalltag? \n\n#OffMarketInvestments #Vertrauen #ExklusiveProjekte #Immobilien #JudithLenz #Immobilieninvestment #Berlin #YOURTIMES	2025-03-23 23:00:00	f	8	\N	6	2025-03-17 07:01:15.964	8	\N	public	\N	post	draft	\N	\N
48	Vermarktungsstart: Service-Wohnen Biesenthal – Zukunftssicheres #Investment im Wachstumsmarkt der #HEALTHCARE Immobilien\n\n@YOUR TIMES REAL ESTATE startet die Vermarktung eines modernen Seniorenwohnanlage mit Pflegeservices in Biesenthal, Brandenburg. Mit 69 barrierefreien Wohneinheiten sowie ergänzenden Pflege- und Betreuungsangeboten setzt das Projekt neue Maßstäbe im Bereich altersgerechtem Wohnen.\nBetreutes Wohnen mit Komfort für eine neue Lebensphase! Hier ist Gemeinschaft Teil des Konzeptes\n\n🏗 Projektumfang: Vier moderne Stadtvillen, zweigeschossig mit 69 Service-Wohnungen\nVermarktungsstart: Service-Wohnen Biesenthal – Zukunftssicheres #Investment im Wachstumsmarkt der #HEALTHCARE Immobilien\n\n@YOUR TIMES REAL ESTATE startet die Vermarktung eines modernen Seniorenwohnanlage mit Pflegeservices in Biesenthal, Brandenburg. Mit 69 barrierefreien Wohneinheiten sowie ergänzenden Pflege- und Betreuungsangeboten setzt das Projekt neue Maßstäbe im Bereich altersgerechtem Wohnen.\nBetreutes Wohnen mit Komfort für eine neue Lebensphase! Hier ist Gemeinschaft Teil des Konzeptes\n\n🏗 Projektumfang: Vier moderne Stadtvillen, zweigeschossig mit 69 Service-Wohnungen\n- insgesamt ca. 4.617m² Wohn- und Nutzfläche, davon ca. 3.428m² reine Wohnfläche und ca. 1.188m² Nutzflächen \n- 2 betreute 10er-Wohngemeinschaften\n- einer Tagespflege zur Aufnahme & tagesweiser Betreuung von älteren Menschen mit separatem Zugang\n- einer Sozialstation mit Begenungsstätte für geselliges Beisammensein.\n\n🏠 Ausstattung: alle Wohnungen sind barrierefrei, hochwertige Küchen mit modernen Einbauten, Fußbodenheizung, großzügige Bäder mit barrierefreien Duschen, Abstellraum, Balkon oder Terrasse in jeder Einheit, hochwertige Video- und Türöffnungsanlage, Glasfaseranschluss, vollelektrische Hauseingangstüren für barrierefeiem Zugang, Fahrstühle in den Häusern\n\n⚡ Nachhaltige Bauweise: KfW-40 EE Standard (Erneuerbare Energien),  Energieeffizienzklasse A+, Wärmepumpen mit Erdwärme, energieeffiziente Gebäudekonzeption. \n\n📌 Standort: idyllisches Biesenthal – im Speckgürtel Berlins, eingebettet in den Naturpark des Landkreises Barnim, Bundesland Brandenburg. Hohe Lebensqualität bei gleichzeitig guter Anbindung an die Metropole.\n\n📊 Marktpotenzial: Der Bedarf an seniorengerechtem Wohnen wächst rasant – getrieben durch den demografischen Wandel und ein begrenztes Angebot an modernen, betreuten Wohnformen. Betreiber und Investoren setzen zunehmend auf skalierbare, energieeffiziente Wohnkonzepte mit integriertem Pflegeservice.\n\nBiesenthal steht exemplarisch für die Entwicklung in nachgefragten Randlagen von Metropolen: steigender Zuzug, wachsender Bedarf an altersgerechtem Wohnraum und ein Marktumfeld, das langfristig stabile Renditen verspricht.\n\nPlanung: @GanterArchitektenGesellschaft für Architektur mbH\nBauherr: Leonwert Projekt Biesenthal GmbH eine Projektgesellschaft der @Leonwert Immobilienmangement GmbH\nGeneralunternehmer: @Züblin \n\n#YOURTIMES #Healthcare # Immobilien #Seniorenwohnen #BetreutesWohnen #Zukunftsmarkt #Pflegeimmobilien #Berlin # Brandenburg #Biesenthal #ganterarchitekten #leonwert #züblin \n- 2 betreute 10er-Wohngemeinschaften\n- einer Tagespflege zur Aufnahme & tagesweiser Betreuung von älteren Menschen mit separatem Zugang\n- einer Sozialstation mit Begenungsstätte für geselliges Beisammensein.\n\n🏠 Ausstattung: alle Wohnungen sind barrierefrei, hochwertige Küchen mit modernen Einbauten, Fußbodenheizung, großzügige Bäder mit barrierefreien Duschen, Abstellraum, Balkon oder Terrasse in jeder Einheit, hochwertige Video- und Türöffnungsanlage, Glasfaseranschluss, vollelektrische Hauseingangstüren für barrierefeiem Zugang, Fahrstühle in den Häusern\n\n⚡ Nachhaltige Bauweise: KfW-40 EE Standard (Erneuerbare Energien),  Energieeffizienzklasse A+, Wärmepumpen mit Erdwärme, energieeffiziente Gebäudekonzeption. \n\n📌 Standort: idyllisches Biesenthal – im Speckgürtel Berlins, eingebettet in den Naturpark des Landkreises Barnim, Bundesland Brandenburg. Hohe Lebensqualität bei gleichzeitig guter Anbindung an die Metropole.\n\n📊 Marktpotenzial: Der Bedarf an seniorengerechtem Wohnen wächst rasant – getrieben durch den demografischen Wandel und ein begrenztes Angebot an modernen, betreuten Wohnformen. Betreiber und Investoren setzen zunehmend auf skalierbare, energieeffiziente Wohnkonzepte mit integriertem Pflegeservice.\n\nBiesenthal steht exemplarisch für die Entwicklung in nachgefragten Randlagen von Metropolen: steigender Zuzug, wachsender Bedarf an altersgerechtem Wohnraum und ein Marktumfeld, das langfristig stabile Renditen verspricht.\n\nPlanung: @GanterArchitektenGesellschaft für Architektur mbH\nBauherr: Leonwert Projekt Biesenthal GmbH eine Projektgesellschaft der @Leonwert Immobilienmangement GmbH\nGeneralunternehmer: @Ed Zübling Brandenburg\n\n#YOURTIMES #Healthcare # Immobilien #Seniorenwohnen #BetreutesWohnen #Zukunftsmarkt #Pflegeimmobilien #Berlin # Brandenburg #Biesenthal	2025-03-10 23:00:00	t	8	\N	7	2025-03-08 18:29:22.889	7	\N	public	\N	post	deleted	\N	2025-03-14 13:58:26.014
75	🏡 Welttag des Wohn- und Siedlungswesens – Ein Zuhause für jede Lebensphase! 🌍✨\r\n\r\nWohnen ist mehr als nur ein Dach über dem Kopf – es ist der Ort, an dem wir uns wohlfühlen, an dem Erinnerungen entstehen und an dem wir unser Leben gestalten. Doch die Bedürfnisse ändern sich mit der Zeit. Besonders für Senioren, die schließlich unser Land aufgebaut haben, ist es entscheidend, dass sie im Alter sicher, barrierefrei und in guter Nachbarschaft wohnen können!\r\n\r\nAls Immobilienexpertin sehe ich immer wieder, wie wichtig es ist, Wohnräume zu schaffen, die zu den Menschen passen – nicht umgekehrt. Gerade ältere Menschen brauchen nicht nur Komfort, sondern auch ein Umfeld, das soziale Kontakte ermöglicht und Selbstständigkeit fördert.\r\n\r\nWas bedeutet für Dich ein „Zuhause fürs Leben“? Ich freue mich auf Deine Gedanken!\r\n\r\n#WelttagDesWohnens #ZuhauseImAlter #Wertschätzung #Immobilien #Lebensqualität #Gemeinschaft	2025-09-30 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
43	🌸 8. März – Weltfrauentag: Ein Tag für mehr als nur Worte 🌸\n\nHeute ist Weltfrauentag – ein Tag, der uns daran erinnert, wie wichtig es ist, Frauen in ihrer Vielfalt zu würdigen, zu stärken und ihnen die gleichen Chancen zu bieten. 💪✨\n\nIn der Immobilienbranche – wie in so vielen anderen Bereichen – sehe ich jeden Tag starke Frauen, die mit Leidenschaft, Mut und Kompetenz Großartiges leisten. Ob Kolleginnen, Kundinnen oder Partnerinnen: Jede einzelne bringt ihre eigene Stärke mit, und genau das macht uns gemeinsam so erfolgreich.\n\nDoch der Weltfrauentag ist auch ein Tag, der uns zeigt, dass wir noch viel zu tun haben. Gleichberechtigung, faire Chancen und gegenseitiger Respekt – das sind nicht nur Worte, sondern Werte, die wir täglich leben sollten.\n\n✨ An alle Frauen da draußen: Seid stolz auf Euch, glaubt an Eure Stärke und traut Euch, groß zu träumen. Wir sind hier, um uns gegenseitig zu unterstützen und gemeinsam zu wachsen.\n\n#Weltfrauentag #Gleichberechtigung #Frauenpower #Zusammenhalt #Immobilien #Menschlichkeit #YOURTIMES #REALESTATE #JudithLenz	2025-03-07 23:00:00	t	8	\N	6	2025-03-07 15:48:55.333	7	\N	public	\N	post	deleted	\N	2025-03-08 18:20:08.219
55	Coole Sprüche :-)\n"Frauenpower ist, wenn Stärke auf Fingerspitzengefühl trifft"\n\n...und wir merken uns für neue LinkedIn Banner in Kombi mit neuen Fotos udn neuem Layout: \n„Starke Frauen lassen sich nicht in Schubladen stecken – sie bauen eigene Räume.“\nund\n„Gegen festgefahrene Strukturen hilft am besten weibliche Intuition.“\n\n🌸 8. März – Weltfrauentag: Ein Tag für mehr als nur Worte 🌸\n\nHeute ist Weltfrauentag – ein Tag, der uns daran erinnert, wie wichtig es ist, Frauen in ihrer Vielfalt zu würdigen, zu stärken und ihnen die gleichen Chancen zu bieten. 💪✨\n\nIn der Immobilienbranche – wie in so vielen anderen Bereichen – sehe ich jeden Tag starke Frauen, die mit Leidenschaft, Mut und Kompetenz Großartiges leisten. Ob Kolleginnen, Kundinnen oder Partnerinnen: Jede einzelne bringt ihre eigene Stärke mit, und genau das macht uns gemeinsam so erfolgreich.\n\nDoch der Weltfrauentag ist auch ein Tag, der uns zeigt, dass wir noch viel zu tun haben. Gleichberechtigung, faire Chancen und gegenseitiger Respekt – das sind nicht nur Worte, sondern Werte, die wir täglich leben sollten.\n\n✨ An alle Frauen da draußen: Seid stolz auf Euch, glaubt an Eure Stärke und traut Euch, groß zu träumen. Wir sind hier, um uns gegenseitig zu unterstützen und gemeinsam zu wachsen.\n\n\n#Weltfrauentag #Gleichberechtigung #Frauenpower #Zusammenhalt #Immobilien #Menschlichkeit #YOURTIMES #REALESTATE #JudithLenz\n\n „Wo andere Mauern sehen, bauen Frauen Türen.“\n „Hartnäckigkeit schlägt Härte – besonders, wenn sie weiblich ist.“\n„Starke Frauen lassen sich nicht in Schubladen stecken – sie bauen eigene Räume.“\n„Eleganz ist, wenn Stärke auf Fingerspitzengefühl trifft.“\n„Gegen festgefahrene Strukturen hilft am besten weibliche Intuition.“	2025-03-07 23:00:00	t	8	/uploads/1fc4f8c14fcaecd0560d5a446bdadcbc	6	2025-03-07 15:53:35.955	7	\N	public	\N	post	deleted	\N	2025-03-08 18:28:32.089
74	📝 Tag der deutschen Sprache – weil kein anderes Land „doch“ so vielseitig benutzt! 😂\r\n\r\nDeutsch ist wundervoll, präzise – und manchmal völlig verrückt. Warum sagen wir „Ja, nein, vielleicht“ in einem Satz und alle verstehen es? Oder warum gibt es Wörter wie „Handschuh“, aber „Fußschuh“ ist falsch? 🤯\r\n\r\nAber genau das lieben wir doch an unserer Sprache! 💙\r\n\r\n#TagDerDeutschenSprache #DochDochDoch #SchönAberKnifflig #Menschlichkeit #Sprachliebe	2025-09-12 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
84	🇩🇪 Tag der Deutschen Einheit – Gemeinsam stark für die Zukunft 🇩🇪\r\n\r\nHeute feiern wir nicht nur die Wiedervereinigung Deutschlands, sondern auch den Zusammenhalt, der uns zu dem gemacht hat, was wir heute sind. Für uns bei YOUR TIMES bedeutet dieser Tag, auf die gemeinsamen Erfolge zurückzublicken und gleichzeitig nach vorne zu schauen – auf eine Zukunft, die wir gemeinsam gestalten.\r\n\r\nIn der Immobilienbranche zeigt sich dieser Zusammenhalt besonders deutlich: Städte und Regionen entwickeln sich durch Zusammenarbeit und Vertrauen. Genau das ist es, was langfristige, erfolgreiche Projekte ausmacht – und worauf wir auch in Zukunft setzen werden.\r\n\r\nLasst uns den 3. Oktober nutzen, um an unsere Stärken zu erinnern und weiter mutig und gemeinsam an neuen Herausforderungen zu arbeiten. 💪\r\n\r\n#TagDerDeutschenEinheit #Zusammenhalt #ZukunftGestalten #YOURTIMES	2025-10-02 22:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
85	🌸 Frohe Pfingsten von der YOUR TIMES REAL ESTATE! 🌸\r\n\r\nAuch wir nutzen die Feiertage, um Energie zu tanken und uns auf kommende Projekte zu freuen. 💪🏡 Unsere Leidenschaft für Immobilien kennt keine Pausen – wir sind stets bereit, gerade in diesen wirtschaftlich herausfordernden Zeiten noch mehr Einsatz zu bringen, als wir es ohnehin schon sehr gern tun.\r\n\r\nPfingsten ist eine wunderbare Zeit, um innezuhalten und die schönen Momente mit Familie und Freunden zu genießen. Für uns bedeutet es auch, die Erfolge der letzten Wochen zu reflektieren und neue Ziele zu setzen.\r\n\r\nEin kleiner Rückblick:\r\nX\r\nX\r\nX\r\n\r\nWir danken Ihnen für Ihr Vertrauen und Ihre Unterstützung. Gemeinsam sind wir stark und gemeinsam gestalten wir die Zukunft der Immobilienbranche!\r\n\r\nGenießen Sie die Feiertage, erholen Sie sich gut und starten Sie mit frischer Energie in die kommende Woche. \r\n\r\n\r\n#Pfingsten #YOURTIMES #Immobilien #Immobilienwirtschaft #Immobilienmarkt #Danke #Feiertage	2025-06-07 22:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
79	2. Advent – Gemeinsam Werte schaffen. 🎄 \n\nMit der zweiten Adventskerze blicken wir auf ein Jahr voller Dynamik, Herausforderungen und Erfolge zurück.\n \nWerte wie Nachhaltigkeit, Vertrauen und Verlässlichkeit stehen für uns im Mittelpunkt – nicht nur in unseren Projekten, sondern auch in unseren Partnerschaften. \n\nLassen Sie uns den Moment nutzen, um innezuhalten und uns auf die verbleibenden Wochen des Jahres zu konzentrieren. \n\nWir wünschen Ihnen einen besinnlichen zweiten Advent! \n\n#YOURTIMES#YOURTIMESREALESTATE#Immobilienbranche#Werte	2025-12-06 23:00:00	f	8	\N	7	2025-03-10 10:03:08.884	8	\N	public	\N	post	draft	\N	\N
58	🌿 7. April – Weltgesundheitstag: Zeit, auf uns selbst zu achten 💙\n\nGesundheit – das ist so viel mehr als die Abwesenheit von Krankheit. Es ist das Fundament, auf dem alles aufbaut: unser Wohlbefinden, unsere Energie, unsere Fähigkeit, für andere da zu sein. Und genau daran erinnert uns der heutige Weltgesundheitstag.\n\nIn meinem Alltag spüre ich oft, wie leicht man die eigenen Grenzen übersehen kann. Deadlines, Termine, das nächste Projekt – wir sind ständig in Bewegung. Doch wenn wir nicht auf uns achten, holt uns das irgendwann ein. Gesundheit beginnt damit, sich selbst wichtig zu nehmen.\n\nOb bei meinen Kundinnen und Kunden, meinen Kolleginnen und Kollegen oder mir selbst: Ich sehe immer wieder, wie entscheidend ein gesundes Umfeld ist. Ein Zuhause, das Geborgenheit schenkt. Ein Arbeitsplatz, an dem man sich wohlfühlt. Und vor allem Menschen, die sich gegenseitig unterstützen und füreinander da sind.\n\n💬 Was tust Du heute, um Dir etwas Gutes zu tun? Vielleicht ein Spaziergang, ein gutes Gespräch oder einfach mal tief durchatmen? Schreib es mir gern – lass uns Ideen sammeln, wie wir unsere Gesundheit gemeinsam stärken können!\n\n#Weltgesundheitstag #Achtsamkeit #Immobilien #Gesundheit #Menschlichkeit #Zuhause	2025-04-06 22:00:00	f	8	\N	6	2025-03-10 09:18:51.797	8	\N	public	\N	post	draft	\N	\N
57	\r\nHeute ist der Internationale Tag des Glücks, und das ist der perfekte Moment, um innezuhalten und uns daran zu erinnern, was wirklich zählt: die kleinen und großen Dinge, die uns ein Lächeln ins Gesicht zaubern.\r\n\r\nIn meiner Arbeit erlebe ich immer wieder, wie eng Glück und Zuhause miteinander verbunden sind. 🏡 Der Moment, wenn Kundinnen und Kunden ihr neues Zuhause betreten, ist unbezahlbar. Es sind diese Augenblicke, in denen ich spüre: Das ist mehr als nur ein Job – es geht darum, Menschen ein Stück Glück zu schenken.\r\n\r\nAber Glück findet sich nicht nur in großen Meilensteinen. Es steckt in einem herzlichen Gespräch, einem unerwarteten Lächeln oder der Freude, Teil eines großartigen Teams zu sein. ✨\r\n\r\nMein persönliches Glück heute?\r\n\t•\tDie Menschen, mit denen ich zusammenarbeite.\r\n\t•\tDie Herausforderungen, die mich wachsen lassen.\r\n\t•\tUnd die vielen kleinen Erfolge, die uns alle miteinander verbinden. ❤️\r\n\r\n💬 Was macht Dich heute glücklich? Schreib es in die Kommentare – ich freue mich, Deine Glücksmomente zu lesen!\r\n\r\n#InternationalDayOfHappiness #Glück #Dankbarkeit #Immobilien #Menschlichkeit #Zuhause #Zusammenarbeit	2025-03-19 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	deleted	\N	2025-03-13 18:34:09.661
60	der zweite Absatz: bitte umschreiben...nicht immer Menschen und Zuhause finden. Ich bin Investmentmaklerin! irgendwann ist es im Kopf drin :-)\nAbsatz 1, 3, 4 sind super .-)\n\n\n🐣🌸 Frohe Ostern – Zeit für Neubeginn und Zuversicht! 🌸🐣\n\nOstern ist für mich mehr als nur ein Fest mit bunten Eiern und Schokolade – es ist ein Symbol für Neubeginn, Hoffnung und Gemeinschaft. 💛 Gerade im Frühling spürt man diese besondere Energie: Die Natur erwacht, alles wird heller und es fühlt sich an, als würden wir alle ein kleines Stück „neu starten“.\n\nAuch in der Immobilienwelt erlebe ich oft solche Neuanfänge. 🏡 Menschen, die sich für ein neues Zuhause entscheiden, Unternehmen, die neue Räume gestalten, oder Teams, die gemeinsam etwas aufbauen. Jeder Abschied von Altem macht Platz für etwas Neues – manchmal mit ein wenig Unsicherheit, aber immer mit der Chance auf Wachstum.\n\nDeshalb wünsche ich Dir heute ein Osterfest voller Freude, Zuversicht und Zeit mit den Menschen, die Dir wichtig sind. Genieße die kleinen Momente, tanke neue Energie und vielleicht lässt Du Dich von der Frühlingsstimmung zu neuen Ideen inspirieren. 🌿✨\n\n💬 Was bedeutet Ostern für Dich? Ist es für Dich ein Fest der Tradition oder eher eine Zeit der Entspannung? Ich freue mich auf Deine Gedanken!\n\n#FroheOstern #Neubeginn #Zuversicht #Immobilien #Menschlichkeit #Vertrauen #Zusammenhalt	2025-04-19 22:00:00	f	8	\N	6	2025-03-13 19:14:39.868	7	\N	public	\N	post	draft	\N	\N
62	🌸 Muttertag – Ein Tag für all die starken Frauen, die unser Leben prägen ❤️\r\n\r\nHeute ist Muttertag – ein Tag, an dem wir Danke sagen. Danke für die bedingungslose Liebe, die unermüdliche Unterstützung und die Kraft, mit der Mütter Tag für Tag für ihre Familien da sind.\r\n\r\nMütter sind so viel mehr als nur „Mama“. Sie sind Mutmacherinnen, Wegweiserinnen, Vorbilder, Zuhörerinnen und oft auch Heldinnen des Alltags. 💪 Sie jonglieren Familie, Beruf, eigene Träume und all die kleinen Dinge, die oft unsichtbar bleiben, aber das Leben so besonders machen.\r\n\r\nAuch in meinem beruflichen Alltag begegnen mir immer wieder beeindruckende Frauen, die für ihre Familien ein Zuhause schaffen – nicht nur aus Stein und Wänden, sondern mit Liebe, Geborgenheit und Wärme. 🏡💛\r\n\r\nDeshalb heute mein tiefster Respekt und Dank an alle Mütter und diejenigen, die für andere eine Mutterrolle übernehmen. Ihr seid unbezahlbar!\r\n\r\n💬 Gibt es eine Frau in Deinem Leben, der Du heute „Danke“ sagen möchtest? Teile es gern in den Kommentaren – oder sag es ihr einfach direkt! 💐\r\n\r\n#Muttertag #DankeMama #StarkeFrauen #Familie #Liebe #Menschlichkeit #Zuhaus #YOURTIMES	2025-05-10 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
63	👔🕊️ Christi Himmelfahrt & Vatertag – Ein Tag für Aufbruch, Werte und Dankbarkeit 💙\r\n\r\nHeute verbinden sich zwei besondere Anlässe: Christi Himmelfahrt und Vatertag. Zwei Tage, die auf den ersten Blick unterschiedlich erscheinen, aber eine wichtige Gemeinsamkeit haben: Sie erinnern uns an Wegweiser in unserem Leben.\r\n\r\nChristi Himmelfahrt steht für Veränderung, für den Mut, neue Wege zu gehen und Vertrauen in das zu haben, was vor uns liegt. Jeder Aufbruch birgt Chancen, auch wenn er mit Unsicherheit verbunden ist. Das sehe ich auch in meiner Arbeit immer wieder – ob beim Kauf eines Hauses oder einem beruflichen Neuanfang: Wer losgeht, kann Großes erreichen. 🏡✨\r\n\r\nDer Vatertag ist ein Tag der Dankbarkeit. Für all die Väter und Vaterfiguren, die uns begleiten, uns Werte vermitteln, uns unterstützen und an uns glauben. Väter sind oft die stillen Helden des Alltags – die, die da sind, ohne viele Worte, die uns Mut machen, wenn wir ihn brauchen, und uns zeigen, dass wir alles schaffen können.\r\n\r\nOb als Kind, Elternteil oder einfach als Mensch in einer Gemeinschaft: Wir alle profitieren von denen, die uns stärken.\r\n\r\n💬 Was hat Dich in Deinem Leben geprägt – eine Vaterfigur, eine wichtige Entscheidung, ein mutiger Schritt? Erzähl mir gern Deine Geschichte!\r\n\r\n#ChristiHimmelfahrt #Vatertag #Wegbegleiter #Dankbarkeit #Mut #Menschlichkeit #Vertrauen #Zusammenhalt	2025-05-28 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
64	🕊️ Pfingsten – Zeit für neue Energie, Gemeinschaft und Inspiration ✨\r\n\r\nPfingsten ist ein besonderes Fest. Es steht für Neuanfang, Inspiration und die Kraft der Gemeinschaft. In der christlichen Tradition erinnert es an den Moment, in dem Menschen mit neuer Energie und Klarheit losgegangen sind, um ihre Ideen in die Welt zu tragen.\r\n\r\nUnd genau das ist ein Gedanke, der mich auch in meinem Alltag begleitet. Wann hast Du zuletzt gespürt, dass Dich etwas wirklich inspiriert? Vielleicht ein gutes Gespräch, ein neues Projekt oder ein Moment, der Dir gezeigt hat: Jetzt ist der richtige Zeitpunkt, um etwas zu bewegen.\r\n\r\nPfingsten ist für viele auch einfach ein langes Wochenende – eine Gelegenheit, durchzuatmen, Zeit mit Familie und Freunden zu verbringen oder sich bewusst eine Pause zu gönnen. Denn neue Energie entsteht oft genau dann, wenn wir uns erlauben, kurz innezuhalten.\r\n\r\nIch wünsche Dir ein wunderschönes Pfingstfest – mit viel Inspiration, wertvollen Begegnungen und vielleicht sogar einer neuen Idee, die Dich weiterbringt! 💡💛\r\n\r\n💬 Was gibt Dir neue Energie und Inspiration? Ich freue mich auf Deine Gedanken in den Kommentaren!\r\n\r\n#Pfingsten #Inspiration #Neuanfang #Gemeinschaft #Menschlichkeit #Zusammenhalt #Immobilien	2025-06-07 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
65	🕊️ Friedensfest – Ein Tag, der uns alle verbindet 💙\r\n\r\nFrieden. Ein Wort mit so viel Bedeutung. Ein Zustand, den wir oft als selbstverständlich hinnehmen – bis wir sehen, wie zerbrechlich er sein kann. Heute, am Friedensfest, geht es nicht nur um den Frieden in der Welt, sondern auch um den Frieden in uns selbst, in unseren Beziehungen und in unserer Gesellschaft.\r\n\r\nEchter Frieden beginnt im Kleinen: mit Respekt, mit Zuhören, mit Verständnis. In meiner Arbeit erlebe ich immer wieder, wie wichtig es ist, Brücken zu bauen – zwischen Käuferinnen und Käufern, Mieterinnen und Mietern, Partnerinnen und Partnern. Denn wo Menschen aufeinandertreffen, gibt es immer unterschiedliche Perspektiven. Doch genau darin liegt die Chance: gemeinsam Lösungen zu finden, anstatt Gegensätze zu betonen.\r\n\r\nEin Zuhause zu finden, bedeutet für viele Menschen auch, einen Ort des Friedens zu schaffen. 🏡 Einen Ort, an dem sie sich sicher fühlen, an dem sie ankommen dürfen. Gerade in Zeiten, in denen Unruhe und Unsicherheit viele begleiten, ist es umso wichtiger, Räume für Zusammenhalt, Vertrauen und Menschlichkeit zu schaffen.\r\n\r\nLasst uns diesen Tag als Erinnerung nehmen, dass Frieden keine Selbstverständlichkeit ist – aber dass wir alle dazu beitragen können, ihn zu bewahren. Jeden Tag, mit jedem Gespräch und mit jeder Entscheidung.\r\n\r\n💬 Was bedeutet Frieden für Dich? Ich freue mich auf Deine Gedanken in den Kommentaren.\r\n\r\n#Friedensfest #Zusammenhalt #Menschlichkeit #Vertrauen #Immobilien #Zuhause #Respekt	2025-08-07 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
66	🌈 Weltkindertag – Für eine Zukunft voller Chancen und Geborgenheit 🧡👧👦\r\n\r\nKinder sind unsere Zukunft – und genau daran erinnert uns der Weltkindertag. Ein Tag, an dem wir uns bewusst machen, dass jedes Kind das Recht auf Liebe, Schutz, Bildung und ein sicheres Zuhause hat.\r\n\r\nAls Immobilienexpertin sehe ich oft, wie wichtig ein echtes Zuhause für Familien ist. 🏡 Ein Ort, an dem Kinder spielen, lernen, wachsen – und einfach Kind sein dürfen. Ein Ort, der Geborgenheit schenkt und Erinnerungen entstehen lässt. Doch leider haben nicht alle Kinder diese Sicherheit.\r\n\r\nDeshalb ist es umso wichtiger, dass wir uns fragen: Wie können wir dazu beitragen, dass Kinder überall die besten Chancen auf eine glückliche Zukunft haben? Sei es durch mehr Zeit, durch Zuhören oder durch Unterstützung für Organisationen, die sich für Kinderrechte einsetzen.\r\n\r\nJedes Kind verdient es, gesehen, gehört und gefördert zu werden. Lasst uns gemeinsam daran arbeiten, eine Welt zu schaffen, in der Kinder ohne Sorgen groß werden können. 💛\r\n\r\n💬 Was wünschst Du Dir für die Kinder dieser Welt? Schreib es in die Kommentare – lass uns gemeinsam ein Zeichen setzen!\r\n\r\n#Weltkindertag #KinderSindUnsereZukunft #Geborgenheit #Chancengleichheit #Menschlichkeit #Zuhause #Verantwortung	2025-09-19 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
67	🕯️ St. Martin – Teilen, Licht schenken und füreinander da sein ❤️\r\n\r\nDer Martinstag erinnert uns an eine einfache, aber kraftvolle Botschaft: Teilen macht die Welt wärmer.\r\n\r\nDie Geschichte von St. Martin, der seinen Mantel mit einem frierenden Bettler teilte, ist zeitlos. Sie zeigt uns, dass es oft die kleinen Gesten sind, die den größten Unterschied machen – ein offenes Ohr, ein freundliches Wort oder eine helfende Hand.\r\n\r\nGerade in der Immobilienbranche sehe ich oft, wie wichtig es ist, Menschen nicht nur Räume, sondern ein echtes Zuhause zu geben. 🏡 Ein Ort, an dem sie sich sicher und geborgen fühlen. Doch nicht jeder hat dieses Glück. Umso mehr sollten wir darüber nachdenken, wie wir unsere Möglichkeiten nutzen können, um Licht in das Leben anderer zu bringen.\r\n\r\nDie Laternen, die heute durch die Straßen leuchten, sind für mich ein Symbol: Jeder von uns kann ein Licht sein. Ob im Beruf oder im Alltag – Menschlichkeit, Mitgefühl und Hilfsbereitschaft machen den Unterschied.\r\n\r\n💬 Wann hast Du zuletzt erlebt, dass jemand eine kleine, aber bedeutende Geste der Nächstenliebe gezeigt hat? Erzähl es gern in den Kommentaren!\r\n\r\n#StMartin #TeilenMachtGlücklich #Menschlichkeit #Zusammenhalt #Zuhause #LichtImDunkeln #Nächstenliebe	2025-11-10 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
68	🇩🇪 Tag der Deutschen Einheit – Ein Tag der Chancen und des Wandels\r\n\r\nDer 3. Oktober ist für mich nicht nur ein historisches Datum, sondern auch ein Symbol für Wandel, Zusammenhalt und neue Chancen. Als Unternehmerin und Immobilienexpertin erinnere ich mich daran, wie wichtig es ist, auf Veränderungen zuzugehen, sie anzunehmen und sie aktiv mitzugestalten.\r\n\r\nEs ist beeindruckend, was wir als Gemeinschaft schaffen können, wenn wir zusammenarbeiten und uns gegenseitig unterstützen. Dieser Tag ist für mich auch eine Erinnerung daran, wie wir jeden Tag kleine und große Schritte unternehmen können, um Positives zu bewirken – sowohl beruflich als auch privat. ✨\r\n\r\nLasst uns die Chancen nutzen, die sich uns bieten, und gemeinsam wachsen! 💪\r\n\r\nHashtag#TagDerDeutschenEinheit Hashtag#ChancenErgreifen Hashtag#GemeinsamWachsen #YOURTIMES	2025-10-02 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
70	💙 Internationaler Tag der Pflege – Ein Hoch auf die wahren Heldinnen und Helden des Alltags! 🏥✨\r\n\r\nHeute ist Internationaler Tag der Pflege, und ich finde, das ist einer der wichtigsten Tage, um innezuhalten und Danke zu sagen.\r\n\r\nPflegekräfte sind die Menschen, die immer da sind – oft dann, wenn es uns am verletzlichsten macht. Sie arbeiten mit Herz, Verstand und unglaublichem Durchhaltevermögen, um anderen zu helfen. Ohne sie wäre unser Gesundheitssystem schlicht nicht denkbar.\r\n\r\nAuch in meiner Arbeit begegnen mir viele Pflegekräfte – ob bei der Wohnungssuche, dem Wunsch nach einem neuen Zuhause oder als Teil eines Teams, das altersgerechtes Wohnen gestaltet. Sie kümmern sich nicht nur um Menschen, sie gestalten unser gesellschaftliches Miteinander mit.\r\n\r\nDoch Pflege darf nicht nur an einem Tag im Jahr gewürdigt werden. Es braucht Respekt, faire Bedingungen und echte Wertschätzung – 365 Tage im Jahr.\r\n\r\n💬 Kennst Du jemanden, der in der Pflege arbeitet und dem Du heute einfach mal „Danke“ sagen möchtest? Lass uns gemeinsam ein Zeichen der Anerkennung setzen!\r\n\r\n#InternationalerTagDerPflege #PflegeIstWertvoll #Danke #Respekt #Menschlichkeit #Zusammenhalt #Vertrauen	2025-05-11 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
71	🏗️✨ Tag der Architektur – Wenn Schönheit auf Statik trifft! 😆\r\n\r\nHeute feiern wir den Tag der Architektur – also lasst uns mal einen Moment innehalten und die Menschen feiern, die unsere Städte prägen, unsere Wohnträume verwirklichen und uns mit ihren kreativen Entwürfen manchmal zum Staunen (und manchmal zum Kopfschütteln) bringen! 🎨🏡\r\n\r\nDenn, seien wir ehrlich:\r\n🔹 Architektur kann atemberaubend sein! Aber manchmal fragt man sich auch: „Hat das Dach wirklich einen Grund, schräger zu sein als meine Montagmorgen-Laune?“ 🤔😂\r\n🔹 Form follows function – es sei denn, die Funktion ist, sich durch ein Labyrinth aus Glaswänden zu kämpfen, um die Toilette zu finden. 🚻🙈\r\n🔹 Ein gut durchdachtes Haus macht das Leben schöner. Aber ein Architekt mit Humor baut eine Treppe, die ins Nichts führt – nur für den Überraschungseffekt. 😅\r\n\r\nSpaß beiseite: Gute Architektur ist viel mehr als nur Design. Sie beeinflusst, wie wir leben, arbeiten und uns wohlfühlen. Ob Altbau mit Charme oder moderne Glasfassaden – Architektur erzählt Geschichten. Und genau das liebe ich an meiner Arbeit mit Immobilien. 🏡💙\r\n\r\n💬 Was ist das beeindruckendste oder verrückteste Gebäude, das Du je gesehen hast? Schreib es mir in die Kommentare – ich bin gespannt!\r\n\r\n#TagDerArchitektur #DesignOderDesaster #Immobilien #Baukultur #Menschlichkeit #FormFollowsFunction	2025-06-23 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
72	💼 Tag der Kleinst-, kleinen und mittleren Unternehmen – Die wahren Macher unserer Wirtschaft! 🚀\r\n\r\nHeute feiern wir die KMUs – die Kleinen und Mittelständischen Unternehmen, die unser tägliches Leben und unsere Wirtschaft prägen. Und seien wir ehrlich: Ohne sie würde vieles einfach nicht laufen!\r\n\r\nOb der Familienbetrieb von nebenan, die innovative Start-up-Idee oder das Traditionsunternehmen, das seit Generationen besteht – es sind genau diese Unternehmen, die mit Leidenschaft, Mut und Durchhaltevermögen unser Land voranbringen. 💪✨\r\n\r\nAls Immobilienexpertin arbeite ich täglich mit Unternehmerinnen und Unternehmern zusammen, die neue Standorte suchen, Räume für ihre Visionen brauchen oder ihren Betrieb auf die nächste Stufe heben wollen. Hinter jedem Unternehmen stehen Menschen mit Träumen, Ideen und harter Arbeit – genau das verdient heute besondere Anerkennung.\r\n\r\nKleine Unternehmen sind oft groß im Herzen – und genau das macht sie so wertvoll. Also lasst uns heute besonders die lokalen Unternehmen unterstützen, die mit viel Herzblut dafür sorgen, dass unsere Innenstädte lebendig bleiben, Innovationen entstehen und Arbeitsplätze geschaffen werden.\r\n\r\n💬 Hast Du ein Lieblingsunternehmen, ohne das Dein Alltag nicht funktionieren würde? Markiere es in den Kommentaren und zeige ihnen Deine Unterstützung! 👇💙\r\n\r\n#TagDerKMU #Unternehmertum #LokalIstGenial #Immobilien #Zusammenhalt #WirtschaftMitHerz	2025-06-26 22:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
76	💪 Tag der Unternehmerin – Frauen, die Wirtschaft bewegen! 🚀✨\r\n\r\nHeute feiern wir all die Unternehmerinnen, die mit Mut, Leidenschaft und Durchhaltevermögen ihre eigenen Wege gehen. Frauen, die nicht nur Ideen haben, sondern sie auch umsetzen – trotz Herausforderungen, Zweifeln und manchmal auch Gegenwind.\r\n\r\nDenn Frauenpower ist, wenn Stärke auf Fingerspitzengefühl trifft. 💡💙 Unternehmerinnen bringen nicht nur Fachwissen und Entscheidungsstärke mit, sondern auch die Fähigkeit, klug zu vernetzen, empathisch zu führen und neue Perspektiven zu schaffen.\r\n\r\nIn der Immobilienbranche erlebe ich täglich, wie wichtig starke Frauen sind – als Entscheiderinnen, Netzwerkerinnen und Macherinnen. Deshalb heute ein Hoch auf all die Frauen, die ihren eigenen Weg gehen, die Wirtschaft mitgestalten und anderen Mut machen. Lasst uns gemeinsam Erfolge feiern und noch mehr Frauen ermutigen, ihre Träume in die Tat umzusetzen!\r\n\r\n💬 Welche Unternehmerin inspiriert Dich besonders?\r\n\r\n#TagDerUnternehmerin #FrauenImBusiness #Frauenpower #Macherinnen #Immobilien #Selbstständigkeit #Mut #Erfolg	2025-11-18 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
77	🧡 Internationaler Tag gegen Gewalt an Frauen – Hinschauen, statt wegsehen! 🚫\r\n\r\nHeute ist ein Tag, der uns daran erinnert, dass Gewalt gegen Frauen kein Tabuthema sein darf. Jede dritte Frau weltweit erlebt in ihrem Leben physische oder sexualisierte Gewalt. Das sind keine Zahlen – das sind Schicksale.\r\n\r\nOb in der Familie, im Job oder im Alltag: Niemand sollte Angst haben müssen. Doch viel zu oft wird geschwiegen, übersehen oder verharmlost. Deshalb ist es wichtig, hinzuschauen, zuzuhören und Betroffene zu unterstützen.\r\n\r\nEin sicheres Zuhause bedeutet nicht nur vier Wände – es bedeutet Schutz, Würde und Respekt. 🏡 Deshalb ist dieser Tag ein Aufruf an uns alle: Lasst uns gemeinsam ein Zeichen setzen für eine Welt, in der Frauen ohne Angst leben können.\r\n\r\n#NeinZuGewalt #SchweigenBrechen #Respekt #Menschlichkeit #Zusammenhalt #HinschauenStattWegsehen	2025-11-24 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
78	🌲 Weihnachten – Werte schaffen, Perspektiven gestalten\r\n\r\nDie Weihnachtszeit ist ein Moment, um das vergangene Jahr Revue passieren zu lassen: 2025 war für uns geprägt von Innovation, Stabilität und einer Vielzahl erfolgreicher Projekte, die wir gemeinsam mit Ihnen realisieren durften.\r\nAls Ihr Partner in dieser besonderen Immobilienwelt sind wir stolz darauf, mit Ihnen an wegweisenden Lösungen zu arbeiten – sei es bei der Projektentwicklung, Investitionen oder nachhaltigen Konzepten. Unsere Branche verlangt Weitsicht, Vertrauen und eine starke Zusammenarbeit, und dafür möchten wir uns bei Ihnen ganz herzlich bedanken. 🤝 \r\n\r\nLassen Sie uns 2026 weiterhin als Partner an Ihrer Seite stehen, um Innovationen voranzutreiben, Werte zu schaffen und gemeinsam neue Herausforderungen anzugehen.\r\n\r\nWir wünschen Ihnen und Ihren Familien frohe Weihnachten und besinnliche Feiertage. Lassen Sie uns das neue Jahr gemeinsam erfolgreich gestalten! ✨\r\n\r\n#YOURTIMES #Immobilienmarkt #Weihnachten #Zusammenarbeit #Nachhaltigkeit \r\n#Innovation	2025-12-23 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
80	🕯️ 2. Advent – Raum für Reflektion und Gemeinschaft. ✨\r\n \r\nMit der zweiten Kerze auf dem Adventskranz wird mir bewusst, wie wertvoll die Menschen in meinem Umfeld sind – Kolleginnen, Kunden und Partner, die mich begleiten und inspirieren. \r\n\r\nIn der Immobilienbranche geht es um mehr als nur Projekte und Zahlen. Es geht darum, wie wir gemeinsam Orte schaffen, die das Leben der Menschen bereichern. 🌟 \r\n\r\nMein Dank gilt all jenen, die mit Herzblut dabei sind und die Adventszeit zu einer Zeit des Miteinanders machen. \r\n\r\nLassen wir uns inspirieren, innezuhalten und auf das zu schauen, was wirklich zählt: Vertrauen und Gemeinschaft. 💚 \r\n#ZweiterAdvent #Reflektion #Gemeinschaft #ImmobilienmitHerz #Zusammenhalt #ImmobilienvermarktungistVertrauenssache	2025-12-06 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
81	1. Advent – Ein Moment der Besinnung 🎄\r\n\r\nMit dem ersten Advent beginnt die besinnliche Zeit des Jahres. Es ist der Moment, innezuhalten, den Kerzenschein zu genießen und sich auf die kommenden Wochen einzustimmen. \r\n\r\nAuch in der Immobilienbranche ist dies eine Zeit des Rückblicks und der Perspektive: Was wurde erreicht und welche Ziele sollen im neuen Jahr verwirklicht werden? \r\n\r\nDie wirtschaftlichen als auch die politischen Rahmenbedingungen werden nicht nur für die #Immobilienbranche weitere Herausforderungen bedeuten.\r\n\r\nDas Team der YOUR TIMES REAL ESTATE wünscht Ihnen einen wundervollen ersten Advent und eine harmonische Vorweihnachtszeit. 🕯️\r\n\r\n#YOURTIMES #YOURTIMESREALESTATE #Immobilien #Advent #Besinnlichkeit	2025-11-29 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
82	Weihnachten – eine Zeit zum Innehalten 💝 \r\n \r\nWeihnachten bedeutet für mich, kurz durchzuatmen und den Blick auf das zu richten, was wirklich zählt. Dieses Jahr hat mich einmal mehr daran erinnert, wie wichtig Vertrauen und echte Begegnungen sind – sei es in der Zusammenarbeit, in Gesprächen oder in gemeinsamen Projekten.\r\n \r\nIch habe 2025 so viele inspirierende Menschen treffen dürfen, die mich bestärkt haben, dass wir in unserer Branche viel bewegen können, wenn wir den Mut haben, anders zu denken. 🙏 \r\nImmobilien sind weit mehr als Wände und Räume – sie sind Orte, an denen Leben passiert, Geschichten entstehen und Verbindungen geknüpft werden.\r\n \r\nIch wünsche Euch und Euren Lieben ein Weihnachtsfest voller Wärme, Freude und Zuversicht. Danke, dass ihr ein wichtiger Teil dieser Reise seid. Lasst uns 2026 gemeinsam Großes schaffen & mutig sein - egal welche Herausforderungen zu meistern sind! 💖 Besinnliche Weihnachten!\r\n \r\n#Weihnachten #Vertrauen #Gemeinschaft #Inspiration #ImmobilienmitHerz #Zusammenhalt\r\n	2025-12-23 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
83	🎄 1. Advent – Zeit für #Wärme und #Dankbarkeit 🕯️\r\n\r\nHeute brennt die erste Kerze auf dem Adventskranz und erinnert uns daran, innezuhalten und das Jahr Revue passieren zu lassen. Für mich ist die Adventszeit nicht nur eine Phase der Besinnung, sondern auch eine Zeit, um „Danke“ zu sagen – an die Menschen, die meinen Alltag bereichern. ❤️\r\n\r\nDieses Jahr war geprägt von Begegnungen, die mir gezeigt haben, dass es in der Immobilienbranche nicht nur um Gebäude geht, sondern um Vertrauen, Zusammenarbeit und die Geschichten, die wir gemeinsam schreiben. 🌟 \r\n\r\nOb Kundinnen und Kunden, Kolleginnen und Kollegen oder Partnerinnen und Partner – Ihr alle habt einen Beitrag geleistet, der über beruflichen Erfolg hinausgeht: Ihr habt Herz gezeigt. Dafür bin ich unendlich dankbar. 🙏 \r\n\r\nIn diesem Sinne: Lasst uns die Adventszeit nutzen, um einander kleine Freuden zu bereiten, Gutes zu tun und den Fokus auf das zu legen, was wirklich zählt – Menschlichkeit. 💚\r\n\r\n#ErsterAdvent #Immobilien #Vertrauen #Zusammenarbeit #Menschlich	2025-11-29 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
92	Tag der KMU – Die wahren Macher der Wirtschaft! 🚀💼\r\n\r\nKleinst-, kleine und mittlere Unternehmen (KMU) sind das Rückgrat unserer Wirtschaft. Sie stehen für Innovation, Flexibilität und nachhaltiges Wachstum – und ohne sie würde vieles nicht laufen. 90 % aller Unternehmen weltweit gehören zu den KMU und schaffen Millionen von Arbeitsplätzen.\r\n\r\nGerade im Immobiliensektor sehen wir täglich, welche entscheidende Rolle diese Unternehmen spielen:\r\n🏢 Standortentwicklung – Vom lokalen Gewerbebetrieb bis zum wachstumsstarken Mittelständler.\r\n📈 Investitionen – Dynamische Unternehmen sind oft Impulsgeber für nachhaltige Stadtentwicklung.\r\n🤝 Wirtschaftlicher Erfolg – KMU treiben Innovationen voran und prägen unsere Innenstädte.\r\n\r\nAls YOUR TIMES REAL ESTATE begleiten wir Unternehmen dabei, die passenden Immobilienlösungen für ihre Zukunft zu finden – sei es durch Standortanalysen, bedarfsgerechte Flächenkonzepte oder strategische Beratung für nachhaltige Investments.\r\n\r\n💬 Welche Unternehmen machen für Sie den Unterschied? Markieren Sie Ihre Favoriten in den Kommentaren und setzen Sie ein Zeichen für den Mittelstand! 👇\r\n\r\n#YOURTIMES #TagDerKMU #Wirtschaftsmotor #Standortstrategie #Immobilien #Unternehmertum #NachhaltigesWachstum	2025-06-26 22:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
93	Welttag des Wohn- und Siedlungswesens – Zukunftsfähige Wohnkonzepte für jede Lebensphase! 🏡🌍✨\r\n\r\nWohnen ist weit mehr als ein Dach über dem Kopf – es ist ein entscheidender Faktor für Lebensqualität, soziale Teilhabe und nachhaltige Stadtentwicklung. Besonders in einer alternden Gesellschaft müssen wir sicherstellen, dass Wohnraum nicht nur verfügbar, sondern auch anpassungsfähig, barrierefrei und zukunftssicher ist.\r\n\r\nFür Investoren, Projektentwickler und Entscheidungsträger bedeutet das:\r\n🏗 Nachhaltige Wohnkonzepte – Seniorenwohnen, Betreutes Wohnen und Mehrgenerationenquartiere gewinnen an Bedeutung.\r\n📍 Standortstrategie – Die richtige Infrastruktur und soziale Vernetzung sind essenziell für lebenswerte Quartiere.\r\n🏢 Immobilien als Zukunftsinvestition – Wohnimmobilien müssen flexibel sein, um langfristig den demografischen Wandel zu meistern.\r\n\r\nAls YOUR TIMES REAL ESTATE begleiten wir Projekte, die Wohnqualität mit wirtschaftlicher Nachhaltigkeit verbinden – ob durch Zukunftswohnen Lindenberg, Seniorenwohnen Biesenthal oder weitere Healthcare-Immobilien.\r\n\r\n#YOURTIMES #WelttagDesWohnens #HealthcareImmobilien #Seniorenwohnen #NachhaltigeInvestitionen #Standortstrategie	2025-09-30 22:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
94	🕯️ St. Martin – Teilen, Licht schenken, füreinander da sein ❤️\r\n\r\nDer Martinstag erinnert uns daran: Teilen macht die Welt wärmer. Die Geschichte von St. Martin zeigt, dass kleine Gesten große Wirkung haben – sei es ein offenes Ohr, ein freundliches Wort oder eine helfende Hand.\r\n\r\nGerade in der Immobilienbranche geht es nicht nur um Räume, sondern um ein echtes Zuhause. 🏡 Doch nicht jeder hat dieses Glück. Lassen Sie uns darüber nachdenken, wie wir Licht in das Leben anderer bringen können.\r\n\r\n#YOURTIMES #StMartin #Menschlichkeit #Zusammenhalt #Zuhause #LichtSchenken	2025-11-10 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
89	Welches Foto?\n\n📢 7. April – Weltgesundheitstag: Ihr Wohlbefinden im Fokus 💙🌿\n\nGesundheit ist mehr als die Abwesenheit von Krankheit – sie ist die Basis für Lebensqualität und Zufriedenheit. In einem Zuhause, das Geborgenheit schenkt, und einem Umfeld, das unterstützt, lässt es sich nachhaltig gut leben.\n\nGerade im hektischen Alltag vergessen wir oft, auf uns selbst zu achten. Doch nur, wenn wir unser Wohlbefinden ernst nehmen, können wir langfristig leistungsfähig und glücklich sein.\n\n💬 Was tun Sie heute für Ihre Gesundheit? Vielleicht ein Spaziergang, ein Moment der Ruhe oder ein gutes Gespräch? Teilen Sie Ihre Ideen mit uns!\n\n#YOURTIMES #Weltgesundheitstag #Achtsamkeit #Gesundheit #Zuhause #Wohlbefinden	2025-04-06 22:00:00	f	8	\N	7	2025-03-13 18:39:59.174	7	\N	public	\N	post	draft	\N	\N
90	Bild? \n\n📢 1. Mai – Tag der Arbeit: Mehr als nur ein freier Tag 💪💼\n\nHeute erinnern wir uns daran, wie wichtig unsere tägliche Arbeit ist – aber auch, wie entscheidend gute Arbeitsbedingungen, Fairness und Wertschätzung sind.\n\nArbeit bedeutet mehr als nur ein Einkommen. Sie gibt Struktur, Sinn und oft Erfüllung. Besonders in der Immobilienbranche sehen wir täglich, wie Leidenschaft und Engagement den Unterschied machen. 🏡 Es sind nicht nur die Abschlüsse, die zählen, sondern die Menschen, die mit Herzblut Projekte verwirklichen.\n\nDoch heute geht es auch darum, innezuhalten: Arbeit ist wichtig – aber unser Wohlbefinden und Miteinander ebenso.\n\nWir sind dankbar für unser großartiges Team, starke Partnerschaften und alle, die mit Einsatz und Hingabe zum gemeinsamen Erfolg beitragen.\n\n#YOURTIMES #TagDerArbeit #Leidenschaft #Fairness #Immobilien #Zusammenhalt #Wertschätzung	2025-04-30 22:00:00	t	8	\N	7	2025-03-13 19:23:05.946	7	\N	public	\N	post	draft	\N	\N
91	Bild?\n\n📢 Internationaler Tag der Pflege – Ein Hoch auf die Heldinnen und Helden des Alltags! 💙🏥\n\nHeute ist ein wichtiger Tag, um innezuhalten und Danke zu sagen. Pflegekräfte sind immer da – mit Herz, Verstand und unglaublichem Engagement. Sie sorgen für unser Wohl und tragen maßgeblich zur Gesellschaft bei. Ohne sie wäre unser Gesundheitssystem nicht denkbar.\n\nAls YOUR TIMES REAL ESTATE sind wir stolz darauf, mit unseren Healthcare-Immobilien wie @Zukunftswohnen Lindenberg und Seniorenwohnen Biesenthal dazu beizutragen, dass altersgerechtes und betreutes Wohnen bestmöglich gestaltet wird. Denn ein Zuhause, das Sicherheit und Geborgenheit bietet, ist essenziell – für Pflegebedürftige ebenso wie für die Menschen, die sich täglich um sie kümmern.\n\nDoch Anerkennung für die Pflege darf nicht nur an einem Tag im Jahr stattfinden. Respekt, faire Bedingungen und echte Wertschätzung müssen selbstverständlich sein – 365 Tage im Jahr.\n\n💬 Kennen Sie jemanden, der in der Pflege arbeitet und dem Sie heute „Danke“ sagen möchten? Lassen Sie uns gemeinsam ein Zeichen der Anerkennung setzen!\n\n#YOURTIMES #InternationalerTagDerPflege #PflegeIstWertvoll #Danke #HealthcareImmobilien #Seniorenwohnen #Wertschätzung	2025-05-11 22:00:00	t	8	\N	7	2025-03-13 19:25:32.71	7	\N	public	\N	post	draft	\N	\N
88	📢 Internationaler Tag des Glücks – Ihr Zuhause als Schlüssel zum Wohlbefinden 🏡✨\r\n\r\nGlück bedeutet für jeden etwas anderes – doch eines ist sicher: Ein Zuhause spielt dabei eine zentrale Rolle. Der Moment, wenn unsere Kundinnen und Kunden ihr neues Heim betreten, ist für uns mehr als nur ein Geschäftsabschluss. Es ist der Augenblick, in dem wir sehen: Hier beginnt ein neues Kapitel voller Möglichkeiten und Lebensfreude.\r\n\r\nDoch Glück findet sich nicht nur in großen Meilensteinen. Es steckt auch in den kleinen Dingen des Alltags:\r\n✅ Ein erfolgreich abgeschlossener Immobilienkauf oder -verkauf.\r\n✅ Ein zufriedenes Lächeln nach einer guten Beratung.\r\n✅ Die Zusammenarbeit mit einem großartigen Team.\r\n\r\nWir bei YOUR TIMES REAL ESTATE sind stolz darauf, nicht nur Immobilien zu vermitteln, sondern Ihnen ein Stück Glück zu schenken.\r\n\r\n💬 Was macht Sie heute glücklich? Teilen Sie Ihre Glücksmomente in den Kommentaren!\r\n\r\n#YOURTIMES #InternationalDayOfHappiness #Glück #Zuhause #Immobilien #Lebensfreude #Zusammenarbeit	2025-03-19 23:00:00	t	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-03-13 18:34:02.349
59	Kannst Du bitte den Part Berufung - Mit Menschen helfen ein Zuhause zu finden abändern. Ichkann B2C machmal nicht mehr hören :-) Ich bin Investmentmaklerin!! und Mache Bauträger udn Projektentwickerprojekte siehe die schönen Artikel die Du schreibst. \nMeine Berufung ist meine Leidenschaft, meiner Lebensaufgabe treu zusein .-) (mein Lieblingssatz) Und Immobilien mit Passion zu entdecken bzw. Objekt eun Projekte zu "begreifen" etc.\n\n\n\n✨ 8. April – Welttag für Berufungen: Warum wir tun, was wir tun 💼❤️\n\nHeute feiern wir den Welttag für Berufungen – ein Tag, der uns daran erinnert, was uns antreibt, erfüllt und begeistert. Berufung ist mehr als nur ein Job oder eine Karriere. Es ist die Leidenschaft, die wir in das legen, was wir tun, und der Sinn, den wir darin finden.\n\nFür mich ist meine Berufung klar: Menschen dabei zu helfen, ein neues Zuhause zu finden. 🏡 Ein Ort, an dem sie sich sicher und geborgen fühlen, wo Erinnerungen entstehen und neue Kapitel beginnen. Genau das ist es, was mich jeden Tag aufs Neue motiviert.\n\nBerufung bedeutet aber auch, immer wieder über den Tellerrand hinauszuschauen. Verantwortung zu übernehmen, mit Herz und Verstand zu arbeiten und dabei nicht die Menschen aus den Augen zu verlieren, mit denen und für die wir arbeiten.\n\n💬 Was bedeutet Berufung für Dich? Hast Du sie schon gefunden? Ich freue mich, Deine Gedanken zu diesem Thema zu lesen – vielleicht inspirieren wir uns gegenseitig!\n\n#WelttagFürBerufungen #Berufung #Leidenschaft #Immobilien #Menschlichkeit #Vertrauen #Zusammenarbeit	2025-04-07 22:00:00	f	8	\N	6	2025-03-13 19:13:17.615	7	\N	public	\N	post	draft	\N	\N
86	Welches Bild. Bei solchen Feiertagsposts müssen die Bilder dann auch dabei sein bitte - erst dann sind sie komplett und müssen nicht doppelt oder kurz vor Ostern von mir nochmal bearbeitet werden :-)\n\n\n🐣🌸 Das Team von YOUR TIMES REAL ESTATE wünscht Ihnen frohe Ostern! Mögen diese Feiertage voller Freude, Lachen und wertvoller Momente sein. Genießen Sie die gemeinsame Zeit mit Ihren Liebsten und lassen Sie es sich gut gehen! Frohe Ostern vom YOUR TIMES REAL ESTATE Team! 🎉\n\n#Ostergrüße #FroheFeiertage #GemeinsameZeit #YOURTIMES #YOURTIMESREALESTATE #REALESTATE	2025-04-19 22:00:00	f	8	\N	7	2025-03-13 19:15:41.709	7	\N	public	\N	post	draft	\N	\N
69	kannst Du die ersten beiden Punkte neu machen bitte - nicht immer B2CThemen!! Ich bin Investmentmaklerin!! Das ist mir alles zuviel in die falsche Richtung auch wenn humorvoll!!\nbitte auf Residential oder Healtchcare oder Hotel oder Büro was finden..\n\n\n😂 Tag der Ehrlichkeit – Zeit für die ungeschminkte Wahrheit! 🤭\n\nHeute ist Tag der Ehrlichkeit, also also reden wir mal Klartext! 💬\n\n🔹 Ehrlich gesagt… Ich liebe meinen Job, aber wenn jemand sagt „Ich suche etwas Schönes, Günstiges und in bester Lage“, dann muss ich manchmal kurz schmunzeln. 😅\n\n🔹 Ehrlich gesagt… Besichtigungen sind nicht immer so glamourös wie in Hochglanzbroschüren. Schon mal in einem dunklen Keller nach dem Lichtschalter gesucht und stattdessen eine Spinnwebe gefunden? Been there. 🕷️💡\n\n🔹 Ehrlich gesagt… Immobilien sind Vertrauenssache. Und genau deshalb ist Ehrlichkeit das A und O. Wer offen kommuniziert – egal ob als Maklerin, Käufer oder Verkäufer – wird am Ende die besten Entscheidungen treffen. 🏡✨\n\nAber jetzt mal ehrlich – wann hat Dir schon mal eine ungefilterte Wahrheit den Tag gerettet (oder ruiniert)? Schreib es mir in die Kommentare, ich bin gespannt auf Deine Geschichten! 😆👇\n\n#TagDerEhrlichkeit #Tacheles #ImmobilienMitWahrheit #SpaßMussSein #Menschlichkeit #Vertrauen #YOURTIMES #JudithLenz	2025-04-29 22:00:00	f	8	\N	6	2025-03-13 19:18:23.509	7	\N	public	\N	post	draft	\N	\N
61	💼 1. Mai – Tag der Arbeit: Mehr als nur ein freier Tag 💪\r\n\r\nHeute ist Tag der Arbeit – ein Tag, der uns daran erinnert, wie wichtig unsere tägliche Arbeit ist, aber auch, wie wertvoll gute Arbeitsbedingungen, Fairness und gegenseitige Wertschätzung sind.\r\n\r\nArbeit ist so viel mehr als nur ein Mittel zum Zweck. Sie gibt uns Struktur, Sinn und oft auch Erfüllung. Besonders in der Immobilienbranche sehe ich, wie Leidenschaft und Engagement den Unterschied machen. 🏡 Es sind nicht nur die Abschlüsse, die zählen, sondern die Menschen, die mit Herzblut daran arbeiten, dass Wohnträume Wirklichkeit werden.\r\n\r\nAber heute geht es auch darum, innezuhalten: Arbeit ist wichtig – aber unsere Gesundheit, unser Wohlbefinden und unser Miteinander sind es auch.\r\n\r\nIch bin dankbar für mein großartiges Team, für Partnerinnen und Partner, die gemeinsam mit mir an einem Strang ziehen, und für alle, die mit Einsatz und Hingabe ihren Teil dazu beitragen, dass wir gemeinsam wachsen. 🙌\r\n\r\n💬 Was bedeutet Arbeit für Dich? Erfüllung, Herausforderung, Gemeinschaft? Schreib es gern in die Kommentare – ich freue mich auf Deine Gedanken!\r\n\r\n#TagDerArbeit #Leidenschaft #Fairness #Immobilien #Zusammenhalt #Menschlichkeit #YOURTIMES	2025-04-30 22:00:00	t	8	\N	6	2025-03-13 19:22:04.876	7	\N	public	\N	post	draft	\N	\N
56	Gute Idee aber doch nicht passend derzeit durch unsere anderen Themen. Und der Sonntag ist mir nicht wichtig. Danke für die Mühe aber vllt. können wir den Inhalt noch wann anders verwenden. Ist mir schon wiederzu viel B2C. Ah jetzt sehe ich erst, dass es ein Repost ist. Ne verzichten wir drauf. Nur YT postet.\n\n📖 16. März – Tag der Informationsfreiheit: Wissen teilen, Vertrauen stärken 💡\n\nIn einer Welt, die sich ständig verändert, ist Information der Schlüssel zu Fortschritt, Transparenz und Vertrauen. Genau darum geht es am Tag der Informationsfreiheit: Wissen zugänglich machen und Barrieren abbauen.\n\nIm Immobilienbereich zeigt sich das besonders deutlich. 🏡 Menschen stehen oft vor großen Entscheidungen – sei es der Kauf eines Eigenheims, eine Investition oder ein Mietvertrag. Und was brauchen sie dabei? Klare, verständliche und ehrliche Informationen.\n\n✨ Für mich bedeutet Informationsfreiheit:\n\t•\tOffenheit: Meine Kundinnen und Kunden haben ein Recht darauf, alle Fakten zu kennen – kein Kleingedrucktes, keine versteckten Haken.\n\t•\tBildung: Wer informiert ist, trifft bessere Entscheidungen. Deswegen nehme ich mir die Zeit, Hintergründe und Zusammenhänge zu erklären.\n\t•\tVertrauen: Transparente Kommunikation schafft Sicherheit – und Sicherheit ist die Basis jeder erfolgreichen Zusammenarbeit.\n\n💡 Stell Dir vor, wie viel einfacher Entscheidungen in allen Lebensbereichen wären, wenn wir immer offen und ehrlich miteinander kommunizieren würden.\n\n💬 Wie wichtig ist Dir Transparenz und Informationsfreiheit in Deinem Alltag? Ich bin gespannt auf Deine Perspektive – teile sie gern in den Kommentaren!\n\n#TagDerInformationsfreiheit #Transparenz #WissenIstMacht #Immobilien #Vertrauen #Menschlichkeit #Zusammenarbeit	2025-03-15 23:00:00	f	8	\N	6	2025-03-13 18:31:49.786	7	\N	public	\N	post	draft	\N	\N
\.


--
-- Data for Name: social_accounts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.social_accounts (id, platform, account_name, user_id, access_token, refresh_token, token_expires_at, platform_user_id, platform_page_id) FROM stdin;
6	LinkedIn	Judith Lenz	8	\N	\N	\N	\N	\N
7	LinkedIn	YOUR TIMES	8	\N	\N	\N	\N	\N
\.


--
-- Data for Name: subtasks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subtasks (id, title, completed, todo_id) FROM stdin;
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.todos (id, title, completed, user_id, description, assigned_to_user_id, deadline) FROM stdin;
10	Post zum Tag der Immobilienwirtschaft ZIA 04.06.2025	f	7	können wir schon mal in die Agenda schauen udn dann auch ein ZIA Foto verwenden was ich schießen werde als auch ein Judith foto	8	2025-05-20 22:00:00
15	diverse LinkedIn Banner aktualsieren	f	7	...und wir merken uns für neue LinkedIn Banner in Kombi mit neuen Fotos und neuem Layout (blau weiß Kupfer etc) : \n„Starke Frauen lassen sich nicht in Schubladen stecken – sie bauen eigene Räume.“\nund\n„Gegen festgefahrene Strukturen hilft am besten weibliche Intuition.“	8	2025-03-12 23:00:00
11	Post zur Expor Real  04.-.6.10.2025	f	7	2 Wochen vorher posten, dass die Messe ist udn ich vor Ort bin - vllt. Zitatelayout verwenden mit Messedaten und Logo \nund dann 1 Tag vorher auch nochmal leicht variert\nPost YT und Weiterleitung JL	8	2025-09-17 22:00:00
16	Logoideen	t	7	Ich kann mir das weinrote tatsächlich vorstellen - als Farb und als Schrift tatsächlich vorstellen	8	2025-03-06 23:00:00
7	A5 rechteckig - doppelseitig beschriftet Flyer	t	7	Hey Chris, kannst Du mal schauen, ob Du eine Kurzinfo zu Biesenthal auf 2 Seiten bringen kannst. Format wie eine Postkarte aber ggf. doppelt so groß.\nVorne ein Bild und 69 altersgerechte Wohnungen / Service-Wohnen in Biesenthal und Rückseite nettes Wohnungsbild mit ein paar Fakten.\n2 Zi Wohnungen 42,-63m² etc. . Ich schicke Dir mal den Lindenberg Flyer als insipiration aber bei weitem nicht so viel Infos und so vollständig. Da ich hier keinen Anhang mehr anfügen kann, folgen die Infos per mail...	8	2025-02-26 23:00:00
13	die anderen Feiertag-Posts für das Jahr vorbereiten	f	7	damit Dir nicht langweilig wird - bereite doch die anderen Posts schon vor - zumindest mal die paar die wir uns ausgeguckt haben plus Ostern, Sommerferien in Berlin/Brandenburg, Weihnachten, Sylvester bzw. Neujahr usw	8	2025-03-30 22:00:00
17	Aufgabe Newsletter vorbereiten und Flyer Biesenthal	f	7	also fü rmich sind Aufgaben erst fertig, wenn Sie auch wirklich erledigt sind. Newsletter ist nur am Anfang aber nochlange nicht das was in der Aufgabe steht. Und der Flyer ist auch noch nicht fertig :-)	\N	2025-03-09 23:00:00
8	Post für Vermarktungsstart Biesenthal	t	7	Hey Chris,\n\nbereitest Du bitte einen YT Post vor für Vemarktungsstart Biesenthal. Als JL hatte ich ja schon mal pre-opening betrieben aber jetzt können die Fakten raus :-) Du weisst ja Bescheid. Ich hätte gern das Drohnenfoto vom ganzen Projekt als auch die 2 Häuser von oben (H1 und 2) ...und tatsächlcih ein Foto von mir ..Aber die Shooting Bilder sind noch nicht fertig bearbeitet. Aber wenn - dann sind die mega :-) Da haben wir eine schöne Spielwiese...	8	2025-03-03 23:00:00
9	Newsletter vorbereiten	t	7	Und was ist denn mit den Newsletter Vorschlägen? Werde Dich jetzt ablenken :-) Und diese Dingen könnten wir vorbereiten. Dann kann natürlich die Anlage Biesenthal mit rein... und Fachbeiträge...o.ä.\nUnd die Frage generell ist: Bleiben wir bei Brevo? Und erreichen damit meine Kunden? Und/oder nutzen wir auch den Newsletter von LinkedIn?\nTheoretisch könnte man für das Jahr durchplanen. Da wir dieses Jahr noch gar nix hatten!! Dann ggf. alle 6 Wochen ca. und ein wenig auf Sommerferien (Berlin/Brandenburg) / Herbstferien achten \nAnsonsten Plantechnisch auch ExpoReal mit beachtne (Messe München 6.-8.10.25) (können wir vorher schicken damit wir die Messe mit ankündigen und mich auch als vor Ort anpreisen. Dazu auch einen Post.\nDann Tag der Immobilienwirtschaft ZIA 4.6.2025 (entweder vorher oder hinterher) Hinterher wäre charmant als Resümee... Agenda steht ja meistens schon vorher etc. etc......	8	2025-03-05 23:00:00
12	Zitatelayout Foto JL ändern	t	7	Sobald ich die neuen Fotos habe, ändern wir das Layout	8	2025-03-05 23:00:00
18	Problem Vermarktungsstart Biesenthal	t	7	1. Posttext - ok\nPost Bild von mir erstellt und bearbetiet\naber mit dem Post sollte natürlich auch die Webseite funktionieren!! und dies ist zwar schon erstellt aber das finetuning fehlt. D.h. der Post kann erst raus, wenn die Webseite steht - aus meiner Sicht. Oder es gibt dann noch einen weiterne Post sehr zeitnah - halte ich aber für Quatsch. Verstehste jetzt was ich mit geplantem Arbeiten meine - das muss Struktur und geordnetes GEdanekngut zu eingebraht werden. Alels baut sich aufeinander auf!! Und deswegen muss oswas auch gut geplant werden: Wann ist die Wbseite fertig? Wann ist der Post fertig? Wann wird er veröffentlicht? So stelle ich mir Planung vor - alles andere ist unprofessionell	\N	2025-03-07 23:00:00
19	Logo Biesenthal	t	7	bitte mir als jpg oder png zusenden vermutlich dann in weinroter Schrift für Google Maps und meine Projektseite in Propstack	8	2025-03-10 23:00:00
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
1f6gTD1JKQkej9dCkSWheQ6XyUgDq7GX	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-18T07:15:42.046Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-03-18 07:16:48
_ox9rtkIBiIREJie1ijIPwEe7bbcfysu	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-17T12:58:20.305Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-03-18 07:11:20
PdhXQqITuUVkC0TEDP1tDm4QRrzDAqby	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-18T07:17:20.968Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-03-18 07:19:37
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password) FROM stdin;
7	info@your-times.com	8b185f60806ba9e17ecbc23448092ebde419962341d400e49285b208a4c3e6a813284eadab93336819e3077b80a515fb9902868f25ccfcc0529d95844e1a49aa.7c82749c66952bfd9fbf439cd0a76f88
8	Chris-E	4f3bf3b5487b99062cbe35f53dcf4532312ac58e2c024e63471e8682526d3831820ee118f4778efc0d78838211363da0b66142fa481fceccd07c921304615c61.2e8d692bbd44a59472d4cb2960fe281a
\.


--
-- Name: backups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.backups_id_seq', 273, true);


--
-- Name: newsletters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.newsletters_id_seq', 4, true);


--
-- Name: post_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.post_accounts_id_seq', 2, true);


--
-- Name: post_analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.post_analytics_id_seq', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.posts_id_seq', 98, true);


--
-- Name: social_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.social_accounts_id_seq', 7, true);


--
-- Name: subtasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.subtasks_id_seq', 1, false);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.todos_id_seq', 19, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: backups backups_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.backups
    ADD CONSTRAINT backups_pkey PRIMARY KEY (id);


--
-- Name: newsletters newsletters_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.newsletters
    ADD CONSTRAINT newsletters_pkey PRIMARY KEY (id);


--
-- Name: post_accounts post_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_accounts
    ADD CONSTRAINT post_accounts_pkey PRIMARY KEY (id);


--
-- Name: post_analytics post_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_analytics
    ADD CONSTRAINT post_analytics_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: social_accounts social_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_accounts
    ADD CONSTRAINT social_accounts_pkey PRIMARY KEY (id);


--
-- Name: subtasks subtasks_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subtasks
    ADD CONSTRAINT subtasks_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: newsletters newsletters_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.newsletters
    ADD CONSTRAINT newsletters_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: post_accounts post_accounts_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_accounts
    ADD CONSTRAINT post_accounts_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.social_accounts(id) ON DELETE CASCADE;


--
-- Name: post_accounts post_accounts_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_accounts
    ADD CONSTRAINT post_accounts_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_analytics post_analytics_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_analytics
    ADD CONSTRAINT post_analytics_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: posts posts_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.social_accounts(id) ON DELETE RESTRICT;


--
-- Name: posts posts_last_edited_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_last_edited_by_user_id_fkey FOREIGN KEY (last_edited_by_user_id) REFERENCES public.users(id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: posts posts_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: social_accounts social_accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_accounts
    ADD CONSTRAINT social_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subtasks subtasks_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subtasks
    ADD CONSTRAINT subtasks_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.todos(id) ON DELETE CASCADE;


--
-- Name: todos todos_assigned_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_assigned_to_user_id_fkey FOREIGN KEY (assigned_to_user_id) REFERENCES public.users(id);


--
-- Name: todos todos_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

