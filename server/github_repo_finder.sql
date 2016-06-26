DROP DATABASE IF EXISTS github_repo_finder;
CREATE DATABASE github_repo_finder;

\c github_repo_finder;

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
