module.exports = {
    makeid
}

function makeid(length: number): string {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return '000000';
}