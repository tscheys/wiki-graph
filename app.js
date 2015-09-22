$(function() {
  // data 
  // search functionality
  $('#search').on('click', function(e) {
    var query = $("#monarch").val();
    searchBox(query);
  });
  var monarchs = [];
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
            // console.log(data.parse.text['*']);
            // query infobox
            var infobox = $('#content .infobox');
            // get main character information
            // $('#display').append('<strong>Main guy</strong>: ' + data.parse.title);
            // get successor information
            var successor = infobox.find('th:contains("Successor")').next().first();
            var reignDate = infobox.find('th:contains("Reign")').next().first();
            var reignYear = reignDate.text().split(' ')[2];
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
            // successor.prepend('<strong>That guy\'s successor</strong>: ');
            // $('#display').append(successor);
            // get successors url info 
            // push this monarchs information into the monarchs array
            // make recursive ajax call three levels down
            makeVisual(monarchs);
            if(requests < 5) {
              getWikiBox(url);
            }
            else {
              requests = 0;
              makeVisual(monarchs);
            }
            requests++;
        },
        error: function (errorMessage) {
        }
    });
  };
  var searchBox = function(query) {
    $('#display').empty();
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
  console.log('jooooo');
  var field = d3.select('#visual');
  field.selectAll('.person')
  .data(monarchs)
  .enter().append('div')
  .attr('class', 'panel panel-default person')
<<<<<<< HEAD
  .html(function(d) {
    return d.name + ' ' + d.reign + ' ' + '<a href='+ d.url +'>Link to wikipedia</a>';
=======
  .text(function(d) {
    return d.name;
>>>>>>> d60f4dfcb91973fa575c29831b81669e6d03f1ac
  });
};

