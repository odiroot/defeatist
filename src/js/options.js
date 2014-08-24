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


function renderRow(name, config) {
    var template = $('#tableRow').text(),
        $row = $(template);

    // Fill rendered HTML with subreddit config.
    $row.find('.name').text(name);
    $row.find('.hide')[0].checked = config.hide || false;
    $row.find('.downvote')[0].checked = config.downvote || false;

    $('table tbody').append($row);
}


function clearTable() {
    $('table tbody tr').remove();
}


function fillTable(subs) {
    for(var sub in subs) {
        renderRow(sub, subs[sub]);
    }
}


function main() {
    readSubreddits(function(subs) {
        clearTable();
        fillTable(subs);
    });
}


/* Startup */
$(main);
