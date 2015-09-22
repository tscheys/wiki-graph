$(function() {
  // data 
  // search functionality
  var monarchs = [];
  $('#search').on('click', function(e) {
    var query = $("#monarch").val();
    searchBox(query);
  });
  // ajax request
  var requests = 0;
  var getWikiBox = function(monarch) {
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + monarch + "&redirects&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            // add html to page (invisible via css)
            $('#content').empty();
            var html = $.parseHTML(data.parse.text['*']);
            $('#content').append(html);
            console.log(data.parse.text['*']);
            // query infobox
            var infobox = $('#content .infobox');
            // var mainText = $();

            var successor = infobox.find('th:contains("Successor")').next().first();
            var reignDate = infobox.find('th:contains("Reign")').next().first();
            var reignYear = reignDate.text();
            // var funFact = 
            var url = successor.find('a').attr('href');
            url = url.split('/')[2];
            link = 'http://en.wikipedia.org/wiki/' + url;
            console.log(link);
            monarchs.push({
              name: data.parse.title,
              successor: successor.text(),
              reign: reignYear,
              url: link
            });

            makeVisual(monarchs);
            if(requests < 5) {
              getWikiBox(url);
            }
            else {
              requests = 0;
              makeVisual(monarchs);
              monarchs = [];
            }
            requests++;
        },
        error: function (errorMessage) {
        }
    });
  };
  var searchBox = function(query) {
    $(document).ready(function(){
        $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=opensearch&search="+ query +"&limit=1&namespace=0&format=json&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                var wasFound = Boolean(data[1].length !== 0);
                if(wasFound) {
                  var arr = data[3][0].split('/');
                  var string = arr[arr.length - 1];
                  getWikiBox(string);
                } 
                else {
                  $('#display').append('<h3>Sorry, no monarch found for that name.</h3>');
                } 
            },
            error: function (errorMessage) {
              console.log(errorMessage);
            }
        });
    });
  };
});

var makeVisual = function(monarchs) {
  var field = d3.select('#visual');
  field.selectAll('.person')
  .data(monarchs)
  .enter().append('div')
  .attr('class', 'panel panel-default person')

  .html(function(d) {
    return '<div class="panel-heading"><a href='+ d.url +'>'+ d.name+'</a></div><div class="panel-body"><strong><p>Reign</strong>: ' + d.reign + ' ' + '</p></div>';
  });
};

