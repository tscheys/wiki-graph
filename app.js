$(function() {
  // data 
  var content;
  // search functionality
  $('#search').on('click', function(e) {
    var query = $("#monarch").val();
    console.log('monarch: ' + query);
  });
  // ajax request
  $.ajax({
      type: "GET",
      url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Charles_V,_Holy_Roman_Emperor&callback=?",
      contentType: "application/json; charset=utf-8",
      async: false,
      dataType: "json",
      success: function (data, textStatus, jqXHR) {
          // check original page
          console.log(data.parse.text['*']);
          // add html to page (invisible via css)
          var html = $.parseHTML(data.parse.text['*']);
          $('#content').append(html);
          // query infobox
          var infobox = $('#content .infobox');
          // get main character information
          $('#display').append('<p><strong>Main guy</strong>: ' + data.parse.title + '</p>');
          // get successor information
          var successor = infobox.find('th:contains("Successor")').next();
          var successor = successor.first();
          successor.prepend('<strong>That guy\'s successor</strong>: ');
          $('#display').append(successor);
          // get successors url info 
          var url = successor.find('a').attr('href');
          url = url.split('/')[2];
          console.log(url);
          

      },
      error: function (errorMessage) {
      }
  });
});