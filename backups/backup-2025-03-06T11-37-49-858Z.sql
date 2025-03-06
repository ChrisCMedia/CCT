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
2	2025-03-06 11:37:50.332621	backup-2025-03-06T11-37-49-858Z.sql	0	pending	\N	\N
\.


--
-- Data for Name: newsletters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.newsletters (id, content, title, user_id) FROM stdin;
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
43	🌸 8. März – Weltfrauentag: Ein Tag für mehr als nur Worte 🌸\n\nHeute ist Weltfrauentag – ein Tag, der uns daran erinnert, wie wichtig es ist, Frauen in ihrer Vielfalt zu würdigen, zu stärken und ihnen die gleichen Chancen zu bieten. 💪✨\n\nIn der Immobilienbranche – wie in so vielen anderen Bereichen – sehe ich jeden Tag starke Frauen, die mit Leidenschaft, Mut und Kompetenz Großartiges leisten. Ob Kolleginnen, Kundinnen oder Partnerinnen: Jede einzelne bringt ihre eigene Stärke mit, und genau das macht uns gemeinsam so erfolgreich.\n\nDoch der Weltfrauentag ist auch ein Tag, der uns zeigt, dass wir noch viel zu tun haben. Gleichberechtigung, faire Chancen und gegenseitiger Respekt – das sind nicht nur Worte, sondern Werte, die wir täglich leben sollten.\n\n✨ An alle Frauen da draußen: Seid stolz auf Euch, glaubt an Eure Stärke und traut Euch, groß zu träumen. Wir sind hier, um uns gegenseitig zu unterstützen und gemeinsam zu wachsen.\n\n💬 Was bedeutet der Weltfrauentag für Dich? Hast Du eine Frau in Deinem Leben, der Du heute Danke sagen möchtest? Schreib es gern in die Kommentare – ich freue mich auf Deine Geschichte!\n\n#Weltfrauentag #Gleichberechtigung #Frauenpower #Zusammenhalt #Immobilien #Menschlichkeit #YOURTIMES #REALESTATE #JudithLenz	2025-03-07 23:00:00	t	8	\N	6	2025-02-20 15:44:02.84	7	\N	public	\N	post	draft	\N	\N
44	ZITAT VORLAGEN (swisslife, finde ich nicht so super...)	2025-02-20 23:00:00	f	8	/uploads/9680afbe5bcb367db2506ba1b556804c	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 17:28:58.093
47	VORLAGE 3, FAVORIT	2025-02-20 23:00:00	f	8	/uploads/c063926cf8c917794a59857e7d62ba4a	6	\N	\N	\N	public	\N	post	deleted	\N	2025-02-20 17:29:01.753
42	Spontaner Kommentar @JL zur Immobilienfinanzierung 	2025-02-24 23:00:00	t	8	\N	6	2025-02-20 13:31:39.991	8	\N	public	\N	post	deleted	\N	2025-02-27 11:15:16.527
41	🌟 Tag des Kompliments – Ein kleiner Moment, der Großes bewirken kann 🌟 \n\nHeute ist der 1. März, der internationale Tag des Kompliments – und ich finde, das ist der perfekte Anlass, um innezuhalten und ein paar liebe Worte zu verteilen. 🗣️❤️ \n\nEgal, ob im Job oder privat – wir alle wissen, wie gut es tut, ein ehrliches Kompliment zu bekommen. Ein „Du machst das großartig!“ oder „Danke, dass Du da bist!“ kann manchmal den Unterschied machen und jemandem den Tag retten. In der Immobilienbranche geht es nicht nur um Zahlen und Verträge – es sind Menschen, die sich tagtäglich einsetzen. 🤝 \nVertrauen aufzubauen, Beziehungen zu stärken und das Gefühl zu vermitteln: „Du bist wichtig, und Deine Arbeit zählt!“ Das ist es, was uns antreibt, was uns verbindet und was am Ende jeden Erfolg ausmacht. ✨ Deshalb möchte ich heute ein großes Dankeschön an mein Team, meine Partnerinnen und Partner sowie meine Kundinnen und Kunden richten: Ihr seid einfach wunderbar, und ohne Euch wäre nichts von all dem möglich. Eure Leidenschaft, Euer Einsatz und Eure Menschlichkeit sind unbezahlbar! 🙏 \n\nLasst uns den Tag nutzen, um ein bisschen Licht in den Alltag anderer zu bringen – mit einem ehrlichen Kompliment, einem warmen Lächeln oder einfach ein paar netten Worten. \n\n💬 Was war das schönste Kompliment, das Du je bekommen hast? Schreib es gern in die Kommentare – ich freue mich drauf!\n\n#Vertrauen #Komplimente #YOURTIMES #REALESTATE	2025-02-28 23:00:00	t	8	\N	6	2025-02-20 15:39:16.267	7	\N	public	\N	post	deleted	\N	2025-03-03 09:18:25.529
38	REPOST YT zum Artikel:\n\nEin wichtiger Beitrag zu einem oft unterschätzten Thema! 🙌 Eine Scheidung ist emotional herausfordernd genug – da sollte die Immobilie(n) nicht noch zur zusätzlichen Belastung werden. Die größten Fehler entstehen oft durch fehlende Einigkeit oder mangelnde Beratung. Eine sachliche Kommunikation ist in den meisten Fällen dann auch leider nicht mehr möglich.\n\nMeine Erfahrung zeigt: Wer frühzeitig Klarheit schafft und sich professionell begleiten lässt, kann finanziellen Schaden vermeiden und die bestmögliche Lösung für alle Beteiligten finden. 💡	2025-03-04 23:00:00	t	8	\N	6	2025-02-20 15:09:20.393	7	\N	public	\N	post	deleted	\N	2025-03-05 11:09:14.372
40	JL -> da muss ich noch dran pfeilen - der fühlt sich nicht rund an. ggf. terminieren wir den später: \n\nVertrauen schafft Werte – Meine Vision für exklusive Immobiliengeschäfte Als Immobilienmaklerin in Berlin ist es mir ein Herzensanliegen, nicht nur erstklassige Objekte zu vermitteln, sondern echte Lebensräume und langfristige Beziehungen aufzubauen. Gerade in Zeiten, in denen Transparenz und Diskretion immer wichtiger werden, setze ich auf exklusive Off-Market-Transaktionen – basierend auf Vertrauen, Integrität und persönlicher Nähe. Es erfüllt mich mit Stolz, mit Partnern zusammenzuarbeiten, die dieselben Werte teilen und so gemeinsam nachhaltige Investmentchancen realisieren. \n\nFür mich bedeutet echtes Vertrauen mehr als nur ein gutes Geschäft: Es öffnet Türen zu außergewöhnlichen Projekten und schafft eine Basis, auf der langfristiger Erfolg wächst. 🤝 \n\nIch freue mich auf den Austausch mit Ihnen: Wie erleben Sie Vertrauen in Ihrem Geschäftsalltag? \n\n#OffMarketInvestments #Vertrauen #ExklusiveProjekte #Immobilien #JudithLenz #Immobilieninvestment #Berlin #YOURTIMES	2025-03-10 23:00:00	f	8	\N	6	2025-02-20 15:46:18.622	7	\N	public	\N	post	draft	\N	\N
48	Vermarktungsstart: Service-Wohnen Biesenthal – Zukunftssicheres Investment in den Wachstumsmarkt Seniorenwohnen\r\n\r\n@YOUR TIMES REAL ESTATE startet die Vermarktung eines modernen Service-Wohnprojekts für Senioren in Biesenthal, Brandenburg. Mit 69 barrierefreien Wohneinheiten sowie ergänzenden Pflege- und Betreuungsangeboten setzt das Projekt neue Maßstäbe im Bereich seniorengerechtes Wohnen.\r\n\r\n📌 Standort: Biesenthal – im Speckgürtel Berlins, eingebettet in den Naturpark Barnim. Hohe Lebensqualität bei gleichzeitig guter Anbindung an die Metropole.\r\n\r\n🏗 Projektumfang: Vier moderne Stadtvillen mit Service-Wohnungen, betreuten Wohngemeinschaften, Tagespflege und einer Sozialstation.\r\n\r\n⚡ Nachhaltige Bauweise: KfW-40 EE Standard, Wärmepumpen mit Erdwärme, energieeffiziente Gebäudekonzeption.\r\n\r\n🏠 Ausstattung: Hochwertige Einbauküchen, Fußbodenheizung, großzügige Bäder mit Feinsteinzeugfliesen, Balkon oder Terrasse in jeder Einheit.\r\n\r\n📊 Marktpotenzial: Der Bedarf an seniorengerechtem Wohnen wächst rasant – getrieben durch den demografischen Wandel und ein begrenztes Angebot an modernen, betreuten Wohnformen. Betreiber und Investoren setzen zunehmend auf skalierbare, energieeffiziente Wohnkonzepte mit integriertem Pflegeservice.\r\n\r\nBiesenthal steht exemplarisch für die Entwicklung in nachgefragten Randlagen von Metropolen: steigender Zuzug, wachsender Bedarf an altersgerechtem Wohnraum und ein Marktumfeld, das langfristig stabile Renditen verspricht.\r\n\r\n#YOURTIMES #Immobilien #Investment #Seniorenwohnen #BetreutesWohnen #Zukunftsmarkt #Pflegeimmobilien #Berlin #Biesenthal	2025-03-08 23:00:00	f	8	\N	7	\N	\N	\N	public	\N	post	draft	\N	\N
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
9	Newsletter vorbereiten	f	7	Und was ist denn mit den Newsletter Vorschlägen? Werde Dich jetzt ablenken :-) Und diese Dingen könnten wir vorbereiten. Dann kann natürlich die Anlage Biesenthal mit rein... und Fachbeiträge...o.ä.\nUnd die Frage generell ist: Bleiben wir bei Brevo? Und erreichen damit meine Kunden? Und/oder nutzen wir auch den Newsletter von LinkedIn?\nTheoretisch könnte man für das Jahr durchplanen. Da wir dieses Jahr noch gar nix hatten!! Dann ggf. alle 6 Wochen ca. und ein wenig auf Sommerferien (Berlin/Brandenburg) / Herbstferien achten \nAnsonsten Plantechnisch auch ExpoReal mit beachtne (Messe München 6.-8.10.25) (können wir vorher schicken damit wir die Messe mit ankündigen und mich auch als vor Ort anpreisen. Dazu auch einen Post.\nDann Tag der Immobilienwirtschaft ZIA 4.6.2025 (entweder vorher oder hinterher) Hinterher wäre charmant als Resümee... Agenda steht ja meistens schon vorher etc. etc......	8	2025-03-05 23:00:00
8	Post für Vermarktungsstart Biesenthal	t	7	Hey Chris,\n\nbereitest Du bitte einen YT Post vor für Vemarktungsstart Biesenthal. Als JL hatte ich ja schon mal pre-opening betrieben aber jetzt können die Fakten raus :-) Du weisst ja Bescheid. Ich hätte gern das Drohnenfoto vom ganzen Projekt als auch die 2 Häuser von oben (H1 und 2) ...und tatsächlcih ein Foto von mir ..Aber die Shooting Bilder sind noch nicht fertig bearbeitet. Aber wenn - dann sind die mega :-) Da haben wir eine schöne Spielwiese...	8	2025-03-03 23:00:00
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
uSfHx_ybPv2-eWw6g-1omAubKuJg_04r	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-07T11:32:50.132Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-03-07 11:36:59
aYrWf9mZYC6cnoCH1RljoYbHpgLK6yiQ	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-06T11:09:01.588Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-03-06 11:09:43
rOqUYmDyTWUCJBschikz6L_jqltRmC5J	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-05T11:06:30.559Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":8}}	2025-03-06 11:05:32
KfXnnbSUob8JgAdna0MCv6eWlECkeYJT	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-06T07:46:11.976Z","secure":true,"httpOnly":true,"path":"/"},"passport":{"user":7}}	2025-03-06 07:46:13
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

SELECT pg_catalog.setval('public.backups_id_seq', 2, true);


--
-- Name: newsletters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.newsletters_id_seq', 1, true);


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

SELECT pg_catalog.setval('public.posts_id_seq', 48, true);


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

