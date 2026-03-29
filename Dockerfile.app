FROM node:20-bullseye-slim AS builder

WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY . .

ENV GENERATE_SOURCEMAP=false
ENV CI=false
ENV NODE_OPTIONS=--max-old-space-size=4096

# Install dependencies once using the repo script, then follow the web-app
# subset of the repo build order.
RUN bash install.sh
RUN cd common/analytics-vendors && bash build.sh
RUN cd common/rule-processor && bash build.sh
RUN npm run build
RUN cd shared && bash build.sh
RUN cd app && bash build.sh local

FROM nginx:1.27-alpine AS runtime

COPY docker/nginx/app.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
