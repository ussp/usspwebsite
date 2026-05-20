FROM caddy:2-alpine

COPY partners/tranzin/website/Caddyfile /etc/caddy/Caddyfile
COPY partners/tranzin/website/index.html /srv/index.html
COPY partners/tranzin/website/robots.txt /srv/robots.txt
COPY partners/tranzin/website/assets /srv/assets
COPY partners/tranzin/website/decks /srv/decks

RUN caddy version && caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
