$(function() {
  // data 
  // search functionality
  var monarchs = [];
  $('#search').on('click', function(e) {
    e.preventDefault();
    console.log('test');
    var query = $("#monarch").val();
    var select = $('select').val();
    $('#visual').empty();
    searchBox(query, select);
  });

  $('.disambiguation').on('click', function(e) {
    console.log('jooojojoj');
    e.preventDefault();
    var url = this.attr('href');
    var select = $('select').val();
    var page = url.split('/')[url.length - 1];
    console.log(page, select);
    getWikiBox(page, select);
  });
  // ajax request
  var requests = 0;
  var getWikiBox = function(monarch, type) {
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=" + monarch + "&redirects&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            // are we on a disambigation page 

            // add html to page (invisible via css)
            $('#content').empty();
            var html = $.parseHTML(data.parse.text['*']);
            $('#content').append(html);
            // console.log(data.parse.text['*']);

            var disambigation = $('#content').find('p:contains("may refer to:")').nextAll('ul').first();
            if(disambigation.length > 0) {

              $('#visual').append("<h2>There are bunch of guys with that name, select one:");
              disambigation = disambigation.children();
              console.log(disambigation);
              $(disambigation).each(function(index, element) {
                element = $(element).children();
                console.log(element);
                $(element).attr('class', 'disambiguation');
                $(element).attr('href', '#');
              });
              $('#visual').append(disambigation);
            } 
            else {
              // query infobox
              var infobox = $('#content .infobox');
              var randomNumber = Math.floor(Math.random() * 3);
              // GENERAL
              var main = $('#content').find('span.mw-headline:eq('+ randomNumber +')').parent().nextAll('p').first().text();
              var funFact = main.split('.')[0];
              
              // SUCCESSOR PREDECESSOR
              var successor;
              var getSuccessor = function (type) {
                successor = infobox.find('th:contains('+ type +')').next().first(); 
              };
              getSuccessor(type);
              var reignDate = infobox.find('th:contains("Reign")').next().first();
              var reignYear = reignDate.text();

              // GENERAL
              var url = successor.find('a').attr('href');
              if(url !== undefined) {
                url = url.split('/')[2] 
              }
              var link = 'http://en.wikipedia.org/wiki/' + monarch;
              monarchs.push({
                name: data.parse.title,
                successor: successor.text(),
                reign: reignYear,
                url: link,
                funFact: funFact
              });

              makeVisual(monarchs);
              if(requests < 5 && url !== undefined) {
                getWikiBox(url, type);
              }
              else {
                requests = 0;
                makeVisual(monarchs);
                monarchs = [];
              }
              requests++;
              
            } 
        },
        error: function (errorMessage) {
        }
    });
  };
  var searchBox = function(query, link) {
    $(document).ready(function(){
        $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=opensearch&search="+ query +"&limit=1&namespace=0&format=json&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log('data from open search: '+ data);
                var wasFound = Boolean(data[1].length !== 0);
                if(wasFound) {
                  var arr = data[data.length - 1][0].split('/');
                  var string = arr[arr.length - 1];
                  console.log('arr ' +arr);
                  console.log(typeof string);
                  getWikiBox(string, link);
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
  .attr('class', 'person')

  .html(function(d) {
    return '<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span> \
            <div class="panel panel-default"> \
              <div class="panel-heading"><a href='+ d.url +'>'+ d.name+'</a></div> \
              <div class="panel-body"> \
                <p><strong>Reign </strong>: ' + d.reign + '</p> \
                <p><strong>Fun fact </strong>: ' + d.funFact + '</p> \
              <div> \
            </div>';
  });
};

