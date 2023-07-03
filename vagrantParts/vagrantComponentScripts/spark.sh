echo ====================================================================
echo ==================== Starting Spark Installation ===================
echo ====================================================================
git clone https://github.com/mata-elang-stable/spark-asset.git /home/$user/spark
mv /home/$user/spark/.env.example /home/$user/spark/.env

sed -i "s,HADOOP_USER_NAME.*,HADOOP_USER_NAME=$user,g" /home/$user/spark/.env
sed -i "s,SPARK_EVENTLOG_DIR.*,SPARK_EVENTLOG_DIR=hdfs://$hadoopipAddress:9000/user/$user/spark/spark-events," /home/$user/spark/.env
sed -i "s,SPARK_APP_JAR_PATH.*,SPARK_APP_JAR_PATH=hdfs://$hadoopipAddress:9000/user/$user/kaspacore/files/kaspacore.jar," /home/$user/spark/.env
sed -i "s,SPARK_HISTORY_OPTS.*,SPARK_HISTORY_OPTS="-Dspark.history.fs.logDirectory=hdfs://$hadoopipAddress:9000/user/$user/spark/spark-events"," /home/$user/spark/.env

/home/$user/hadoop/bin/hdfs dfs -mkdir -p hdfs://localhost:9000/user/$user/spark/spark-events

mv /home/$user/spark/conf/app.properties.example /home/$user/spark/conf/app.properties

sed -i "s,.*SPARK_CHECKPOINT_PATH.*,SPARK_CHECKPOINT_PATH=hdfs://$hadoopipAddress:9000/user/$user/kafka-checkpoint," /home/$user/spark/conf/app.properties
sed -i "s,.*TIMEZONE.*,TIMEZONE=Asia/Jakarta," /home/$user/spark/conf/app.properties

sed -i "s,.*KAFKA_BOOTSTRAP_SERVERS.*,KAFKA_BOOTSTRAP_SERVERS=$kafkaipAddress:9093," /home/$user/spark/conf/app.properties
sed -i "s,.*MAXMIND_DB_PATH.*,MAXMIND_DB_PATH=hdfs://$hadoopipAddress:9000/user/$user/kaspacore/files/GeoLite2-City.mmdb," /home/$user/spark/conf/app.properties

mv /home/$user/spark/conf/spark-defaults.conf.example /home/$user/spark/conf/spark-defaults.conf

sudo docker-compose -f /home/$user/spark/docker-compose.yaml up -d

echo ====================================================================
echo ==================== Spark Installation Success  ===================
echo ====================================================================