var volonteers = {
    "1": {
        id: "1",
        first_name: "Faustyna",
        last_name: "Kowalska",
        email: "faustyna@kowalska.pl",
        password: "faustyna",
        city: "Łagiewniki",
        profile_picture: "http://i.picresize.com/images/2015/05/25/2VNu8.jpg",
        background_picture: "http://www.solvaypark.pl/_img/solvaypark/galeria/tereny/1.jpg"
    },
    "2": {
        id: "2",
        first_name: "Karol",
        last_name: "Wojtyła",
        email: "karol@wojtyla.pl",
        password: "karol",
        city: "Wadowice",
        profile_picture: "http://i.picresize.com/images/2015/05/25/Fj0AB.jpg",
        background_picture: "http://www.fakt.pl/m/crop/-658/-500/faktonline/635660778242473315.jpg",
        interests: 'piłka nożna i sporty zespołowe. Uwielbiam wycieczki po górach i jajecznicę w schronisku po całym dniu wspinaczki.',
        departments: 'organizację spotkań wolontariuszy i pomagać tworzyć atmosferę braterstwa i wspólnej sprawy jaką są Światowe Dni Młodzieży w Krakowie.',
        my_dream: 'aby wszyscy ludzie byli braćmi.'

    }
}

module.exports = {
    name: 'volonteer',
    // at least one of the CRUD methods is required
    read: function(req, resource, params, config, callback) {
        var volonteer
        if(params.id) {
            volonteer = volonteers[params.id]
        } else if(params.email) {
            id = Object.keys(volonteers).filter(function(id) {
                el = volonteers[id]
                return el.email === params.email
            })[0]
            volonteer = volonteers[id]
        }

        if(volonteer) {
            callback(null, JSON.parse(JSON.stringify(volonteer)));
        } else {
            callback("404")
        }
    },

    create: function(req, resource, params, body, config, callback) {
        volonteers.push({
            id: params.id,
            threadID: params.threadID,
            threadName: params.threadName,
            authorName: params.authorName,
            text: params.text,
            timestamp: params.timestamp
        });
        callback(null, _messages);
    }

    // update: function(resource, params, body, config, callback) {},
    // delete: function(resource, params, config, callback) {}

};
