Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/focal64"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 2
    end 
config.vm.provision "shell", inline: <<-SHELL
export user='vagrant'
export vm1mqttusername='allFather'
export vm1mqttpassword='sleipnir0d1ns0n'
export vm1kafkaipAddress='172.17.0.79'
export vm1openSearchpassword='sleipnir0d1ns0n'
export vm1openSearchipAddress='172.17.0.54'
export vm1openSearchuser='allFather'
export vm1hadoopuserHadoop='hadoopUser'
export vm1hadoopipAddress='172.17.0.23'
export vm1sparkipAddress=''

sed 's/nameserver.*/nameserver 8.8.8.8/' /etc/resolv.conf > /etc/resolv.conf.new
mv /etc/resolv.conf.new /etc/resolv.conf
sudo apt update
sudo apt -y install docker.io
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo apt -y install openjdk-11-jdk
sudo echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> /home/$user/.bashrc
sudo echo 'export PDSH_RCMD_TYPE=ssh' >> /home/$user/.bashrc


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
sudo docker run --rm -e USERNAME=$vm1mqttusername -e PASSWORD=$vm1mqttpassword\
--entrypoint /bin/sh eclipse-mosquitto:2.0.15\
-c '/usr/bin/mosquitto_passwd -c -b password_file $USERNAME $PASSWORD && cat password_file' |\
tee mosquitto_passwd &&\
cd ~

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
sed -i "s/.*MQTT_HOST*/      MQTT_HOST: $mqttIp/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_USERNAME.*/      MQTT_USERNAME: $vm1mqttusername/" /home/$user/kafka/docker-compose.yaml
sed -i "s/.* MQTT_PASSWORD.*/      MQTT_USERNAME: $vm1mqttpassword/" /home/$user/kafka/docker-compose.yaml

echo ====================================================================
echo =========================== Running Kafka ===========================
echo ====================================================================
sudo docker-compose -f /home/$user/kafka/docker-compose.yaml up -d

echo ====================================================================
echo ===================== Kafka instalation success =====================
echo ====================================================================
echo ====================================================================
echo ==================== Starting OpenSearch Installation ====================
echo ====================================================================

echo ====================================================================
echo =========================== Cloning OpenSearch ===========================
echo ====================================================================
git clone https://github.com/mata-elang-stable/opensearch-asset.git /home/$user/opensearch

sed "s/.*bootstrap_servers.*/      bootstrap_servers => "$vm1kafkaipAddress:9093"/" /home/$user/opensearch/pipeline.conf
sed "s/.*user.*/     user => "$vm1openSearchuser"/" /home/$user/opensearch/pipeline.conf
sed "s/.*password.*/     user => "$vm1openSearchpassword"/" /home/$user/opensearch/pipeline.conf
echo ====================================================================
echo =========================== Running OpenSearch ===========================
echo ====================================================================
sudo docker-compose -f ~/opensearch/docker-compose.yaml up -d

echo ====================================================================
echo ===================== OpenSearch instalation success =====================
echo ====================================================================
echo ====================================================================
echo ======================== Downloading Hadoop ========================
echo ====================================================================
sudo apt-get install ssh pdsh -y
wget -P /home/$user https://dlcdn.apache.org/hadoop/common/hadoop-3.3.3/hadoop-3.3.3.tar.gz
tar -xzf /home/$user/hadoop-3.3.3.tar.gz -C /home/$user
sudo mv /home/$user/hadoop-3.3.3 /home/$user/hadoop

### Append to the end of the file.
echo 'export HADOOP_HOME=/home/$user/hadoop
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin' >> /home/$user/.bashrc

source /home/$user/.bashrc

echo ====================================================================
echo ===================== Configuring Hadoop ===========================
echo ====================================================================
sed -i "55 i export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64" /home/$user/hadoop/etc/hadoop/hadoop-env.sh

##configure core-site.xml
sed -i "/<configuration>/a \
    <property> \
    <name>fs.defaultFS</name> \
    <value>hdfs://172.17.0.1:9000</value> \
    </property>" \
    /home/$user/hadoop/etc/hadoop/core-site.xml

##configure hdfs-site.xml
sed -i "/<configuration>/a \
    <property> \
        <name>dfs.namenode.name.dir</name> \
        <value>/home/$user/hadoop/dfs/name</value> \
    </property> \
    <property> \
        <name>dfs.datanode.data.dir</name> \
        <value>/home/$user/hadoop/dfs/data</value> \
    </property> \
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
export PDSH_RCMD_TYPE=ssh
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
git clone https://github.com/mata-elang-stable/spark-asset.git /home/$user/spark
mv /home/$user/spark/.env.example /home/$user/spark/.env

sed -i "s/.*HADOOP_USER_NAME*/HADOOP_USER_NAME=$user/" /home/$user/spark/.env
sed -i "s/.*SPARK_EVENTLOG_DIR*/SPARK_EVENTLOG_DIR=hdfs://172.17.0.1:9000/user/ubuntu/spark/spark-events/" /home/$user/spark/.env
sed -i "s/.*SPARK_APP_JAR_PATH*/SPARK_APP_JAR_PATH=hdfs://172.17.0.1:9000/user/ubuntu/kaspacore/files/kaspacore.jar/" /home/$user/spark/.env
sed -i "s/.*SPARK_HISTORY_OPTS*/SPARK_HISTORY_OPTS="-Dspark.history.fs.logDirectory=hdfs://172.17.0.1:9000/user/$user/spark/spark-events"/" /home/$user/spark/.env

hdfs dfs -mkdir -p hdfs://localhost:9000/user/$user/spark/spark-events

mv /home/$user/spark/conf/app.properties.example /home/$user/spark/conf/app.properties

sed -i "s/.*SPARK_CHECKPOINT_PATH*/SPARK_CHECKPOINT_PATH=hdfs://172.17.0.1:9000/user/$user/kafka-checkpoint/" /home/$user/spark/conf/app.properties
sed -i "s/.*TIMEZONE*/TIMEZONE=Asia/Jakarta/" /home/$user/spark/conf/app.properties

sed -i "s/.*KAFKA_BOOTSTRAP_SERVERS*/KAFKA_BOOTSTRAP_SERVERS=$vm1kafkaipAddress:9093/" /home/$user/spark/conf/app.properties
sed -i "s/.*MAXMIND_DB_PATH*/MAXMIND_DB_PATH=hdfs://172.17.0.1:9000/user/$user/kaspacore/files/GeoLite2-City.mmdb/" /home/$user/spark/conf/app.properties

mv /home/$user/spark/conf/spark-defaults.conf.example /home/$user/spark/conf/spark-defaults.conf

sudo docker-compose -f /home/$user/spark/docker-compose.yaml up -d
SHELL
end
