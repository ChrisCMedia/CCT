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
28	2025-03-07 13:54:15.909996	backup-2025-03-07T13-54-14-821Z.sql	0	completed	2025-03-07 13:54:19.953	\N
29	2025-03-07 14:00:42.580566	backup-2025-03-07T14-00-41-911Z.sql	0	completed	2025-03-07 14:00:46.16	\N
30	2025-03-07 14:02:24.975623	backup-2025-03-07T14-02-24-541Z.sql	0	completed	2025-03-07 14:02:28.583	\N
31	2025-03-07 14:05:10.186059	backup-2025-03-07T14-05-06-987Z.sql	0	completed	2025-03-07 14:05:14.547	\N
32	2025-03-07 14:08:19.462433	backup-2025-03-07T14-08-16-560Z.sql	0	completed	2025-03-07 14:08:25.298	\N
33	2025-03-07 14:10:43.675202	backup-2025-03-07T14-10-40-563Z.sql	0	pending	\N	\N
\.


--
-- Data for Name: newsletters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.newsletters (id, content, title, user_id) FROM stdin;
2	Vermarktungsstart Biesenthal und Projektvorstellung	MÄRZ NEWS INHALT 1	8
3	siehe geplante Posts 10.03.	MÄRZ NEWS: Fachbeitrag 1 (Sozialimmobilien)	8
4	siehe geplante Posts 24.03.	MÄRZ NEWS: Fachbeitrag 1 (Markttrends)	8
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
34	ARTIKEL REPOST: Scheidungsimmobilie Scheidungsimmobilie: Zwangsversteigerung ist der teuerste Fehler ⚖️ Trennung und Immobilienbesitz – eine oft komplexe Kombination mit erheblichen finanziellen Risiken. Wer sich nicht einigt, riskiert eine Zwangsversteigerung – und damit in der Regel einen Verlust von bis zu 30 % des Marktwerts. Warum eine Zwangsversteigerung unbedingt vermieden werden sollte: 🔹 Preisverfall – Immobilien werden unter Marktwert verkauft, da Käufer auf Schnäppchenjagd sind. 🔹 Verlust der Kontrolle – Das Gericht bestimmt den Wert, den Zeitpunkt und die Bedingungen des Verkaufs. 🔹Langwieriger Prozess – Streitigkeiten eskalieren oft weiter und belasten alle Beteiligten finanziell und emotional. 🚀 Bessere Alternativen: ✔ Einvernehmlicher Verkauf – Ein strategisch geführter Marktverkauf erzielt den besten Preis. ✔ Auszahlung eines Partners – Erfordert eine saubere Finanzierungsstruktur, um tragfähig zu bleiben. ✔ Zwischenlösung Vermietung – Kann in bestimmten Marktphasen sinnvoll sein, erfordert aber wirtschaftliche Zusammenarbeit. Fazit: Wer frühzeitig professionelle Beratung einholt, sichert den wirtschaftlich besten Weg. Ein erfahrener Makler kann als neutraler Vermittler agieren und eine marktgerechte Lösung mit maximaler Wertschöpfung finden. 💬 Wie sehen Sie die aktuelle Entwicklung bei Scheidungsimmobilien? Lassen Sie uns in den Austausch gehen. Judith Lenz Hashtag#Immobilienstrategie Hashtag#Zwangsversteigerung Hashtag#Vermögenssicherung Hashtag#YOURTIMES 	2025-03-04 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 13:23:08.078
37	ARTIKEL REPOST:\r\nScheidungsimmobilie: Zwangsversteigerung ist der teuerste Fehler ⚖️ \r\n\r\nTrennung und Immobilienbesitz – eine oft komplexe Kombination mit erheblichen finanziellen Risiken. \r\n\r\nWer sich nicht einigt, riskiert eine Zwangsversteigerung – und damit in der Regel einen Verlust von bis zu 30 % des Marktwerts. \r\n\r\nWarum eine Zwangsversteigerung unbedingt vermieden werden sollte: \r\n🔹 Preisverfall – Immobilien werden unter Marktwert verkauft, da Käufer auf Schnäppchenjagd sind. \r\n🔹 Verlust der Kontrolle – Das Gericht bestimmt den Wert, den Zeitpunkt und die Bedingungen des Verkaufs. \r\n🔹Langwieriger Prozess – Streitigkeiten eskalieren oft weiter und belasten alle Beteiligten finanziell und emotional. \r\n\r\nBessere Alternativen: \r\n✔ Einvernehmlicher Verkauf – Ein strategisch geführter Marktverkauf erzielt den besten Preis. \r\n✔ Auszahlung eines Partners – Erfordert eine saubere Finanzierungsstruktur, um tragfähig zu bleiben. \r\n✔ Zwischenlösung Vermietung – Kann in bestimmten Marktphasen sinnvoll sein, erfordert aber wirtschaftliche Zusammenarbeit. \r\n\r\nFazit: Wer frühzeitig professionelle Beratung einholt, sichert den wirtschaftlich besten Weg. Ein erfahrener Makler kann als neutraler Vermittler agieren und eine marktgerechte Lösung mit maximaler Wertschöpfung finden. \r\n\r\n💬 Lesen Sie mehr dazu in der aktuellen Kolumne von Judith Lenz\r\n\r\n#mmobilienstrategie#Zwangsversteigerung#Vermögenssicherung#YOURTIMES #REALESTATE	2025-03-04 23:00:00	t	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-03-05 11:09:11.19
39	JL: 21. Februar oder 21. März?\n\n\n🗣️ Die Muttersprache – ein Schlüssel zur Seele Am 21. Februar feiern wir den Internationalen Tag der Muttersprache – einen Tag, der uns daran erinnert, wie kostbar und prägend unsere Sprache ist. Sie ist weit mehr als ein Kommunikationsmittel: \nUnsere Muttersprache bringt uns mit unserer Kultur, unseren Erinnerungen und unserer Identität in Verbindung. Für mich ist die Muttersprache ein Stück Heimat, ein Anker in einer sich ständig verändernden Welt. Sie trägt die Geschichten unserer Kindheit und formt, wie wir denken und fühlen. Gleichzeitig lädt sie uns ein, andere Sprachen und Kulturen zu entdecken – und so unseren Horizont zu erweitern. \nGerade die deutsche Sprache mit ihren Worten ist sehr präzise und drückt so viel mehr aus, als uns im Alltag bewusst ist.\n\nGern dazu eines meiner Lieblingsbeispiele: Das Wort "Nachrichten" - da es täglich von den meisten Menschen als auch von den Medien verwendet wird. Das Wort stammt aus dem 17. Jahrhundert für älter Nachrichtung = das wonach man sich zu richten hat - also eine Anweisung!\n😉 Damit lasse ich das gern mit einem Augenzwinkern so stehen und Raum für die eigenen Gedanken 😉\n\nWas bedeutet eure Muttersprache für euch? Gibt es ein Wort, ein Sprichwort oder eine Erinnerung, die ihr mit ihr verbindet? Ich freue mich, wenn ihr eure Gedanken dazu mit mir teilt. \n\n#TagDerMuttersprache #SpracheVerbindet #KulturelleWurzeln #Wertschätzung #YOURTIMES #REALESTATE #Berlin	2025-02-20 23:00:00	t	8	\N	6	2025-02-20 16:07:37.013	7	\N	public	\N	post	deleted	\N	2025-02-27 11:15:10.614
36	REPOST ARTIKEL:\r\n🏡 Immobilienfinanzierung 2025: Strengere Vergabekriterien – aber keine Sackgasse 💡\r\n\r\nDie Kreditlandschaft hat sich spürbar verändert: Höhere Eigenkapitalanforderungen, strengere Bonitätsprüfungen und selektivere Banken machen Finanzierungen herausfordernder – selbst für finanzstarke Käufer.\r\n\r\nDoch wer strategisch vorgeht, sich exzellent vorbereitet und die richtigen Partner an seiner Seite hat, kann weiterhin attraktive Finanzierungsmodelle realisieren. Worauf es ankommt:\r\n\r\n✔ Differenzierte Bankenstrategien nutzen – Kreditinstitute bewerten Risikoprofile unterschiedlich. Ein gezielter Vergleich kann erhebliche Konditionsvorteile bringen.\r\n\r\n✔ Finanzielle Hebel identifizieren – Der kluge Verkauf von Bestandsimmobilien oder Eigenkapital-Optimierung durch clevere Strukturierung sind entscheidend.\r\n\r\n✔ Immobilienwert vs. Finanzierungsspielraum – Die regional divergierende Marktentwicklung eröffnet Potenziale, die strategisch genutzt werden können.\r\n\r\nMarktkenntnis und Expertise sind essenziell – Finanzierungsentscheidungen erfordern präzise Marktanalysen, bankenübergreifende Verhandlungen und ein starkes Netzwerk.\r\n\r\n💬 Wie bewerten Sie die aktuellen Entwicklungen? Lesen Sie dazu mehr in der aktuellen Kolumne von Judith Lenz\r\n\r\nHashtag#Immobilienstrategie Hashtag#Finanzierungsoptimierung Hashtag#Marktdynamik Hashtag#YOURTIMES #REALESTATE	2025-02-24 23:00:00	t	8	\N	7	\N	\N	\N	public	\N	post	deleted	\N	2025-02-27 11:15:13.959
46	VORLAGE 2	2025-02-20 23:00:00	f	8	/uploads/183bf5cfb635513fe6b8733512d0c3af	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 16:27:57.556
45	VORLAGE 1	2025-02-20 23:00:00	f	8	/uploads/b1c3ae6250efe5c6c0ed37e18cd6ce2c	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 16:28:00.617
43	🌸 8. März – Weltfrauentag: Ein Tag für mehr als nur Worte 🌸\n\nHeute ist Weltfrauentag – ein Tag, der uns daran erinnert, wie wichtig es ist, Frauen in ihrer Vielfalt zu würdigen, zu stärken und ihnen die gleichen Chancen zu bieten. 💪✨\n\nIn der Immobilienbranche – wie in so vielen anderen Bereichen – sehe ich jeden Tag starke Frauen, die mit Leidenschaft, Mut und Kompetenz Großartiges leisten. Ob Kolleginnen, Kundinnen oder Partnerinnen: Jede einzelne bringt ihre eigene Stärke mit, und genau das macht uns gemeinsam so erfolgreich.\n\nDoch der Weltfrauentag ist auch ein Tag, der uns zeigt, dass wir noch viel zu tun haben. Gleichberechtigung, faire Chancen und gegenseitiger Respekt – das sind nicht nur Worte, sondern Werte, die wir täglich leben sollten.\n\n✨ An alle Frauen da draußen: Seid stolz auf Euch, glaubt an Eure Stärke und traut Euch, groß zu träumen. Wir sind hier, um uns gegenseitig zu unterstützen und gemeinsam zu wachsen.\n\n💬 Was bedeutet der Weltfrauentag für Dich? Hast Du eine Frau in Deinem Leben, der Du heute Danke sagen möchtest? Schreib es gern in die Kommentare – ich freue mich auf Deine Geschichte!\n\n#Weltfrauentag #Gleichberechtigung #Frauenpower #Zusammenhalt #Immobilien #Menschlichkeit #YOURTIMES #REALESTATE #JudithLenz	2025-03-07 23:00:00	t	8	\N	6	2025-03-07 10:00:37.511	8	\N	public	\N	post	draft	\N	\N
44	ZITAT VORLAGEN (swisslife, finde ich nicht so super...)	2025-02-20 23:00:00	f	8	/uploads/9680afbe5bcb367db2506ba1b556804c	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 17:28:58.093
47	VORLAGE 3, FAVORIT	2025-02-20 23:00:00	f	8	/uploads/c063926cf8c917794a59857e7d62ba4a	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 17:29:01.753
42	Spontaner Kommentar @JL zur Immobilienfinanzierung 	2025-02-24 23:00:00	t	8	\N	6	2025-02-20 13:31:39.991	8	\N	public	\N	post	deleted	\N	2025-02-27 11:15:16.527
41	🌟 Tag des Kompliments – Ein kleiner Moment, der Großes bewirken kann 🌟 \n\nHeute ist der 1. März, der internationale Tag des Kompliments – und ich finde, das ist der perfekte Anlass, um innezuhalten und ein paar liebe Worte zu verteilen. 🗣️❤️ \n\nEgal, ob im Job oder privat – wir alle wissen, wie gut es tut, ein ehrliches Kompliment zu bekommen. Ein „Du machst das großartig!“ oder „Danke, dass Du da bist!“ kann manchmal den Unterschied machen und jemandem den Tag retten. In der Immobilienbranche geht es nicht nur um Zahlen und Verträge – es sind Menschen, die sich tagtäglich einsetzen. 🤝 \nVertrauen aufzubauen, Beziehungen zu stärken und das Gefühl zu vermitteln: „Du bist wichtig, und Deine Arbeit zählt!“ Das ist es, was uns antreibt, was uns verbindet und was am Ende jeden Erfolg ausmacht. ✨ Deshalb möchte ich heute ein großes Dankeschön an mein Team, meine Partnerinnen und Partner sowie meine Kundinnen und Kunden richten: Ihr seid einfach wunderbar, und ohne Euch wäre nichts von all dem möglich. Eure Leidenschaft, Euer Einsatz und Eure Menschlichkeit sind unbezahlbar! 🙏 \n\nLasst uns den Tag nutzen, um ein bisschen Licht in den Alltag anderer zu bringen – mit einem ehrlichen Kompliment, einem warmen Lächeln oder einfach ein paar netten Worten. \n\n💬 Was war das schönste Kompliment, das Du je bekommen hast? Schreib es gern in die Kommentare – ich freue mich drauf!\n\n#Vertrauen #Komplimente #YOURTIMES #REALESTATE	2025-02-28 23:00:00	t	8	\N	6	2025-02-20 15:39:16.267	7	\N	public	\N	post	deleted	\N	2025-03-03 09:18:25.529
38	REPOST YT zum Artikel:\n\nEin wichtiger Beitrag zu einem oft unterschätzten Thema! 🙌 Eine Scheidung ist emotional herausfordernd genug – da sollte die Immobilie(n) nicht noch zur zusätzlichen Belastung werden. Die größten Fehler entstehen oft durch fehlende Einigkeit oder mangelnde Beratung. Eine sachliche Kommunikation ist in den meisten Fällen dann auch leider nicht mehr möglich.\n\nMeine Erfahrung zeigt: Wer frühzeitig Klarheit schafft und sich professionell begleiten lässt, kann finanziellen Schaden vermeiden und die bestmögliche Lösung für alle Beteiligten finden. 💡	2025-03-04 23:00:00	t	8	\N	6	2025-02-20 15:09:20.393	7	\N	public	\N	post	deleted	\N	2025-03-05 11:09:14.372
40	JL -> da muss ich noch dran pfeilen - der fühlt sich nicht rund an. ggf. terminieren wir den später: \n\nVertrauen schafft Werte – Meine Vision für exklusive Immobiliengeschäfte Als Immobilienmaklerin in Berlin ist es mir ein Herzensanliegen, nicht nur erstklassige Objekte zu vermitteln, sondern echte Lebensräume und langfristige Beziehungen aufzubauen. Gerade in Zeiten, in denen Transparenz und Diskretion immer wichtiger werden, setze ich auf exklusive Off-Market-Transaktionen – basierend auf Vertrauen, Integrität und persönlicher Nähe. Es erfüllt mich mit Stolz, mit Partnern zusammenzuarbeiten, die dieselben Werte teilen und so gemeinsam nachhaltige Investmentchancen realisieren. \n\nFür mich bedeutet echtes Vertrauen mehr als nur ein gutes Geschäft: Es öffnet Türen zu außergewöhnlichen Projekten und schafft eine Basis, auf der langfristiger Erfolg wächst. 🤝 \n\nIch freue mich auf den Austausch mit Ihnen: Wie erleben Sie Vertrauen in Ihrem Geschäftsalltag? \n\n#OffMarketInvestments #Vertrauen #ExklusiveProjekte #Immobilien #JudithLenz #Immobilieninvestment #Berlin #YOURTIMES	2025-03-10 23:00:00	f	8	\N	6	2025-02-20 15:46:18.622	7	\N	public	\N	post	draft	\N	\N
52	ARTIKEL \r\n\r\nKW13 März 2025\r\n\r\nEine Kolumne von Judith Lenz\r\n\r\n\r\nMarkttrends 2025: Chancen für Anleger\r\n\r\nDer Immobilienmarkt 2025 bietet institutionellen Anlegern und Projektentwicklern ein stabiles Fundament für strategische Investments. Preisstabilisierung, regionale Hotspots und nachhaltige Bauweise prägen die Trends – wer diese Dynamiken versteht, kann die Nettoanfangsrendite (NAR) gezielt steigern. Dieser Beitrag beleuchtet die aktuellen Entwicklungen und zeigt, wie Investoren Kapital effizient einsetzen können.\r\n\r\nEin stabiler Markt mit moderatem Wachstum\r\nNach Jahren volatiler Preisentwicklungen zeigt der Markt 2025 eine wohltuende Konsolidierung. Der Verband deutscher Pfandbriefbanken (vdp) meldet für Q1 einen Anstieg der Eigentumswohnungspreise um 1,5 %, während Gewerbeimmobilien in zweitklassigen Lagen eine Wertsteigerung von bis zu 3 % verzeichnen. Diese Stabilität reduziert spekulative Unsicherheiten und begünstigt langfristige Anlagestrategien, insbesondere in mittelgroßen Städten wie Leipzig oder Dresden, wo Wohnanlagen NARs von 4-5 % erzielen.\r\n\r\nNachhaltigkeit als Investitionskatalysator\r\nEnergieeffizienz ist kein Trend mehr, sondern ein Muss. Objekte mit KfW-40-Standard oder höher (z. B. Effizienzklasse A+) erzielen Verkaufswerte, die den Marktdurchschnitt um 8-12 % übertreffen. Neue Förderprogramme ab 2025 – etwa Zuschüsse von bis zu 15 % für erneuerbare Energien – senken die Kapitalkosten und steigern die interne Rendite (IRR). Ohne energetische Modernisierung drohen Bestandsimmobilien dagegen ein Abschlag von bis zu 20 %, ein Risiko, das bei der Due-Diligence-Prüfung Priorität haben sollte.\r\n\r\nRegionale Märkte im Aufwind\r\nMetropolen wie Berlin oder München bleiben teuer, doch der Fokus verschiebt sich auf Randlagen und aufstrebende Regionen. Grundstücke ohne Baurecht in Speckgürteln großer Städte bieten spekulative Potenziale von 15-20 %, wenn Baugenehmigungen gesichert werden. Gewerbeimmobilien, insbesondere Hotelprojekte, profitieren vom anhaltenden Tourismusboom – hier sind NARs von 5 % bei Pachtverträgen über 15 Jahre realistisch. Investoren sollten Marktberichte genau analysieren, um diese Chancen zu priorisieren.\r\n\r\nFinanzierung: Flexibilität als Vorteil\r\nDie richtige Kapitalstruktur entscheidet über den Erfolg. Forward-Darlehen sichern Zinssätze von aktuell unter 3 % für künftige Projekte, während Eigenkapitalquoten von 30-40 % die Bankenfinanzierung erleichtern. Steuerliche Vorteile wie § 7b EStG (Sonderabschreibungen) und regionale Förderungen für Gewerbeimmobilien optimieren die Liquidität. Ein Asset-Flip – Kauf, Modernisierung, Verkauf – kann innerhalb von 18 Monaten den ROI um 12-18 % steigern, erfordert jedoch eine präzise Exit-Strategie.\r\n\r\nMarkteintritt: Timing und Expertise\r\nDer Erfolg hängt vom Timing ab. Frühzeitige Marktanalysen und die Zusammenarbeit mit Experten sind unerlässlich, um Hotspots wie Dresden oder spekulative Grundstücke zu identifizieren. Ein erfahrener Immobilienberater unterstützt bei der Wertermittlung, Verhandlung mit Behörden und der Entwicklung eines Vermarktungskonzepts, das den Verkaufswert um bis zu 20 % steigert. Ohne diese Expertise drohen Verzögerungen oder Fehlentscheidungen, die die Rendite schmälern.\r\n\r\nFazit\r\n2025 ist ein Jahr der Chancen für institutionelle Anleger. Stabile Preise, nachhaltige Investments und regionale Dynamiken bieten Potenzial für renditestarke Portfolios. Wer jetzt mit fundierter Analyse und professioneller Unterstützung handelt, positioniert sich für langfristigen Erfolg.\r\n\r\nHinweise\r\nIn diesem Text wird aus Gründen der besseren Lesbarkeit das generische Maskulinum verwendet. Weibliche und anderweitige Geschlechteridentitäten werden dabei ausdrücklich mitgemeint, soweit es für die Aussage erforderlich ist. Dieser Beitrag stellt keine Steuer- oder Rechtsberatung im Einzelfall dar. Bitte lassen Sie die Sachverhalte in Ihrem konkreten Einzelfall von einem Rechtsanwalt und/oder Steuerberater klären.	2025-03-23 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
53	LinkedIn-Beitrag zum Veröffentlichen des Artikels:\r\n\r\nMarkttrends 2025: Chancen für Anleger\r\n\r\n·         Preisstabilisierung: +1,5% bei Eigentumswohnungen (vdp Q1 2025)\r\n\r\n·         Hotspots: Leipzig, Dresden mit 4-5% NAR.\r\n\r\n·         Nachhaltigkeit: KfW-40 steigert Werte um 8-12%\r\n\r\n·         Gewerbe: Hotelrenditen bis 5%, 15 Jahre Pacht.\r\n\r\n·         Finanzierung: Forward-Darlehen unter 3%, ROI +12-18% bei Asset-Flips\r\n\r\n·         Expertise: Marktanalyse steigert Werte um bis zu 20%\r\n\r\nFazit: Jetzt strategisch investieren.\r\n\r\nMehr in der Kolumne von Judith Lenz: (Link)	2025-03-23 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
54	JL Repost/Kommentar\r\n\r\nHier darfst du gerne aktiv werden 😊	2025-03-23 23:00:00	f	8	\N	6	\N	\N	\N	public	\N	post	draft	\N	\N
49	ARTIKEL:\r\n\r\nKW11 März 2025\r\n\r\nEine Kolumne von Judith Lenz\r\n\r\nSozialimmobilien / Health-Care-Immobilien (du kannst entscheiden welches Wording 😊): Strategische Investments in Pflegeheime vermeiden Marktrisiken\r\nSozialimmobilien, insbesondere Pflegeheime, sind für institutionelle Anleger und Projektentwickler eine resiliente Anlageklasse, die 2025 konjunkturelle Volatilität umgeht. Die Kombination aus stabilen Cashflows, steigender Nachfrage und staatlicher Förderung macht sie zu einer strategischen Wahl – doch nur mit der richtigen Planung wird das volle Renditepotenzial ausgeschöpft.\r\n\r\nMarktstabilität durch demografische Trends\r\nDie demografische Alterung in Deutschland treibt die Nachfrage nach Pflegeplätzen unaufhaltsam an. Laut Bulwiengesa (WIRKLICH EINE TOP TOP QUELLE FÜR GENAU DIESE ART VON BEITRÄGEN, ODER?!) wird der Bedarf bis 2030 um 20 % steigen, was die Leerstandsrisiken minimiert. Langfristige Pachtverträge mit Betreibern – oft über 20-25 Jahre – sichern Nettoanfangsrenditen (NAR) zwischen 4-6 %, unabhängig von Marktschwankungen. Für Investoren bedeutet das: planbare Erträge bei geringer Abhängigkeit von Zinsentwicklungen oder konjunkturellen Zyklen.\r\n\r\nFinanzielle Hebel und Förderungen\r\nDie Finanzierungsstruktur eines Pflegeheim-Investments kann durch staatliche Programme optimiert werden. Neue KfW-Zuschüsse ab 2025 decken bis zu 15 % der Baukosten, während Sonderabschreibungen nach § 7b EStG die steuerliche Belastung senken. Eine energetische Sanierung auf Effizienzklasse A erhöht den Verkehrswert um bis zu 10 %, was die interne Rendite (IRR) signifikant steigert. Projektentwickler sollten diese Hebel in der Due-Diligence-Prüfung berücksichtigen, um die Kapitalstruktur zu maximieren.\r\n\r\nRisiken und deren Management\r\nOhne sorgfältige Standortanalyse drohen suboptimale Erträge. Urbane Randlagen mit guter Anbindung sind entscheidend, da sie Betreiberattraktivität und Wertstabilität sichern. Ein weiteres Risiko ist die Betreiberinsolvenz – hier empfiehlt sich eine Bonitätsprüfung und die Zusammenarbeit mit etablierten Pflegekonzernen. Alternativ kann eine schlechte Marktphase durch eine temporäre Vermietung überbrückt werden, vorausgesetzt, die bauliche Substanz entspricht den Anforderungen des Pflegemarktes.\r\n\r\nAlternative Strategien: Asset-Flip oder langfristiger Halt\r\nNeben dem klassischen Buy-and-Hold-Ansatz bietet sich für liquide Investoren ein Asset-Flip an: Kauf eines Bestandsobjekts, Modernisierung (z. B. energetische Sanierung) und Verkauf mit einem Aufschlag von 15-20 %. Dies erfordert jedoch eine präzise Marktkenntnis und Liquiditätsreserven. Langfristiger Halt hingegen maximiert die Wertschöpfung durch kontinuierliche Mieteinnahmen und steigende Immobilienwerte, insbesondere bei steueroptimierten Finanzierungsmodellen wie Forward-Darlehen.\r\n\r\nDie Rolle des Immobilienspezialisten\r\nEin erfahrener Makler ist hier unerlässlich. Von der Standortanalyse über die Verhandlung mit Betreibern bis zur Vermarktung – professionelle Begleitung sichert die Rendite und minimiert Risiken. Eine fundierte Wertermittlung, gepaart mit einem strategischen Verkaufsprozess, kann den Exit-Wert um bis zu 25 % über dem Marktdurchschnitt platzieren.\r\n\r\nFazit\r\nPflegeheime sind 2025 eine strategische Anlageoption, die Marktrisiken umgeht und stabile Erträge liefert. Eine Kombination aus demografischer Nachfrage, finanziellen Hebeln und professioneller Vermarktung macht sie zur idealen Wahl für institutionelle Portfolios. Frühzeitige Planung und Expertise sind der Schlüssel zum Erfolg.\r\n\r\n\r\nHinweise\r\nIn diesem Text wird aus Gründen der besseren Lesbarkeit das generische Maskulinum verwendet. Weibliche und anderweitige Geschlechteridentitäten werden dabei ausdrücklich mitgemeint, soweit es für die Aussage erforderlich ist. Dieser Beitrag stellt keine Steuer- oder Rechtsberatung im Einzelfall dar. Bitte lassen Sie die Sachverhalte in Ihrem konkreten Einzelfall von einem Rechtsanwalt und/oder Steuerberater klären.	2025-03-11 23:00:00	f	8	\N	7	2025-03-06 13:05:41.983	7	\N	public	\N	post	draft	\N	\N
50	Artikel REPOST:\r\n\r\nSozialimmobilien: Pflegeheime als strategische Anlage 2025\r\n\r\n·         Stabile NAR von 4-6 % durch 20-25-jährige Pachtverträge.\r\n\r\n·         Nachfrage steigt bis 2030 um 20 % (Bulwiengesa).\r\n\r\n·         KfW-Förderungen (15 %) und § 7b EStG optimieren IRR.\r\n\r\n·         Risiken: Standort und Betreiberbonität entscheidend.\r\n\r\n·         Alternativen: Asset-Flip oder langfristiger Halt.\r\n\r\n·         Maklerrolle: Wertsteigerung um bis zu 25 %.\r\n\r\nFazit: Frühzeitige Planung sichert Rendite.\r\n\r\nMehr in der Kolumne von Judith Lenz: (Link)\r\n	2025-03-11 23:00:00	f	8	\N	7	2025-03-06 13:05:49.599	7	\N	public	\N	post	draft	\N	\N
51	Ein Thema, das niemals an Präsenz verlieren wird!\n🙌 Bei unserem neuen Projekt #Service-Wohnen Biesenthal ist genau zu erkennen, warum HealthCare Immobilien und der damit verbundene dringend benötigte Wohnraum für Senioren so gefragt ist: 69 altersgerechte, barrierefreie Wohneinheiten mit Pflege+ und Betreuungsservices. \nZiel des Pflegedienstes ist es, dass ältere Menschen trotz oder wegen des Pflegebedarfs in ihrer Wohnung und in ihrem vertrauten Umfeld wohnen und leben können. Dabei sollten Sie nicht isoliert, sondern Teil des Sozialraums, Teil der Quartiersgemeinschaft bilden.\n\nIn den betreuten Wohngemeinschaften übernimmt der Pflegedienst die fachkundige Pflege und Versorgung der Bewohner. Das schließt die Grund- und Behandlungspflege, hauswirtschaftliche Versorgung, soziale Betreuung und Bereitstellung von Pflegemitteln sowie die Medikamentenversorgung mit ein.\nDas Begegnungszentrum für Mieter und Besucher fördert die Kommunikation und das menschliche Miteinander.\n#Gemeinschaftlich #miteinander - dieses Projekt als auch unsere vorigen HealthCare Objekte sind mein persönlicher Beitrag und mit absoluter Überzeugung aus der Tiefe meines Herzens etwas für diese Altersgruppe proaktiv tun zu dürfen und sie nicht an den Rand der Gesellschaft zu stellen! \nDenn wenn es gut läuft, dürfen wir alle alt werden und benötigen eines Tages Hilfe....\n	2025-03-09 23:00:00	t	8	\N	6	2025-03-06 13:00:53.097	7	\N	public	\N	post	draft	\N	\N
48	Vermarktungsstart: Service-Wohnen Biesenthal – Zukunftssicheres #Investment im Wachstumsmarkt der #HEALTHCARE Immobilien\n\n@YOUR TIMES REAL ESTATE startet die Vermarktung eines modernen Seniorenwohnanlage mit Pflegeservices in Biesenthal, Brandenburg. Mit 69 barrierefreien Wohneinheiten sowie ergänzenden Pflege- und Betreuungsangeboten setzt das Projekt neue Maßstäbe im Bereich altersgerechtem Wohnen.\nBetreutes Wohnen mit Komfort für eine neue Lebensphase! Hier ist Gemeinschaft Teil des Konzeptes\n\n🏗 Projektumfang: Vier moderne Stadtvillen, zweigeschossig mit 69 Service-Wohnungen\n- insgesamt ca. 4.617m² Wohn- und Nutzfläche\n- davon ca. 3.428m² reine Wohnfläche\n- ca. 1.188m² Nutzflächen für den Betreiber\n- 2 betreute 10er-Wohngemeinschaften\n- einer Tagespflege zur Aufnahme & tagesweiser Betreuung von älteren Menschen mit separatem Zugang\n- einer Sozialstation mit Begenungsstätte für geselliges Beisammensein.\n\n🏠 Ausstattung: alle Wohnungen sind barrierefrei, hochwertige Küchen mit modernen Einbauten, Fußbodenheizung, großzügige Bäder mit barrierefreien Duschen, Abstellraum, Balkon oder Terrasse in jeder Einheit, hochwertige Video- und Türöffnungsanlage, Glasfaseranschluss, vollelektrische Hauseingangstüren für barrierefeiem Zugang, Fahrstühle in den Häusern\n\n⚡ Nachhaltige Bauweise: KfW-40 EE Standard (Erneuerbare Energien),  Energieeffizienzklasse A+, Wärmepumpen mit Erdwärme, energieeffiziente Gebäudekonzeption. \n\n📌 Standort: idyllisches Biesenthal – im Speckgürtel Berlins, eingebettet in den Naturpark des Landkreises Barnim, Bundesland Brandenburg. Hohe Lebensqualität bei gleichzeitig guter Anbindung an die Metropole.\n\n📊 Marktpotenzial: Der Bedarf an seniorengerechtem Wohnen wächst rasant – getrieben durch den demografischen Wandel und ein begrenztes Angebot an modernen, betreuten Wohnformen. Betreiber und Investoren setzen zunehmend auf skalierbare, energieeffiziente Wohnkonzepte mit integriertem Pflegeservice.\n\nBiesenthal steht exemplarisch für die Entwicklung in nachgefragten Randlagen von Metropolen: steigender Zuzug, wachsender Bedarf an altersgerechtem Wohnraum und ein Marktumfeld, das langfristig stabile Renditen verspricht.\n\n#YOURTIMES #Healthcare # Immobilien #Seniorenwohnen #BetreutesWohnen #Zukunftsmarkt #Pflegeimmobilien #Berlin # Brandenburg #Biesenthal	2025-03-09 23:00:00	t	8	\N	7	2025-03-06 13:07:49.169	7	\N	public	\N	post	draft	\N	\N
55	🌸 8. März – Weltfrauentag: Ein Tag für mehr als nur Worte 🌸\r\n\r\nHeute ist Weltfrauentag – ein Tag, der uns daran erinnert, wie wichtig es ist, Frauen in ihrer Vielfalt zu würdigen, zu stärken und ihnen die gleichen Chancen zu bieten. 💪✨\r\n\r\nIn der Immobilienbranche – wie in so vielen anderen Bereichen – sehe ich jeden Tag starke Frauen, die mit Leidenschaft, Mut und Kompetenz Großartiges leisten. Ob Kolleginnen, Kundinnen oder Partnerinnen: Jede einzelne bringt ihre eigene Stärke mit, und genau das macht uns gemeinsam so erfolgreich.\r\n\r\nDoch der Weltfrauentag ist auch ein Tag, der uns zeigt, dass wir noch viel zu tun haben. Gleichberechtigung, faire Chancen und gegenseitiger Respekt – das sind nicht nur Worte, sondern Werte, die wir täglich leben sollten.\r\n\r\n✨ An alle Frauen da draußen: Seid stolz auf Euch, glaubt an Eure Stärke und traut Euch, groß zu träumen. Wir sind hier, um uns gegenseitig zu unterstützen und gemeinsam zu wachsen.\r\n\r\n💬 Was bedeutet der Weltfrauentag für Dich? Hast Du eine Frau in Deinem Leben, der Du heute Danke sagen möchtest? Schreib es gern in die Kommentare – ich freue mich auf Deine Geschichte!\r\n\r\n#Weltfrauentag #Gleichberechtigung #Frauenpower #Zusammenhalt #Immobilien #Menschlichkeit #YOURTIMES #REALESTATE #JudithLenz\r\n\r\n „Wo andere Mauern sehen, bauen Frauen Türen.“\r\n „Hartnäckigkeit schlägt Härte – besonders, wenn sie weiblich ist.“\r\n„Starke Frauen lassen sich nicht in Schubladen stecken – sie bauen eigene Räume.“\r\n„Eleganz ist, wenn Stärke auf Fingerspitzengefühl trifft.“\r\n„Gegen festgefahrene Strukturen hilft am besten weibliche Intuition.“	2025-03-07 23:00:00	f	8	/uploads/1fc4f8c14fcaecd0560d5a446bdadcbc	6	\N	\N	\N	public	\N	post	draft	\N	\N
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
11	Post zur Expor Real  04.-.6.10.2025	f	7	2 Wochen vorher posten, dass die Messe ist udn ich vor Ort bin - vllt. Zitatelayout verwenden mit Messedaten und Logo \nund dann 1 Tag vorher auch nochmal leicht variert\nPost YT und Weiterleitung JL	8	2025-09-17 22:00:00
7	A5 rechteckig - doppelseitig beschriftet Flyer	t	7	Hey Chris, kannst Du mal schauen, ob Du eine Kurzinfo zu Biesenthal auf 2 Seiten bringen kannst. Format wie eine Postkarte aber ggf. doppelt so groß.\nVorne ein Bild und 69 altersgerechte Wohnungen / Service-Wohnen in Biesenthal und Rückseite nettes Wohnungsbild mit ein paar Fakten.\n2 Zi Wohnungen 42,-63m² etc. . Ich schicke Dir mal den Lindenberg Flyer als insipiration aber bei weitem nicht so viel Infos und so vollständig. Da ich hier keinen Anhang mehr anfügen kann, folgen die Infos per mail...	\N	2025-02-26 23:00:00
12	Zitatelayout Foto JL ändern	f	7	Sobald ich die neuen Fotos habe, ändern wir das Layout	8	2025-03-05 23:00:00
13	die anderen Feiertag-Posts für das Jahr vorbereiten	f	7	damit Dir nicht langweilig wird - bereite doch die anderen Posts schon vor - zumindest mal die paar die wir uns ausgeguckt haben plus Ostern, Sommerferien in Berlin/Brandenburg, Weihnachten, Sylvester bzw. Neujahr usw	8	2025-03-30 22:00:00
8	Post für Vermarktungsstart Biesenthal	t	7	Hey Chris,\n\nbereitest Du bitte einen YT Post vor für Vemarktungsstart Biesenthal. Als JL hatte ich ja schon mal pre-opening betrieben aber jetzt können die Fakten raus :-) Du weisst ja Bescheid. Ich hätte gern das Drohnenfoto vom ganzen Projekt als auch die 2 Häuser von oben (H1 und 2) ...und tatsächlcih ein Foto von mir ..Aber die Shooting Bilder sind noch nicht fertig bearbeitet. Aber wenn - dann sind die mega :-) Da haben wir eine schöne Spielwiese...	8	2025-03-03 23:00:00
9	Newsletter vorbereiten	t	7	Und was ist denn mit den Newsletter Vorschlägen? Werde Dich jetzt ablenken :-) Und diese Dingen könnten wir vorbereiten. Dann kann natürlich die Anlage Biesenthal mit rein... und Fachbeiträge...o.ä.\nUnd die Frage generell ist: Bleiben wir bei Brevo? Und erreichen damit meine Kunden? Und/oder nutzen wir auch den Newsletter von LinkedIn?\nTheoretisch könnte man für das Jahr durchplanen. Da wir dieses Jahr noch gar nix hatten!! Dann ggf. alle 6 Wochen ca. und ein wenig auf Sommerferien (Berlin/Brandenburg) / Herbstferien achten \nAnsonsten Plantechnisch auch ExpoReal mit beachtne (Messe München 6.-8.10.25) (können wir vorher schicken damit wir die Messe mit ankündigen und mich auch als vor Ort anpreisen. Dazu auch einen Post.\nDann Tag der Immobilienwirtschaft ZIA 4.6.2025 (entweder vorher oder hinterher) Hinterher wäre charmant als Resümee... Agenda steht ja meistens schon vorher etc. etc......	8	2025-03-05 23:00:00
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
H1RE_B91pNQGQl9YV_9F-HbCY2jbU4el	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-08T09:56:37.772Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-03-08 13:53:51
8_mEdslMY7CB1sCjgZg0vYu3E2X1iRbf	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-08T14:00:00.523Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-03-08 14:10:47
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

SELECT pg_catalog.setval('public.backups_id_seq', 33, true);


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

SELECT pg_catalog.setval('public.posts_id_seq', 55, true);


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

SELECT pg_catalog.setval('public.todos_id_seq', 14, true);


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

