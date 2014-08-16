/* global $ */
const DOWNVOTE = 1;
const HIDE = 2;


// Unwanted subreddit configuration (subrredit : flags).
const UNWANTED = {
    'trees': DOWNVOTE | HIDE,
    'GlobalOffensive': DOWNVOTE
};


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


function getLinkFlags($link) {
    var sub = getSubreddit($link);
    return UNWANTED[sub];
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


function workOnLinks($links) {
    var flags,
        delay,
        $link;

    $links.forEach(function(link, index) {
        $link = $(link);
        flags = getLinkFlags($link);
        // Ignore non-configured subreddits.
        if(!flags) {
            return;
        }

        delay = (index * 123) % 100;

        if(flags & DOWNVOTE) {
            downvoteLink(link, delay);
        }

        if(flags & HIDE) {
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
    workOnLinks($links);
}


// Content script startup.
$(init);
