var volonteers = {
    "1": {
        id: "1",
        first_name: "Faustyna",
        last_name: "Kowalska",
        email: "faustyna@kowalska.pl",
        password: "faustyna",
        city: "Łagiewniki",
        profile_picture: ""
    },
    "2": {
        id: "2",
        first_name: "Karol",
        last_name: "Wojtyła",
        email: "karol@wojtyla.pl",
        password: "karol",
        city: "Wadowice",
        profile_picture: ""
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
