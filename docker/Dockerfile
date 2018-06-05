FROM alpine:latest
MAINTAINER mickael.kerjean@gmail.com

RUN apk --no-cache add --virtual .run-deps nodejs exiv2-dev && \
    apk --no-cache add --virtual .build-deps gcc g++ make curl git python && \
    # DEPS
    # dcraw
    cd /tmp/ && \
    curl https://www.cybercom.net/~dcoffin/dcraw/dcraw.c > /tmp/dcraw.c && \
    gcc -o dcraw -O4 dcraw.c -lm -DNODEPS && \
    mv dcraw /bin && \
    # sharp
    apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/ && \
    # APP
    git clone https://github.com/mickael-kerjean/nuage_transform /app && \
    cd /app && \
    npm install --only=production && \
    apk del .build-deps

EXPOSE 8335
WORKDIR "/app"
ENV NODE_ENV production
CMD ["node", "/app/src/index"]