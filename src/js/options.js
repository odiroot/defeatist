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

ConfigTable.prototype.update = function() {
    this.callback(this.config);
    this.render();
};

ConfigTable.prototype.clearTable = function clearTable() {
    this.$tbody.empty();
};

ConfigTable.prototype.fillTable = function fillTable() {
    var $row,
        sub;

    for(sub in this.config) {
        $row = this.renderRow(sub, this.config[sub]);
        // Attach event handlers.
        this.listenRow($row, sub);
    }
};

ConfigTable.prototype.renderRow = function renderRow(name, config) {
    var $row = $(this.template);

    // Fill rendered HTML with subreddit config.
    $row.find('.name').text(name);
    $row.find('.hide')[0].checked = config.hide || false;
    $row.find('.downvote')[0].checked = config.downvote || false;

    this.$tbody.append($row);
    return $row;
};

ConfigTable.prototype.listenRow = function listenRow($row, name) {
    $row.on('click', '.remove', this.removeSub.bind(this, name));
    $row.on('click', '.hide', this.updateHide.bind(this, name));
    $row.on('click', '.downvote', this.updateDownvote.bind(this, name));
};

ConfigTable.prototype.removeSub = function(name) {
    delete this.config[name];
    this.update();
};

ConfigTable.prototype.addSub = function addSub(name) {
    this.config[name] = {};
    this.update();
};

ConfigTable.prototype.updateHide = function updateHide(name, event) {
    this.config[name].hide = event.target.checked;
    this.update();
};

ConfigTable.prototype.updateDownvote = function updateDownvote(name, event) {
    this.config[name].downvote = event.target.checked;
    this.update();
};


function main() {
    var table;

    readSubreddits(function(subs) {
        table = new ConfigTable(subs, writeSubreddits);
        table.render();
    });

    // Handling add subreddit form.
    var $input = $('.add input');
    function add() {
        var name = $input.val().trim();
        if(!name) {
            return;
        }
        table.addSub(name);
        $input.val('');
    }
    $('.add button').click(add);
    $input.keyup(function(event){
        if(event.keyCode === 13)
        {
            add();
        }
    });
}


/* Startup */
$(main);
