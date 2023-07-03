Vagrant.configure("2") do |config|

 config.vm.define "sensor" do |config|
        config.vm.box = "ubuntu/focal64"
       
 config.vm.network "private_network", ip: "192.168.33.10"
        config.vm.network "public_network", ip: "192.168.0.31"
    config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 2
    end 

config.vm.provision "shell",privileged: false, inline: <<-SHELL
export hadoopipAddress='192.168.0.33'
export mqttpassword='mataelang'
export mqttusername='matelang'

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
echo ======================== Downloading Hadoop ========================
echo ====================================================================
sudo apt-get install ssh pdsh -y
wget -P /home/$user https://dlcdn.apache.org/hadoop/common/hadoop-3.3.3/hadoop-3.3.3.tar.gz
tar -xzf /home/$user/hadoop-3.3.3.tar.gz -C /home/$user
sudo mv /home/$user/hadoop-3.3.3 /home/$user/hadoop

### Append to the end of the file.
sudo echo "export HADOOP_HOME=/home/$user/hadoop" >> /home/$user/.bashrc
sudo echo 'export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin' >> /home/$user/.bashrc
sudo echo 'export PDSH_RCMD_TYPE=ssh' >> /home/$user/.bashrc
sudo echo 'export PDSH_RCMD_TYPE=ssh' >> /home/$user/hadoop/etc/hadoop/hadoop-env.sh

source /home/$user/.bashrc

echo ====================================================================
echo ===================== Creating passwordless SSH for Hadoop ===========================
echo ====================================================================
ssh-keygen -t rsa -P '' -f /home/$user/.ssh/id_rsa
cat /home/$user/.ssh/id_rsa.pub >> /home/$user/.ssh/authorized_keys
chmod 0600 /home/$user/.ssh/authorized_keys
chmod 777 /home/$user/hadoop/logs

echo ====================================================================
echo ===================== Configuring Hadoop ===========================
echo ====================================================================
sed -i "55 i export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64" /home/$user/hadoop/etc/hadoop/hadoop-env.sh

##configure core-site.xml
sed -i "/<configuration>/a \
    <property> \
    <name>fs.defaultFS</name> \
    <value>hdfs://$hadoopipAddress:9000</value> \
    </property>" \
    /home/$user/hadoop/etc/hadoop/core-site.xml

##configure hdfs-site.xml
sed -i "/<configuration>/a \
    <property> \
        <name>dfs.replication</name> \
        <value>1</value> \
    </property> \
    <property> \
        <name>dfs.namenode.rpc-bind-host</name> \
        <value>0.0.0.0</value> \
    </property>" \
    /home/$user/hadoop/etc/hadoop/hdfs-site.xml

/home/$user/hadoop/bin/hdfs namenode -format

echo ====================================================================
echo ===================== Starting Hadoop dfs  =========================
echo ====================================================================
/home/$user/hadoop/sbin/start-dfs.sh

echo ====================================================================
echo ================== Creating Hadoop dfs Directory  ==================
echo ====================================================================
/home/$user/hadoop/bin/hdfs dfs -mkdir -p hdfs://localhost:9000/user/$user/kafka-checkpoint
/home/$user/hadoop/bin/hdfs dfs -mkdir -p hdfs://localhost:9000/user/$user/kaspacore/files

echo ====================================================================
echo ================== Setting up kaspacore & GeoLite Components  ======
echo ====================================================================
wget -P /home/$user/ https://github.com/mata-elang-stable/kaspacore-java/releases/download/20230213/kaspacore.jar
tar -xzf /vagrant/GeoLite2-City_20230620.tar.gz -C /home/$user/

echo ====================================================================
echo ================== Uploading kaspacore GeoLite to HDFS  ============
echo ====================================================================
/home/$user/hadoop/bin/hdfs dfs -put /home/$user/kaspacore.jar hdfs://localhost:9000/user/$user/kaspacore/files
/home/$user/hadoop/bin/hdfs dfs -put /home/$user/GeoLite2-City_20230620/GeoLite2-City.mmdb hdfs://localhost:9000/user/$user/kaspacore/files
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
 config.vm.define "sensor" do |config|
        config.vm.box = "ubuntu/focal64"
       
 config.vm.network "private_network", ip: "192.168.33.10"
        config.vm.network "public_network", ip: "192.168.0.31"
    config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 2
    end 

config.vm.provision "shell",privileged: false, inline: <<-SHELL
export kafkaipAddress='192.168.0.1'
export mqttpassword='vag'
export mqttusername='matelang'
export openSearchipAddress='192.168.33.0'
export openSearchuser='mataelang'
export openSearchpassword='mataelang'

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
end
