
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