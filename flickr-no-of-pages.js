// ==UserScript==
// @name        Flickr - Number of pages in a thread
// @namespace   flickr_
// @description This user script is simply displaying the number of pages in a thread on the main page of the group
// @include     http*://*flickr.com/groups/*
// @version     1
// @grant       none
// @run-at      document-start
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// ==/UserScript==


var api_key = 'fe753c0dd6068fb6c74cb70458b1b9a0';
var POSTS_PER_PAGE = 100;


function call_flickr(method, params, callback) {
    'use strict';
    var url = "https://api.flickr.com/services/rest?";
    params.api_key = api_key;
    params.format = 'json';
    params.nojsoncallback = 1;
    params.method = method;
    $.get(url, params, function (data) {
        callback(JSON.parse(data));
    });
}


function number_of_pages(data) {
    'use strict';
    var url = '/groups/' + data.topics.path_alias + '/discuss/';
    data.topics.topic.forEach(function (topic) {
        var pages_number = Math.ceil(topic.count_replies / POSTS_PER_PAGE);
        var link = url + topic.id + '/';
        var last_link = link + 'page' + pages_number;
        var current_element = $('a[href=' + link + ']');
        if (pages_number > 1) {
            current_element.after(' <a style="font-size:12px; color:#aaa;" href="' +
                    last_link + '">' + pages_number + '</a>');
        }
    });
}


function threads_list(data) {
    'use strict';
    var group_id = data.group.id;
    var params = {};
    params.group_id = group_id;
    call_flickr('flickr.groups.discuss.topics.getList', params, number_of_pages);
}


function main() {
    'use strict';
    var params = {};
    params.url = document.URL;
    call_flickr('flickr.urls.lookupGroup', params, threads_list);
}


main();
