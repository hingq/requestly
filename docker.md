```sh
docker images
docker save -o requestly-linux-amd64.tar requestly-app

scp ./requestly-linux-amd64.tar root@47.108.133.169:/requestly

docker load -i requestly-linux-amd64.tar

docker compose down
docker compose up -d --force-recreate nextjs
```
