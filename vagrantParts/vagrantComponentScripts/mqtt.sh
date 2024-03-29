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