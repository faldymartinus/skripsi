const mainView = (req, res) => {
    res.render("main", {
    } );
}

const configView = (req, res) => {
    res.render("configuration", {
    } );
}

module.exports =  {
    mainView,
    configView
};
