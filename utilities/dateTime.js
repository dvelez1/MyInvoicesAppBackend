function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    console.log("Día", today)
    return today = mm + '/' + dd + '/' + yyyy;

    

};

module.exports.getCurrentDate = getCurrentDate;