var helpers = function () {};

helpers.register = function (Handlebars) {
    Handlebars.registerHelper('convertRiskCode', function(value) {
        return value !== "0" ? "Failed" : "Inconclusive";
    });
};

module.exports = helpers;