#!/bin/bash
set -e

echo "=== Initial Server Setup ==="

# Update system
apt update && apt upgrade -y

# Install essentials
apt install -y curl git ufw fail2ban

# Install Docker
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose plugin
apt install -y docker-compose-plugin

# Create deploy user
if ! id -u deploy &> /dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy

    # Setup SSH for deploy user
    mkdir -p /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    chown -R deploy:deploy /home/deploy/.ssh

    echo "Add your SSH public key to /home/deploy/.ssh/authorized_keys"
    echo "Then run: chmod 600 /home/deploy/.ssh/authorized_keys"
fi

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Basic fail2ban config
systemctl enable fail2ban
systemctl start fail2ban

echo "=== Server setup complete ==="
echo "Next steps:"
echo "1. Add SSH key for deploy user"
echo "2. Run setup_nginx.sh"
echo "3. Clone your repo to /home/deploy/myapp"
echo "4. Run setup_ssl.sh"