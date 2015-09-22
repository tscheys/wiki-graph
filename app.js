$(function() {
  // data 
  // search functionality
  var monarchs = [];
  $('#search').on('click', function(e) {
    e.preventDefault();
    console.log('test');
    var query = $("#monarch").val();
    searchBox(query);
  });
  // ajax request
  var requests = 0;
  var getWikiBox = function(monarch) {
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=" + monarch + "&redirects&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            // add html to page (invisible via css)
            $('#content').empty();
            var html = $.parseHTML(data.parse.text['*']);
            $('#content').append(html);
            // console.log(data.parse.text['*']);
            // query infobox
            var infobox = $('#content .infobox');
            var randomNumber = Math.floor(Math.random() * 3);
            var main = $('#content').find('span.mw-headline:eq('+ randomNumber +')').parent().nextAll('p').first().text();
            var funFact = main.split('.')[0];
            

            var successor = infobox.find('th:contains("Successor")').next().first();
            var reignDate = infobox.find('th:contains("Reign")').next().first();
            var reignYear = reignDate.text();
            // var funFact = 
            var url = successor.find('a').attr('href');
            url = url.split('/')[2];
            var link = 'http://en.wikipedia.org/wiki/' + monarch;
            monarchs.push({
              name: data.parse.title,
              successor: successor.text(),
              reign: reignYear,
              url: link,
              funFact: funFact
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
    return '<div class="panel-heading"><a href='+ d.url +'>'+ d.name+'</a></div> \
    <div class="panel-body"> \
    <p><strong>Reign: </strong>: ' + d.reign + '</p> \
    <p><strong>Fun fact: </strong>: ' + d.funFact + '</p> \
    </div>';
  });
};

