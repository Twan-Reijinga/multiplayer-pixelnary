module.exports = {
    makeid,
};

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return '000000';
}
