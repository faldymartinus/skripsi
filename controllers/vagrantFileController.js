const fs = require('fs'); 

//////////////////////////////////////
////// Vagrant Related Functions/////
////////////////////////////////////
async function constructVagrantFile(){
    await constructVagrantHead()
    await sleep(100);
    await constructSplitter()
    await sleep(100);
    await constructVagrantIpAddress()
    await sleep(100);
    await constructVagrantProvision1()
    await sleep(100);
    await constructVagrantProvision2()
    await sleep(100);
    await construcVMDefine()
    await sleep(100);
    await constructVagrantFileCombine()
    await sleep(100);
    await constructVagrantTail()
    await sleep(100);
    await constructCleanUp()


}
function constructVagrantHead(){
    //append vagrantHeadtemplate
    var data = fs.readFileSync('./vagrantParts/vagrantHeadTemplate.sh');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}
function constructSplitter(){
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);

    Object.keys(dataParsed).forEach( vmId => {   
        var dataSplitter = fs.readFileSync('./vagrantParts/vagrantSplitter.sh');
        fs.appendFile('Vagrantfile'+vmId, 
        'config.vm.define "'+vmId+'" do |config|'+
        'config.vm.box = "ubuntu/focal64"'
       +"\n",
            function (err) {
                if (err) throw err;
            });  
    });
    
}
function constructVagrantIpAddress(){
    var data = fs.readFileSync('vmSpecification.json');
    var dataParsed= JSON.parse(data);
   

    //get all vmId
    Object.keys(dataParsed).forEach( vmId => {   
        var privatenetwork = dataParsed[`${vmId}`].privateNetwork
        var publicNetwork = dataParsed[`${vmId}`].publicNetwork
        var RAM = dataParsed[`${vmId}`].RAM
        var CPU = dataParsed[`${vmId}`].CPU

        fs.appendFile('Vagrantfile'+vmId, 
            'config.vm.network "private_network", ip: "'+privatenetwork+'"\n'+
                'config.vm.network "public_network", ip: "'+publicNetwork+'"\n'+
            'config.vm.provider "virtualbox" do |vb|'+'\n'+
                'vb.memory = "'+RAM+'"\n'+
                'vb.cpus = '+CPU+'\n'+
            'end'+'\n'  ,

    
        function (err) {
            if (err) throw err;
        });    
             
    });
}
function constructVagrantProvision1(){
    //append vagrantProvisionTemplate
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    //get all vmId
    Object.keys(dataParsed).forEach( vmId => {   

        var dataVariables = fs.readFileSync('./variables');
        var dataPrerequisite = fs.readFileSync('./vagrantParts/vagrantComponentScripts/prerequisite.sh');

        fs.appendFile('Vagrantfile'+vmId, 
            'config.vm.provision "shell",privileged: false, inline: <<-SHELL'+"\n"+
            dataVariables+"\n"+
            "export user='vagrant'"+"\n"+
            dataPrerequisite,
        function (err) {
            if (err) throw err;
        });    
    });
}

function constructVagrantProvision2(){
    //append vagrantProvisionTemplate
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    //get all vmId
    Object.keys(dataParsed).forEach( vmId => {   
        Object.keys(dataParsed[`${vmId}`]).forEach( component => { 
            var data = fs.readFileSync(`./vagrantParts/vagrantComponentScripts/${component}.sh`);
            fs.appendFile('Vagrantfile'+vmId, data+"\n", function (err) {
                if (err) throw err;                  
            });
        });        
    });
}

function construcVMDefine(){
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);

    //get all vmId
    Object.keys(dataParsed).forEach( vmId => {   
        fs.appendFile('Vagrantfile'+vmId, 'SHELL' + "\n" + "end" + "\n", function (err) {
            if (err) throw err;
        }); 
    })
}

function constructVagrantFileCombine(){
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    //get all vmId
    Object.keys(dataParsed).forEach( vmId => {   
        var dataVmDefine = fs.readFileSync('./Vagrantfile'+vmId);
        fs.appendFile('Vagrantfile', dataVmDefine, function (err) {
            if (err) throw err;
        }); 
    })
}

function constructVagrantTail(){
    //append vagrantTailTemplate
    var data = fs.readFileSync('./vagrantParts/vagrantTailTemplate.sh');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function constructCleanUp(){
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    //get all vmId
    const variablesConstruct = './variables';
    try {
        fs.unlinkSync(variablesConstruct);
        console.log("File removed:", variablesConstruct);
        } catch (err) {
        console.error(err);
        }
    fs.copyFile('./Vagrantfile', './result/Vagrantfile', (err) => {
        if (err) throw err;
        console.log('source.txt was copied to destination.txt');
        });
    const vagrantfileDelete = './Vagrantfile';
    try {
        fs.unlinkSync(vagrantfileDelete);
        console.log("File removed:", vagrantfileDelete);
        } catch (err) {
        console.error(err);
        }
    Object.keys(dataParsed).forEach( vmId => {    
    const vmDefineConstruct = './Vagrantfile'+vmId;
    
        try {
        fs.unlinkSync(vmDefineConstruct);
        console.log("File removed:", vmDefineConstruct);
        } catch (err) {
        console.error(err);
        }

        
    })
}
const generateVagrantFile = (req,res)=>{
    //bikin file variabel.sh
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);

    //get all vmId
    Object.keys(dataParsed).forEach(vmId => {    
        // console.log('vm:'+vmId)

        //get all component that need to be installed
        Object.keys(dataParsed[`${vmId}`]).forEach(component => { 
            //get attribute of each component
            Object.keys(dataParsed[`${vmId}`][`${component}`]).forEach(key => {   
                //get value of each attribute
                var value = dataParsed[`${vmId}`][`${component}`][`${key}`]
                //combine all needed attribute into string
                var variable = "export "+component+key +"="+ "'" +value+"'"
                //append each variables to file
                fs.appendFile('variables', variable+"\n", function (err) {
                    if (err) throw err;
                });
            })
        })
    })

    //constructing vagrantfile from parts
    constructVagrantFile()
    const file = "./result/Vagrantfile" ;
    res.download(file)

}

module.exports =  {
    generateVagrantFile
};
