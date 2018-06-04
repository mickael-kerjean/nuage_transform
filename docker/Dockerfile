FROM alpine:latest
MAINTAINER mickael.kerjean@gmail.com

RUN apk add --no-cache nodejs && \
    apk --no-cache add --virtual .build-deps gcc curl git && \
    curl https://www.cybercom.net/~dcoffin/dcraw/dcraw.c > /tmp/dcraw.c && \
    cd /tmp/ && \
    gcc -o dcraw -O4 dcraw.c -lm -DNODEPS && \
    mv dcraw /bin && \
	git clone https://github.com/mickael-kerjean/nuage_transform /app && \
    npm install --only=production && \
    apk del .build-deps && \

EXPOSE 8335
WORKDIR "/app"
ENV NODE_ENV production
CMD ["node", "/app/src/index"]