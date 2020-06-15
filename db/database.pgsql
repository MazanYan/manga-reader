--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

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

--
-- Name: account_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_type AS ENUM (
    'admin',
    'contributor',
    'user'
);


ALTER TYPE public.account_type OWNER TO postgres;

--
-- Name: manga_page_image_name; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.manga_page_image_name AS (
	manga_name character varying,
	chapter_num integer,
	page_num integer
);


ALTER TYPE public.manga_page_image_name OWNER TO postgres;

--
-- Name: bytea_import(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.bytea_import(p_path text, OUT p_result bytea) RETURNS bytea
    LANGUAGE plpgsql
    AS $$
	DECLARE
	  l_oid oid;
	BEGIN
	  SELECT lo_import(p_path) INTO l_oid;
	  SELECT lo_get(l_oid) INTO p_result;
	  PERFORM lo_unlink(l_oid);
	END;$$;


ALTER FUNCTION public.bytea_import(p_path text, OUT p_result bytea) OWNER TO postgres;

--
-- Name: get_manga_page_image(bigint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_manga_page_image(chapter_key bigint, page_number integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
	--DECLARE file_name manga_page_image_name;
	DECLARE file_name varchar;
	BEGIN
		SELECT CONCAT_WS('.', manga.name, chapter.number, manga_page.page_number) FROM manga_page 
			INNER JOIN chapter ON chapter.chapter_key=manga_page.chapter_key 
			INNER JOIN manga ON manga.name='Naruto' INTO file_name;
	END;
	$$;


ALTER FUNCTION public.get_manga_page_image(chapter_key bigint, page_number integer) OWNER TO postgres;

--
-- Name: next_page(integer, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.next_page(page integer, chapter_num bigint) RETURNS TABLE(f1 bigint, f2 integer, f3 bytea, f4 character varying)
    LANGUAGE plpgsql
    AS $$
	DECLARE chapter_pages_count int;
 	BEGIN
		SELECT pages_count FROM chapter WHERE chapter_key=chapter_num LIMIT 1 INTO chapter_pages_count;
 		IF chapter_pages_count=page THEN
 			RETURN QUERY SELECT * FROM manga_page WHERE chapter_key=chapter_num+1 AND page_number=1;
 		ELSE
 			RETURN QUERY SELECT * FROM manga_page WHERE chapter_key=chapter_num AND page_number=page+1;
 		END IF;
 	END; $$;


ALTER FUNCTION public.next_page(page integer, chapter_num bigint) OWNER TO postgres;

--
-- Name: prev_page(integer, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prev_page(page integer, chapter_num bigint) RETURNS TABLE(f1 bigint, f2 integer, f3 bytea, f4 character varying)
    LANGUAGE plpgsql
    AS $$
 	DECLARE chapter_pages_count int;
  	BEGIN
 		--SELECT pages_count FROM chapter WHERE chapter_key=chapter_num LIMIT 1 INTO chapter_pages_count;
  		IF page=1 THEN
		BEGIN
			SELECT pages_count FROM chapter WHERE chapter_key=chapter_num LIMIT 1 INTO chapter_pages_count;
  			RETURN QUERY SELECT * FROM manga_page WHERE chapter_key=chapter_num+1 AND page_number=1;
		END;
  		ELSE
  			RETURN QUERY SELECT * FROM manga_page WHERE chapter_key=chapter_num AND page_number=page+1;
  		END IF;
  	END; $$;


ALTER FUNCTION public.prev_page(page integer, chapter_num bigint) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id character varying NOT NULL,
    name character varying NOT NULL,
    registration_time timestamp with time zone NOT NULL,
    is_online boolean,
    last_online timestamp with time zone,
    photo bytea,
    description character varying,
    passw_hashed character varying NOT NULL,
    type public.account_type NOT NULL,
    email character varying NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: bookmark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookmark (
    account character varying NOT NULL,
    manga_key bigint NOT NULL,
    chapter integer,
    page integer,
    first_bookmark boolean NOT NULL
);


ALTER TABLE public.bookmark OWNER TO postgres;

--
-- Name: chapter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chapter (
    chapter_key bigint NOT NULL,
    manga_key bigint NOT NULL,
    name character varying,
    number integer NOT NULL,
    volume integer,
    add_time timestamp with time zone NOT NULL,
    pages_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.chapter OWNER TO postgres;

--
-- Name: chapter_manga_key_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chapter_manga_key_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chapter_manga_key_seq OWNER TO postgres;

--
-- Name: chapter_manga_key_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chapter_manga_key_seq OWNED BY public.chapter.manga_key;


--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    comment_id bigint NOT NULL,
    author character varying NOT NULL,
    page_key bigint NOT NULL,
    text character varying(1000) NOT NULL,
    rating integer NOT NULL,
    time_added timestamp with time zone NOT NULL,
    answer_on bigint
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: manga; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manga (
    name character varying NOT NULL,
    author character varying NOT NULL,
    description character varying NOT NULL,
    manga_key numeric NOT NULL,
    bookmarks_count bigint NOT NULL,
    add_time timestamp with time zone NOT NULL
);


ALTER TABLE public.manga OWNER TO postgres;

--
-- Name: manga_manga_key_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.manga_manga_key_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.manga_manga_key_seq OWNER TO postgres;

--
-- Name: manga_manga_key_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.manga_manga_key_seq OWNED BY public.manga.manga_key;


--
-- Name: manga_page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manga_page (
    chapter_key bigint NOT NULL,
    page_number integer NOT NULL,
    image bytea NOT NULL,
    image_type character varying NOT NULL
);


ALTER TABLE public.manga_page OWNER TO postgres;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    account character varying NOT NULL,
    notification_id bigint NOT NULL,
    text character varying NOT NULL,
    readen boolean NOT NULL,
    author character varying NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: salts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salts (
    id character varying NOT NULL,
    salt character varying NOT NULL
);


ALTER TABLE public.salts OWNER TO postgres;

--
-- Name: chapter manga_key; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapter ALTER COLUMN manga_key SET DEFAULT nextval('public.chapter_manga_key_seq'::regclass);


--
-- Name: manga manga_key; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manga ALTER COLUMN manga_key SET DEFAULT nextval('public.manga_manga_key_seq'::regclass);


--
-- Name: account account_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);


--
-- Name: account account_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key1 UNIQUE (email);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: bookmark bookmark_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT bookmark_key PRIMARY KEY (account, manga_key);


--
-- Name: chapter chapter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapter
    ADD CONSTRAINT chapter_pkey PRIMARY KEY (chapter_key);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (comment_id);


--
-- Name: account email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: manga manga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manga
    ADD CONSTRAINT manga_pkey PRIMARY KEY (manga_key);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (notification_id);


--
-- Name: manga_page page_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manga_page
    ADD CONSTRAINT page_key PRIMARY KEY (chapter_key, page_number);


--
-- Name: salts account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salts
    ADD CONSTRAINT account FOREIGN KEY (id) REFERENCES public.account(id);


--
-- Name: notification account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT account FOREIGN KEY (account) REFERENCES public.account(id);


--
-- Name: bookmark account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT account FOREIGN KEY (account) REFERENCES public.account(id) NOT VALID;


--
-- Name: comment answer_on; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT answer_on FOREIGN KEY (answer_on) REFERENCES public.comment(comment_id) NOT VALID;


--
-- Name: notification author; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT author FOREIGN KEY (account) REFERENCES public.account(id);


--
-- Name: manga_page chapter_key; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manga_page
    ADD CONSTRAINT chapter_key FOREIGN KEY (chapter_key) REFERENCES public.chapter(chapter_key);


--
-- Name: chapter manga_key; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chapter
    ADD CONSTRAINT manga_key FOREIGN KEY (manga_key) REFERENCES public.manga(manga_key);


--
-- Name: bookmark manga_key; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT manga_key FOREIGN KEY (manga_key) REFERENCES public.manga(manga_key) NOT VALID;


--
-- PostgreSQL database dump complete
--

