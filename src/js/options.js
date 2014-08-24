/* global $ */
'use strict';
var STORAGE = chrome.storage.sync;


function readSubreddits(callback) {
    STORAGE.get('subreddits', function(items) {
        callback(items.subreddits);
    });
}


function writeSubreddits(subreddits) {
    STORAGE.set({
        'subreddits': subreddits
    });
}


function ConfigTable(config, callback) {
    this.config = config;
    this.callback = callback;

    this.$table = $('table');
    this.$tbody = this.$table.find('tbody');
    this.template = $('#tableRow').text();
}

ConfigTable.prototype.render = function render() {
    this.clearTable();
    this.fillTable();
};

ConfigTable.prototype.clearTable = function clearTable() {
    this.$tbody.empty();
};

ConfigTable.prototype.fillTable = function fillTable() {
    for(var sub in this.config) {
        this.renderRow(sub, this.config[sub]);
    }
};

ConfigTable.prototype.renderRow = function renderRow(name, config) {
    var $row = $(this.template);

    // Fill rendered HTML with subreddit config.
    $row.find('.name').text(name);
    $row.find('.hide')[0].checked = config.hide || false;
    $row.find('.downvote')[0].checked = config.downvote || false;

    this.$tbody.append($row);
};


function main() {
    var table;

    readSubreddits(function(subs) {
        table = new ConfigTable(subs, writeSubreddits);
        table.render();
    });
}


/* Startup */
$(main);
