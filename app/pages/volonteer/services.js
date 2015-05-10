var volonteers = {
    1: {
        name: "foo"
    },
    2: {
        name: "bar"
    }
}

module.exports = {
    name: 'volonteer',
    // at least one of the CRUD methods is required
    read: function(req, resource, params, config, callback) {
        var volonteer = volonteers[params.id]
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
