# =====================================================
# CodeLive — Makefile
# Runs from repository root (codelive/)
# =====================================================

COMPOSE = docker compose -f sources/docker-compose.yml
BACKEND = $(COMPOSE) exec backend

.PHONY: build up down logs restart clean seed open help

## build: Construye las imágenes y arranca todos los servicios
build:
	$(COMPOSE) up --build -d

## up: Arranca los servicios sin reconstruir
up:
	$(COMPOSE) up -d

## down: Para todos los servicios
down:
	$(COMPOSE) down

## logs: Muestra los logs en tiempo real
logs:
	$(COMPOSE) logs -f

## restart: Reinicia todos los servicios
restart:
	$(COMPOSE) restart

## clean: Para servicios y elimina volúmenes (BORRA LA BASE DE DATOS)
clean:
	$(COMPOSE) down -v

## seed: Ejecuta el script de inicialización de datos (admin + editor)
seed:
	$(BACKEND) node src/seed/seed.js

## open: Abre el frontend y el backend API en el navegador
open:
	@open http://localhost:80 || xdg-open http://localhost:80 || start http://localhost:80
	@open http://localhost:3000 || xdg-open http://localhost:3000 || start http://localhost:3000

## help: Muestra esta ayuda
help:
	@grep -E '^## ' Makefile | sed 's/## /  /'