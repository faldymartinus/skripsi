Vagrant.configure("2") do |config|

config.vm.define "vm2" do |config|config.vm.box = "ubuntu/focal64"
config.vm.network "private_network", ip: "192.168.33.12"
config.vm.network "public_network", ip: "192.168.0.32"
config.vm.provider "virtualbox" do |vb|
vb.memory = "6096"
vb.cpus = 2
end
config.vm.provision "shell",privileged: false, inline: <<-SHELL
export mqttmqttIP='192.168.0.33'
export mqttusername='mata'
export kafkaipAddress='192.168.0.33'
export mqttpassword='mata'
export openSearchuser='mataelang'
export snortsnortMonitoredNetwork='192.168.0.0'
export openSearchpassword='mataelang'
export openSearchipAddress='192.168.0.32'

echo ====================================================================
echo ==================== Starting prerequisite Installation ============
echo ====================================================================
sed 's/nameserver.*/nameserver 8.8.8.8/' /etc/resolv.conf > /etc/resolv.conf.new
mv /etc/resolv.conf.new /etc/resolv.conf
sudo apt update
sudo apt -y install docker.io
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo apt -y install openjdk-11-jdk
sudo echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> /home/$user/.bashrc
sudo echo 'PDSH_RCMD_TYPE=ssh' >> /home/$user/.bashrc

echo ====================================================================
echo ==================== prerequisite Installation success =============
echo ====================================================================

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

SHELL
end
config.vm.define "vm1" do |config|config.vm.box = "ubuntu/focal64"
config.vm.network "private_network", ip: "192.168.33.11"
config.vm.network "public_network", ip: "192.168.0.31"
config.vm.provider "virtualbox" do |vb|
vb.memory = "6096"
vb.cpus = 2
end
config.vm.provision "shell",privileged: false, inline: <<-SHELL
export mqttmqttIP='192.168.0.33'
export mqttusername='mata'
export kafkaipAddress='192.168.0.33'
export mqttpassword='mata'
export openSearchuser='mataelang'
export snortsnortMonitoredNetwork='192.168.0.0'
export openSearchpassword='mataelang'
export openSearchipAddress='192.168.0.32'

echo ====================================================================
echo ==================== Starting prerequisite Installation ============
echo ====================================================================
sed 's/nameserver.*/nameserver 8.8.8.8/' /etc/resolv.conf > /etc/resolv.conf.new
mv /etc/resolv.conf.new /etc/resolv.conf
sudo apt update
sudo apt -y install docker.io
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo apt -y install openjdk-11-jdk
sudo echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> /home/$user/.bashrc
sudo echo 'PDSH_RCMD_TYPE=ssh' >> /home/$user/.bashrc

echo ====================================================================
echo ==================== prerequisite Installation success =============
echo ====================================================================

echo ====================================================================
echo ==================== Starting Kafka Installation ====================
echo ====================================================================

echo ====================================================================
echo =========================== Cloning Kafka ===========================
echo ====================================================================
git clone https://github.com/mata-elang-stable/kafka-asset.git /home/$user/kafka

export mqttIp=$(ip -o -4 addr show dev docker0 | cut -d' ' -f7 | cut -d'/' -f1)
sed -i "s/.*MQTT_HOST.*/      MQTT_HOST: $hadoopipAddress/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_USERNAME.*/      MQTT_USERNAME: $mqttusername/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_PASSWORD.*/      MQTT_PASSWORD: $mqttpassword/" /home/$user/kafka/docker-compose.yaml
sed -i "sz.*KAFKA_ADVERTISED_LISTENERS.*z      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL://$kafkaipAddress:9093z" /home/$user/kafka/docker-compose.yaml
sed -i "sz.*KAFKA_LISTENER_SECURITY_PROTOCOL_MAP.*z      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXTz" /home/$user/kafka/docker-compose.yaml

echo ====================================================================
echo =========================== Running Kafka ===========================
echo ====================================================================
sudo docker-compose -f /home/$user/kafka/docker-compose.yaml up -d

echo ====================================================================
echo ===================== Kafka instalation success =====================
echo ====================================================================
echo ====================================================================
echo ==================== Starting MQTT Installation ====================
echo ====================================================================

echo ====================================================================
echo =========================== Cloning MQTT ===========================
echo ====================================================================
git clone https://github.com/mata-elang-stable/mosquitto-asset.git /home/$user/mosquitto

mv /home/$user/mosquitto/mosquitto.conf.example /home/$user/mosquitto/mosquitto.conf
cd /home/$user/mosquitto &&\

echo ====================================================================
echo =========================== Running MQTT ===========================
echo ====================================================================
sudo sudo docker run --rm -e USERNAME=$mqttusername -e PASSWORD=$mqttpassword --entrypoint /bin/sh eclipse-mosquitto:2.0.15 -c '/usr/bin/mosquitto_passwd -c -b password_file $USERNAME $PASSWORD && cat password_file' | tee mosquitto_passwd && /home/$user/mosquitto/mosquitto_passwd

sudo docker-compose -f /home/$user/mosquitto/docker-compose.yaml up -d   

echo ====================================================================
echo ===================== MQTT instalation success =====================
echo ====================================================================
SHELL
end
config.vm.define "vm3" do |config|config.vm.box = "ubuntu/focal64"
config.vm.network "private_network", ip: "192.168.33.13"
config.vm.network "public_network", ip: "192.168.0.33"
config.vm.provider "virtualbox" do |vb|
vb.memory = "2048"
vb.cpus = 1
end
config.vm.provision "shell",privileged: false, inline: <<-SHELL
export mqttmqttIP='192.168.0.33'
export mqttusername='mata'
export kafkaipAddress='192.168.0.33'
export mqttpassword='mata'
export openSearchuser='mataelang'
export snortsnortMonitoredNetwork='192.168.0.0'
export openSearchpassword='mataelang'
export openSearchipAddress='192.168.0.32'

echo ====================================================================
echo ==================== Starting prerequisite Installation ============
echo ====================================================================
sed 's/nameserver.*/nameserver 8.8.8.8/' /etc/resolv.conf > /etc/resolv.conf.new
mv /etc/resolv.conf.new /etc/resolv.conf
sudo apt update
sudo apt -y install docker.io
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo apt -y install openjdk-11-jdk
sudo echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> /home/$user/.bashrc
sudo echo 'PDSH_RCMD_TYPE=ssh' >> /home/$user/.bashrc

echo ====================================================================
echo ==================== prerequisite Installation success =============
echo ====================================================================

echo ====================================================================
echo ==================== Starting Snort Installation ===================
echo ====================================================================
git clone https://github.com/mata-elang-stable/sensor-snort.git /home/$user/sensor
sed -i "s/.*NETWORK_INTERFACE.*/      - NETWORK_INTERFACE=enp0s9/" /home/$user/sensor/docker-compose.yaml
sed -i "s/.*MQTT_HOST.*/      - MQTT_HOST=$mqttIP/" /home/$user/sensor/docker-compose.yaml
sed -i "s/.*MQTT_USERNAME.*/      - MQTT_USERNAME=$mqttusername/" /home/$user/sensor/docker-compose.yaml
sed -i "s/.*MQTT_PASSWORD.*/      - MQTT_PASSWORD=$mqttpassword/" /home/$user/sensor/docker-compose.yaml
sed -i "s/<machine-id>/1 /" /home/$user/sensor/docker-compose.yaml
sed -i "s/<sensor-id>/1 /" /home/$user/sensor/docker-compose.yaml


sed -i "s/.*HOME_NET = .*>./HOME_NET = 172.17.0.0 /" /home/$user/sensor/snort/snort.lua

mv /home/$user/sensor/snort/pulledpork.conf.example /home/$user/sensor/snort/pulledpork.conf
sed -i "s/.*oinkcode =.*/oinkcode = bffbce2a80f193e7bcdb91ae1e05bb558911e529/" /home/$user/sensor/snort/pulledpork.conf

sudo docker-compose -f /home/$user/sensor/docker-compose.yaml up -d

echo ====================================================================
echo ==================== Snort Installation Success ====================
echo ====================================================================
SHELL
end
end
