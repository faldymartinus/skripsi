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