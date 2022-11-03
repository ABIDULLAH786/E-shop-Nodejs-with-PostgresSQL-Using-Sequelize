module.exports.validateEmail = (email) => {
    var reg = /^((?!\.)[\w-.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
    if (!email)
        return false;

    if (email.length > 254)
        return false;

    var valid = reg.test(email);
    if (!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    var domainParts = parts[1].split(".");
    if (domainParts.some(function (part) { return part.length > 63; }))
        return false;

    return true;
};