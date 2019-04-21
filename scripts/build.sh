#!/bin/bash

# build and push the docker file for backend
docker build -t hongkong-map-timeline/backend -f backend/Dockerfile backend && \
docker tag hongkong-map-timeline/backend nandiheath/hongkong-map-timeline-backend:latest && \
docker push nandiheath/hongkong-map-timeline-backend:latest

# build and push the docker file for frontend
docker build -t hongkong-map-timeline/frontend -f app/Dockerfile app && \
docker tag hongkong-map-timeline/frontend nandiheath/hongkong-map-timeline-frontend:latest && \
docker push nandiheath/hongkong-map-timeline-frontend:latest
