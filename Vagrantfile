Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/focal64"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 2
    end 
config.vm.provision "shell", inline: <<-SHELL
export user='vagrant'
export vmmqttusername='142'
export vmsparkipAddress='1242'
export vmmqttpassword='asff'
export vmhadoopipAddress='124'
export vmhadoopuserHadoop='fasijIO@gmail.com'
export vmopenSearchipAddress='1251251'
export vmopenSearchuser='allFather'
export vmopenSearchpassword='sleipnir0d1ns0n'

sed 's/nameserver.*/nameserver 8.8.8.8/' /etc/resolv.conf > /etc/resolv.conf.new
mv /etc/resolv.conf.new /etc/resolv.conf
sudo apt update
sudo apt -y install docker.io
sudo apt -y install docker-compose
sudo apt -y install openjdk-11-jdk
sudo echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> /home/$user/.bashrc
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
sudo docker run --rm -e USERNAME=$vmmqttusername -e PASSWORD=$vmmqttpassword\
--entrypoint /bin/sh eclipse-mosquitto:2.0.15\
-c '/usr/bin/mosquitto_passwd -c -b password_file $USERNAME $PASSWORD && cat password_file' |\
tee mosquitto_passwd &&\
cd ~

sudo docker-compose -f /home/$user/mosquitto/docker-compose.yaml up -d   

echo ====================================================================
echo ===================== MQTT instalation success =====================
echo ====================================================================
echo spark
echo openSearch
echo hadoop
SHELL
end
