#!/bin/bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./setup_ssl.sh yourdomain.com your@email.com"
    exit 1
fi

DOMAIN=$1
EMAIL=$2

echo "=== Setting up SSL for $DOMAIN ==="

# Get certificate
certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --no-eff-email --redirect

# Auto-renewal is handled by certbot timer
systemctl status certbot.timer

echo "SSL setup complete"