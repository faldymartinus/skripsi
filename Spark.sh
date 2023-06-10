git clone https://github.com/mata-elang-stable/spark-asset.git ~/spark
mv ~/spark/.env.example ~/spark/.env

cat << 'EOF' > ~/spark/.env
HADOOP_USER_NAME=vagrant
SPARK_EVENTLOG_DIR=hdfs://172.17.0.1:9000/user/vagrant/spark/spark-events
SPARK_APP_JAR_PATH=hdfs://172.17.0.1:9000/user/vagrant/kaspacore/files/kaspacore.jar
SPARK_HISTORY_OPTS="-Dspark.history.fs.logDirectory=hdfs://172.17.0.1:9000/user/ubuntu/spark/spark-events"
EOF

# hdfs dfs -mkdir -p hdfs://localhost:9000/user/vagrant/spark/spark-events
mv ~/spark/conf/app.properties.example ~/spark/conf/app.properties


cat << 'EOF' > ~/spark/conf/app.properties
SPARK_MASTER=spark://spark-master:7077
SPARK_CHECKPOINT_PATH=hdfs://172.17.0.1:9000/user/vagrant/kafka-checkpoint
TIMEZONE=UTC

KAFKA_BOOTSTRAP_SERVERS=172.17.0.1:9093
KAFKA_INPUT_STARTING_OFFSETS=latest

SENSOR_STREAM_INPUT_TOPIC=sensor_events
SENSOR_STREAM_OUTPUT_TOPIC=sensor_events_with_geoip

MAXMIND_DB_PATH=hdfs://172.17.0.1:9000/user/vagrant/kaspacore/files/GeoLite2-City.mmdb
MAXMIND_DB_FILENAME=GeoLite2-City.mmdb
EOF

mv ~/spark/conf/log4j2.properties.example ~/spark/conf/log4j2.properties

cat << 'EOF' > ~/spark/conf/log4j2.properties
log4j.rootLogger=ERROR, console

# set the log level for these components
log4j.logger.com.test=DEBUG
log4j.logger.org=ERROR
log4j.logger.org.apache.spark=ERROR
log4j.logger.org.spark-project=ERROR
log4j.logger.org.apache.hadoop=ERROR
log4j.logger.io.netty=ERROR
log4j.logger.org.apache.zookeeper=ERROR

# add a ConsoleAppender to the logger stdout to write to the console
log4j.appender.console=org.apache.log4j.ConsoleAppender
log4j.appender.console.layout=org.apache.log4j.PatternLayout
# use a simple message format
log4j.appender.console.layout.ConversionPattern=%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n
EOF

sudo docker-compose -f ~/spark/docker-compose.yaml up -d