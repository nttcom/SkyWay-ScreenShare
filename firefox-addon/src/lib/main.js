var pageMod = require('sdk/page-mod');
var self = require('sdk/self');
var __temp = require('chrome');
var Cc = __temp.Cc;
var Ci = __temp.Ci;

var domains_to_add = [''];
var addon_domains = [];
var allowed_domains_pref = 'media.getusermedia.screensharing.allowed_domains';
var enable_screensharing_pref = 'media.getusermedia.screensharing.enabled';

exports.main = function (options, callbacks) {
    pageMod.PageMod({
        contentScriptWhen: 'start',
        include: domains_to_add,
        contentScriptFile: self.data.url('content-script.js')
    });

    var prefs = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefBranch);
    var values = prefs.getCharPref(allowed_domains_pref).split(',');

    domains_to_add.forEach(function(domain) {
        if (values.indexOf(domain) === -1) {
            values.push(domain);
            addon_domains.push(domain);
        }
    });

    if(prefs.getBoolPref(enable_screensharing_pref) == false) {
        prefs.setBoolPref(enable_screensharing_pref, 1);
    }

    prefs.setCharPref(allowed_domains_pref, values.join(','));

};

exports.onUnload = function (reason) {

    var prefs = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefBranch);
    var values = prefs.getCharPref(allowed_domains_pref).split(',');

    domains_to_add.forEach(function(domain) {
        if (values.indexOf(domain) !== -1) {
            values.splice(values.indexOf(domain),1);
        }
    });

    if(prefs.getBoolPref(enable_screensharing_pref) == true) {
        prefs.setBoolPref(enable_screensharing_pref, 0);
    }

    prefs.setCharPref(allowed_domains_pref, values.join(','));

};