echo ====================================================================
echo ==================== Starting MQTT Installation ====================
echo ====================================================================

echo ====================================================================
echo =========================== Cloning MQTT ===========================
echo ====================================================================
git clone https://github.com/mata-elang-stable/mosquitto-asset.git ~/mosquitto

mv ~/mosquitto/mosquitto.conf.example ~/mosquitto/mosquitto.conf
cd ~/mosquitto &&\

echo ====================================================================
echo =========================== Running MQTT ===========================
echo ====================================================================
sudo su
sudo docker run --rm -e USERNAME=vagrant -e PASSWORD=vagrant\
--entrypoint /bin/sh eclipse-mosquitto:2.0.15\
-c '/usr/bin/mosquitto_passwd -c -b password_file $USERNAME $PASSWORD && cat password_file' |\
tee mosquitto_passwd &&\
cd ~

sudo docker-compose -f ~/mosquitto/docker-compose.yaml up -d   

echo ====================================================================
echo ===================== MQTT instalation success =====================
echo ====================================================================