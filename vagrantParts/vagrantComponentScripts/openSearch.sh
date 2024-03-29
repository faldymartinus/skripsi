echo ====================================================================
echo ==================== Starting OpenSearch Installation ====================
echo ====================================================================

echo ====================================================================
echo =========================== Cloning OpenSearch ===========================
echo ====================================================================
git clone https://github.com/mata-elang-stable/opensearch-asset.git /home/$user/opensearch

sudo chmod 777 /etc/sysctl.conf
sudo echo 'vm.max_map_count=262144' >> /etc/sysctl.conf
sudo sysctl -p

sed "s/.*bootstrap_servers.*/      bootstrap_servers => "$kafkaipAddress:9093"/" /home/$user/opensearch/pipeline.conf
sed "s/.*user.*/     user => "$openSearchuser"/" /home/$user/opensearch/pipeline.conf
sed "s/.*password.*/     password => "$openSearchpassword"/" /home/$user/opensearch/pipeline.conf

echo ====================================================================
echo =========================== Running OpenSearch ===========================
echo ====================================================================

sudo docker-compose -f /home/$user/opensearch/docker-compose.yaml up -d

echo ====================================================================
echo ===================== OpenSearch instalation success ===============
echo ====================================================================
