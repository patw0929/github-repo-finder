/* CREATE TABLE & DATA */
CREATE TABLE tags (
  ID SERIAL PRIMARY KEY,
  repo VARCHAR,
  username VARCHAR,
  tag VARCHAR,
  isPublic BOOLEAN DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO tags (repo, username, tag, isPublic)
  VALUES ('patw0929/react-intl-tel-input', 'patw0929', 'telephone', true);



/* CREATE FUNCTION */
CREATE OR REPLACE FUNCTION fn_GetReposByTag
(
 Search_Tag VARCHAR
 ,Paging_PageSize INTEGER = NULL
 ,Paging_PageNumber INTEGER = NULL
)
RETURNS TABLE
(
 outRepoID INTEGER
 ,outRepoName VARCHAR
) AS
$BODY$

DECLARE PageNumber BIGINT;

BEGIN
 /* ***************************************************************
 Construct Custom paging parameter...
 **************************************************************** */
 IF (paging_pagesize IS NOT NULL AND paging_pagenumber IS NOT NULL) THEN
  PageNumber := (Paging_PageSize * (Paging_PageNumber-1));
 END IF;

 /* ************************************************
 Custome paging SQL Query construction.......
 ************************************************ */
 RETURN QUERY
 SELECT
  id
  ,repo
 FROM public.tags
 WHERE tag = Search_Tag
 ORDER BY created_at DESC
 LIMIT Paging_PageSize
 OFFSET PageNumber;

 EXCEPTION WHEN OTHERS THEN
 RAISE;
END;

$BODY$
LANGUAGE 'plpgsql';
