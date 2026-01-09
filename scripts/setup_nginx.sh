#!/bin/bash
set -e

echo "=== Installing and configuring Nginx ==="

# Install Nginx
apt install -y nginx certbot python3-certbot-nginx

# Stop default site
rm -f /etc/nginx/sites-enabled/default

# This will be copied from repo later
echo "Nginx installed. After cloning the repo, run:"
echo "ln -sf /home/deploy/myapp/config/nginx.conf /etc/nginx/sites-available/myapp"
echo "ln -sf /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/"
echo "nginx -t && systemctl reload nginx"