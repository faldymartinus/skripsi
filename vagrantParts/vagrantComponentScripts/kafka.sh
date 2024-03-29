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