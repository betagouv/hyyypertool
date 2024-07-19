# Hyyypertool

<p align="center">
    <img src=".github/Charco - Security.png">
</p>

> Backoffice moderation tool for MonComptePro

## Install

First, you need bun to be installed: https://bun.sh/

Then install dependencies with: `bun install`.

Build it: `bun run build`.

Start the moncomptepro database with: `docker compose up -d`

Ask a colleague for a database dump, then import it with:

```
docker compose exec -T postgres-moncomptepro pg_restore --clean --no-owner --dbname postgres --user postgres < moncomptepro-staging-database_20231114103427.sql
```

Then run the app: `bun run dev`.

Then go to http://localhost:3000/.

## With local moncomptepro

```sh
$ DOT_ENV=mcp bun run dev
```
