#!/bin/bash

# Charlie Van Dashboard - AdGuard Home Installation Script
# For Kuma Router (MediaTek MT7902)
# Usage: bash install-adguard.sh

set -e

echo "🚀 AdGuard Home Installation for Kuma Router"
echo "=============================================="

# Step 1: Check architecture
echo "📍 Step 1: Checking router architecture..."
ARCH=$(uname -m)
echo "Architecture detected: $ARCH"

if [[ "$ARCH" == "armv7l" ]]; then
    DOWNLOAD_URL="https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_arm.tar.gz"
    FILENAME="AdGuardHome_linux_arm.tar.gz"
    echo "✓ Using ARM (32-bit) build"
elif [[ "$ARCH" == "aarch64" ]]; then
    DOWNLOAD_URL="https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_arm64.tar.gz"
    FILENAME="AdGuardHome_linux_arm64.tar.gz"
    echo "✓ Using ARM64 (64-bit) build"
elif [[ "$ARCH" == "x86_64" ]]; then
    DOWNLOAD_URL="https://github.com/AdguardTeam/AdGuardHome/releases/download/v0.107.40/AdGuardHome_linux_amd64.tar.gz"
    FILENAME="AdGuardHome_linux_amd64.tar.gz"
    echo "✓ Using x86_64 build"
else
    echo "❌ Unsupported architecture: $ARCH"
    exit 1
fi

# Step 2: Download
echo ""
echo "📥 Step 2: Downloading AdGuard Home..."
cd /tmp
wget -q --show-progress "$DOWNLOAD_URL"
echo "✓ Downloaded $FILENAME"

# Step 3: Extract
echo ""
echo "📦 Step 3: Extracting..."
tar xvf "$FILENAME" > /dev/null
echo "✓ Extracted"

# Step 4: Install
echo ""
echo "🔧 Step 4: Installing to /opt/AdGuardHome..."
sudo mv AdGuardHome /opt/AdGuardHome
sudo chmod +x /opt/AdGuardHome/AdGuardHome
echo "✓ Installed"

# Step 5: Create systemd service
echo ""
echo "⚙️  Step 5: Creating systemd service..."
sudo tee /etc/systemd/system/adguardhome.service > /dev/null <<'EOF'
[Unit]
Description=AdGuard Home
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/AdGuardHome
ExecStart=/opt/AdGuardHome/AdGuardHome -c /opt/AdGuardHome/AdGuardHome.yaml -w /opt/AdGuardHome
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF
echo "✓ Service created"

# Step 6: Enable and start
echo ""
echo "🚀 Step 6: Starting AdGuard Home..."
sudo systemctl daemon-reload
sudo systemctl enable adguardhome
sudo systemctl start adguardhome
echo "✓ Started"

# Step 7: Wait for startup
echo ""
echo "⏳ Waiting for AdGuard Home to start (10 seconds)..."
sleep 10

# Step 8: Verify
echo ""
echo "✅ Step 8: Verifying installation..."
if sudo systemctl is-active --quiet adguardhome; then
    echo "✓ AdGuard Home is running!"
else
    echo "❌ AdGuard Home failed to start"
    echo "Check logs: sudo journalctl -u adguardhome -f"
    exit 1
fi

# Step 9: Show status
echo ""
echo "📊 Status:"
sudo systemctl status adguardhome --no-pager

# Step 10: Get router IP
ROUTER_IP=$(hostname -I | awk '{print $1}')
echo ""
echo "✨ Installation Complete!"
echo "=============================================="
echo ""
echo "📱 Access AdGuard Home Dashboard:"
echo "   🌐 http://$ROUTER_IP:3000"
echo "   🌐 http://192.168.188.1:3000"
echo ""
echo "🔐 First Run Setup:"
echo "   1. Open the dashboard above"
echo "   2. Set admin username and password"
echo "   3. Configure blocklists and rules"
echo ""
echo "📝 Useful Commands:"
echo "   Status:  sudo systemctl status adguardhome"
echo "   Logs:    sudo journalctl -u adguardhome -f"
echo "   Stop:    sudo systemctl stop adguardhome"
echo "   Start:   sudo systemctl start adguardhome"
echo "   Restart: sudo systemctl restart adguardhome"
echo ""
echo "🎯 Next Steps:"
echo "   1. Configure DNS in router to use 127.0.0.1:53"
echo "   2. Add blocklists (EasyList, uBlock, etc.)"
echo "   3. Set custom DNS rules"
echo "   4. Configure parental controls if needed"
echo ""
echo "🚐 For Charlie Dashboard:"
echo "   Update NETWORK_INVENTORY.md with AdGuard DNS info"
echo ""
