dev.up:
	docker compose up -d

dev.down:
	docker compose down

stage.up:
	docker compose -f stage.docker-compose.yml up -d

stage.down: 
	docker compose -f stage.docker-compose.yml down