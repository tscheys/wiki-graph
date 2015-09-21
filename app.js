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
          content = data.parse.text['*'];
          // console.log(data.parse.text['*']);
          $('#content').append('<p>' + data.parse.title + '</p>');
          var html = $.parseHTML(data.parse.text['*']);
          $('#content').append(html);
          // var box = $(content).query('.infobox vcard').text();
          // console.log(box);
          

      },
      error: function (errorMessage) {
      }
  });
});