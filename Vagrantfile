Vagrant.configure("2") do |config|

 config.vm.define "sensor" do |config|
        config.vm.box = "ubuntu/focal64"
       
 config.vm.network "private_network", ip: "192.168.33.10"
        config.vm.network "public_network", ip: "192.168.0.31"
    config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 2
    end 
config.vm.provision "shell", inline: <<-SHELL
export vm3mqttpassword='mataelang'
export vm3kafkaipAddress='192.168.0.1'
export vm3mqttusername='matelang'
export vm5kafkaipAddress='192.168.0.1'
export vm4kafkaipAddress='192.168.0.33'

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
sudo sudo docker run --rm -e USERNAME=mataelang -e PASSWORD=mataelang --entrypoint /bin/sh eclipse-mosquitto:2.0.15 -c '/usr/bin/mosquitto_passwd -c -b password_file $USERNAME $PASSWORD && cat password_file' | tee mosquitto_passwd && /home/$user/mosquitto/mosquitto_passwd

sudo docker-compose -f /home/$user/mosquitto/docker-compose.yaml up -d   

echo ====================================================================
echo ===================== MQTT instalation success =====================
echo ====================================================================
echo ====================================================================
echo ==================== Starting Kafka Installation ====================
echo ====================================================================

echo ====================================================================
echo =========================== Cloning Kafka ===========================
echo ====================================================================
git clone https://github.com/mata-elang-stable/kafka-asset.git /home/$user/kafka

export mqttIp=$(ip -o -4 addr show dev docker0 | cut -d' ' -f7 | cut -d'/' -f1)
sed -i "s/.*MQTT_HOST.*/      MQTT_HOST: $vm1hadoopipAddress/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_USERNAME.*/      MQTT_USERNAME: $vm1mqttusername/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_PASSWORD.*/      MQTT_PASSWORD: $vm1mqttpassword/" /home/$user/kafka/docker-compose.yaml
sed -i "sz.*KAFKA_ADVERTISED_LISTENERS.*z      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL://$vm1kafkaipAddress:9093z" /home/$user/kafka/docker-compose.yaml
sed -i "sz.*KAFKA_LISTENER_SECURITY_PROTOCOL_MAP.*z      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXTz" /home/$user/kafka/docker-compose.yaml

echo ====================================================================
echo =========================== Running Kafka ===========================
echo ====================================================================
sudo docker-compose -f /home/$user/kafka/docker-compose.yaml up -d

echo ====================================================================
echo ===================== Kafka instalation success =====================
echo ====================================================================
SHELL
end
 config.vm.define "sensor" do |config|
        config.vm.box = "ubuntu/focal64"
       
 config.vm.network "private_network", ip: "192.168.33.10"
        config.vm.network "public_network", ip: "192.168.0.31"
    config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 2
    end 
config.vm.provision "shell", inline: <<-SHELL
end
export vm3mqttpassword='mataelang'
export vm3kafkaipAddress='192.168.0.1'
export vm3mqttusername='matelang'
export vm5kafkaipAddress='192.168.0.1'
export vm4kafkaipAddress='192.168.0.33'

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
sed -i "s/.*MQTT_HOST.*/      MQTT_HOST: $vm1hadoopipAddress/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_USERNAME.*/      MQTT_USERNAME: $vm1mqttusername/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_PASSWORD.*/      MQTT_PASSWORD: $vm1mqttpassword/" /home/$user/kafka/docker-compose.yaml
sed -i "sz.*KAFKA_ADVERTISED_LISTENERS.*z      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL://$vm1kafkaipAddress:9093z" /home/$user/kafka/docker-compose.yaml
sed -i "sz.*KAFKA_LISTENER_SECURITY_PROTOCOL_MAP.*z      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXTz" /home/$user/kafka/docker-compose.yaml

echo ====================================================================
echo =========================== Running Kafka ===========================
echo ====================================================================
sudo docker-compose -f /home/$user/kafka/docker-compose.yaml up -d

echo ====================================================================
echo ===================== Kafka instalation success =====================
echo ====================================================================
SHELL
 config.vm.define "sensor" do |config|
        config.vm.box = "ubuntu/focal64"
       
 config.vm.network "private_network", ip: "192.168.33.10"
        config.vm.network "public_network", ip: "192.168.0.31"
    config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 2
    end 
export vm3mqttpassword='mataelang'
export vm3kafkaipAddress='192.168.0.1'
export vm3mqttusername='matelang'
export vm5kafkaipAddress='192.168.0.1'
export vm4kafkaipAddress='192.168.0.33'

config.vm.provision "shell", inline: <<-SHELL
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
sed -i "s/.*MQTT_HOST.*/      MQTT_HOST: $vm1hadoopipAddress/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_USERNAME.*/      MQTT_USERNAME: $vm1mqttusername/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_PASSWORD.*/      MQTT_PASSWORD: $vm1mqttpassword/" /home/$user/kafka/docker-compose.yaml
sed -i "sz.*KAFKA_ADVERTISED_LISTENERS.*z      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL://$vm1kafkaipAddress:9093z" /home/$user/kafka/docker-compose.yaml
sed -i "sz.*KAFKA_LISTENER_SECURITY_PROTOCOL_MAP.*z      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXTz" /home/$user/kafka/docker-compose.yaml

echo ====================================================================
echo =========================== Running Kafka ===========================
echo ====================================================================
sudo docker-compose -f /home/$user/kafka/docker-compose.yaml up -d

echo ====================================================================
echo ===================== Kafka instalation success =====================
echo ====================================================================
SHELL
end
end
