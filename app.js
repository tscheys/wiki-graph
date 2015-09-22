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
            console.log(data.parse.text['*']);
            // query infobox
            var infobox = $('#content .infobox');
            // get main character information
            $('#display').append('<strong>Main guy</strong>: ' + data.parse.title);
            // get successor information
            var successor = infobox.find('th:contains("Successor")').next().first();
            monarchs.push({
              name: data.parse.title,
              successor: successor.text()
            });
            successor.prepend('<strong>That guy\'s successor</strong>: ');
            $('#display').append(successor);
            // get successors url info 
            var url = successor.find('a').attr('href');
            url = url.split('/')[2];
            // push this monarchs information into the monarchs array
            // make recursive ajax call three levels down
            makeVisual(monarchs);
            if(requests < 3) {
              getWikiBox(url);
            }
            else {
              console.log(monarchs);
              requests = 0;
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
                console.log(data);
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
  .text(function(d) {
    return d.name;
  });
};

