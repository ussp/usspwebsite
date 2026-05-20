FROM caddy:2-alpine

COPY partners/tranzin/website/Caddyfile /etc/caddy/Caddyfile
COPY partners/tranzin/website/index.html /srv/index.html
COPY partners/tranzin/website/assets /srv/assets

RUN caddy version && caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
