COMPOSE_PATH=sources/docker-compose.yml

all: build up

up:
	docker compose -f $(COMPOSE_PATH) up -d

down:
	docker compose -f $(COMPOSE_PATH) down

build:
	docker compose -f $(COMPOSE_PATH) up -d --build

logs:
	docker compose -f $(COMPOSE_PATH) logs -f

restart: down up

clean:
	docker compose -f $(COMPOSE_PATH) down -v
	docker system prune -f

open: front back

front:
	open http://localhost:5173

back:
	open http://localhost:5000

db:
	open http://localhost:8080

.PHONY: up down restart build logs clean