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
export vm1openSearchuser='allFather'
export vm1openSearchipAddress='172.17.0.54'
export vm1openSearchpassword='sleipnir0d1ns0n'
export vm1sparkipAddress=''
export vm1hadoopuserHadoop='hadoopUser'
export vm1hadoopipAddress='172.17.0.23'

echo ====================================================================
echo ======================== Downloading Hadoop ========================
echo ====================================================================
wget -P /home/$user https://archive.apache.org/dist/hadoop/common/hadoop-3.3.3/hadoop-3.3.3.tar.gz
tar -xzf /home/$user/hadoop-3.3.3.tar.gz -C /home/$user
sudo mv /home/$user/hadoop-3.3.3 /usr/local/hadoop

### Append to the end of the file.
echo 'export HADOOP_HOME=/usr/local/hadoop
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin' >> /home/$user/.bashrc

source /home/$user/.bashrc

echo ====================================================================
echo ===================== Configuring Hadoop ===========================
echo ====================================================================
sed -i "55 i export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64" /usr/local/hadoop/etc/hadoop/hadoop-env.sh

##configure core-site.xml
sed -i "/<configuration>/a \
    <property> \
    <name>fs.defaultFS</name> \
    <value>hdfs://172.17.0.1:9000</value> \
    </property>" \
    /usr/local/hadoop/etc/hadoop/core-site.xml

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
    /usr/local/hadoop/etc/hadoop/hdfs-site.xml

hdfs namenode -format

echo ====================================================================
echo ===================== Starting Hadoop dfs  =========================
echo ====================================================================
start-dfs.sh

echo ====================================================================
echo ================== Creating Hadoop dfs Directory  ==================
echo ====================================================================
hdfs dfs -mkdir -p hdfs://localhost:9000/user/$user/kafka-checkpoint
hdfs dfs -mkdir -p hdfs://localhost:9000/user/$user/kaspacore/files


echo spark
SHELL
end
