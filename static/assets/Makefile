SHELL := /usr/bin/env bash

# define standard colors
ifneq (,$(findstring xterm,${TERM}))
	BLACK        := $(shell tput -Txterm setaf 0)
	RED          := $(shell tput -Txterm setaf 1)
	GREEN        := $(shell tput -Txterm setaf 2)
	YELLOW       := $(shell tput -Txterm setaf 3)
	LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
	PURPLE       := $(shell tput -Txterm setaf 5)
	BLUE         := $(shell tput -Txterm setaf 6)
	WHITE        := $(shell tput -Txterm setaf 7)
	RESET := $(shell tput -Txterm sgr0)
else
	BLACK        := ""
	RED          := ""
	GREEN        := ""
	YELLOW       := ""
	LIGHTPURPLE  := ""
	PURPLE       := ""
	BLUE         := ""
	WHITE        := ""
	RESET        := ""
endif

ENV_PATH ?= ./apps/nextjs-app

CI_JOB_ID ?= 0
CI ?= 0

# Timeout used to await services to become healthy
TIMEOUT ?= 300

SCRATCH ?= /tmp

UNAME_S := $(shell uname -s)

# prisma database url defaults
SQLITE_PRISMA_DATABASE_URL ?= file:../../db/main.db
# set param statement_cache_size=1 to avoid query error `ERROR: cached plan must not change result type` after alter column type (modify field type)
POSTGES_PRISMA_DATABASE_URL ?= postgresql://teable:teable\@127.0.0.1:5432/teable?schema=public\&statement_cache_size=1



ifeq ($(CI),0)
    export NODE_ENV = development
endif




define print_db_mode_options
@echo -e "\nSelect a database to start.\n"
@echo -e "1)sqlite			Lightweight embedded, ideal for mobile and embedded systems, simple, resource-efficient, easy integration (default database)"
@echo -e "2)postges(pg)			Powerful and scalable, suitable for complex enterprise needs, highly customizable, rich community support\n"
endef

define print_db_push_options
@echo -e "The 'db pull' command connects to your database and adds Prisma models to your Prisma schema that reflect the current database schema.\n"
@echo -e "1) sqlite"
@echo -e "2) postges(pg)\n"
endef

.PHONY: db-mode sqlite.mode postgres.mode gen-prisma-schema gen-sqlite-prisma-schema gen-postgres-prisma-schema
.DEFAULT_GOAL := help





sqlite.integration.test:
	@export PRISMA_DATABASE_URL='file:../../db/main.db'; \
	export CALC_CHUNK_SIZE=400; \
	make sqlite.mode; \
	pnpm -F "./packages/**" run build; \
	pnpm g:test-e2e-cover

postgres.integration.test:
	@echo "PostgreSQL integration test requires manual database setup"
	@echo "Please ensure PostgreSQL is running and accessible at postgresql://teable:teable@127.0.0.1:5432/e2e_test_teable"
	@export PRISMA_DATABASE_URL=postgresql://teable:teable@127.0.0.1:5432/e2e_test_teable?schema=public\&statement_cache_size=1 && \
		make postgres.mode && \
		pnpm -F "./packages/**" run build && \
		pnpm g:test-e2e-cover

gen-sqlite-prisma-schema:
	@cd ./packages/db-main-prisma; \
		echo '{ "PRISMA_PROVIDER": "sqlite" }' | pnpm mustache - ./prisma/template.prisma > ./prisma/sqlite/schema.prisma
	@echo 'generate【 prisma/sqlite/schema.prisma 】success.'

gen-postgres-prisma-schema:
	@cd ./packages/db-main-prisma; \
		echo '{ "PRISMA_PROVIDER": "postgres" }' | pnpm mustache - ./prisma/template.prisma > ./prisma/postgres/schema.prisma
	@echo 'generate【 prisma/postgres/schema.prisma 】success.'

gen-prisma-schema: gen-sqlite-prisma-schema gen-postgres-prisma-schema		## Generate 'schema.prisma' files for all versions of the system

sqlite-db.push:		## db.push by sqlite
	@cd ./packages/db-main-prisma; \
		pnpm prisma-db-push --schema ./prisma/sqlite/schema.prisma

postgres-db.push:		## db.push by postgres
	@cd ./packages/db-main-prisma; \
		pnpm prisma-db-push --schema ./prisma/postgres/schema.prisma

db.push:		## connects to your database and adds Prisma models to your Prisma schema that reflect the current database schema.
	$(print_db_push_options)
	@read -p "Enter a command: " command; \
    if [ "$$command" = "1" ] || [ "$$command" = "sqlite" ]; then \
      make gen-sqlite-prisma-schema; \
      make sqlite-db.push; \
    elif [ "$$command" = "2" ] || [ "$$command" = "postges" ] || [ "$$command" = "pg" ]; then \
      	make gen-postgres-prisma-schema; \
		make postgres-db.push; \
    else echo "Unknown command.";  fi

sqlite-db-migration:
	@_MIGRATION_NAME=$(if $(_MIGRATION_NAME),$(_MIGRATION_NAME),`read -p "Enter name of the migration (sqlite): " migration_name; echo $$migration_name`); \
	make gen-sqlite-prisma-schema; \
	PRISMA_DATABASE_URL=file:../../db/.shadow/main.db \
	pnpm -F @teable/db-main-prisma prisma-migrate dev --schema ./prisma/sqlite/schema.prisma --name $$_MIGRATION_NAME

postgres-db-migration:
	@_MIGRATION_NAME=$(if $(_MIGRATION_NAME),$(_MIGRATION_NAME),`read -p "Enter name of the migration (postgres): " migration_name; echo $$migration_name`); \
	make gen-postgres-prisma-schema; \
	PRISMA_DATABASE_URL=postgresql://teable:teable@127.0.0.1:5432/teable?schema=shadow \
	pnpm -F @teable/db-main-prisma prisma-migrate dev --schema ./prisma/postgres/schema.prisma --name $$_MIGRATION_NAME

db-migration:		## Reruns the existing migration history in the shadow database in order to detect schema drift (edited or deleted migration file, or a manual changes to the database schema)
	@read -p "Enter name of the migration: " migration_name; \
  	make sqlite-db-migration _MIGRATION_NAME=$$migration_name; \
  	make postgres-db-migration _MIGRATION_NAME=$$migration_name

sqlite.mode:		## sqlite.mode
	@cd ./packages/db-main-prisma; \
		pnpm prisma-generate --schema ./prisma/sqlite/schema.prisma; \
		pnpm prisma-migrate deploy --schema ./prisma/sqlite/schema.prisma

postgres.mode:		## postgres.mode
	@cd ./packages/db-main-prisma; \
		pnpm prisma-generate --schema ./prisma/postgres/schema.prisma; \
		pnpm prisma-migrate deploy --schema ./prisma/postgres/schema.prisma
# Override environment variable files based on variables
RUN_DB_MODE ?= sqlite
FILE_ENV_PATHS = $(ENV_PATH)/.env.development* $(ENV_PATH)/.env.test*
switch.prisma.env:
ifeq ($(CI)-$(RUN_DB_MODE),0-sqlite)
	@for file in $(FILE_ENV_PATHS); do \
		echo $$file; \
		perl -i -pe 's~^PRISMA_DATABASE_URL=.*~PRISMA_DATABASE_URL=$(SQLITE_PRISMA_DATABASE_URL)~' $$file; \
		if ! grep -q '^CALC_CHUNK_SIZE=' $$file; then \
			echo "CALC_CHUNK_SIZE=400" >> $$file; \
		else \
			perl -i -pe 's~^CALC_CHUNK_SIZE=.*~CALC_CHUNK_SIZE=400~' $$file; \
		fi; \
	done
else ifeq ($(CI)-$(RUN_DB_MODE),0-postges)
	@for file in $(FILE_ENV_PATHS); do \
		echo $$file; \
		perl -i -pe 's~^PRISMA_DATABASE_URL=.*~PRISMA_DATABASE_URL=$(POSTGES_PRISMA_DATABASE_URL)~' $$file; \
	done
endif

switch-db-mode:		## Switch Database environment
	$(print_db_mode_options)
	@read -p "Enter a command: " command; \
    if [ "$$command" = "1" ] || [ "$$command" = "sqlite" ]; then \
		make switch.prisma.env RUN_DB_MODE=sqlite; \
      	make sqlite.mode; \
    elif [ "$$command" = "2" ] || [ "$$command" = "postges" ] || [ "$$command" = "pg" ]; then \
      	make switch.prisma.env RUN_DB_MODE=postges; \
		echo "Please ensure PostgreSQL is running and accessible at postgresql://teable:teable@127.0.0.1:5432/teable"; \
    	make postgres.mode; \
    else \
      	echo "Unknown command.";  fi

help:   ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
