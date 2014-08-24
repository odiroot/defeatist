/* global $ */
'use strict';


function isLoggedIn() {
    return $('.user').find('.userkarma').length !== 0;
}


function findLinks() {
    var $links = $('.thing.link').not(function() {
        // Filter out invisible links.
        var style = $(this).attr('style');

        return (
            style === 'display: none;' ||
            style === 'display:none'
        );
    });

    return $links;
}


function getSubreddit($link) {
    var subText = $link.find('.subreddit').text();

    if(!!subText) {
        return subText.replace('/r/', '');
    }

    return '';
}


function downvoteLink(link, delay) {
    var $link = $(link),
        $arrow = $link.find('.arrow.down');

    setTimeout(function() {
        $arrow.click();
    }, delay);
}


function hideLink(link, delay) {
    var $link = $(link),
        $hide = $link.find('.hide-button span a');

    setTimeout(function() {
        $hide.click();
    }, delay);
}


function workOnLinks(subreddits, $links) {
    var name,
        config,
        delay,
        $link;

    $links.forEach(function(link, index) {
        $link = $(link);
        name = getSubreddit($link);
        config = subreddits[name];

        // Ignore non-configured subreddits.
        if(!config) {
            return;
        }

        delay = (index * 123) % 100;

        if(config.downvote) {
            downvoteLink(link, delay);
        }
        if(config.hide) {
            hideLink(link, delay + 32);
        }
    });
}


function init() {
    if(!isLoggedIn()) {
        console.info('Defeatist: Not logged in, no work for me.');
        return;
    }

    var $links = findLinks();

    // Load subreddit config and work!
    chrome.storage.sync.get('subreddits', function(items) {
        if(!items.subreddits) {
            return;  // Nothing to do.
        }
        workOnLinks(items.subreddits, $links);
    });
}


// Content script startup.
$(init);
