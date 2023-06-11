Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/focal64"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.provider "virtualbox" do |vb|
        vb.memory = "2048"
        vb.cpus = 2
    end 
config.vm.provision "shell", inline: <<-SHELL
export vmmqttusername='142'
export vmmqttpassword='asff'
export vmsparkipAddress='1242'
export vmopenSearchipAddress='1251251'
export vmhadoopipAddress='124'
export vmhadoopuserHadoop='fasijIO@gmail.com'
export vmopenSearchuser='allFather'
export vmopenSearchpassword='sleipnir0d1ns0n'

echo spark
echo mqtt
echo hadoop
echo openSearch
SHELL
end
