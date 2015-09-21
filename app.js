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
          content = data;
          console.log(data);
          $('#content').append('<p>data</p>');
      },
      error: function (errorMessage) {
      }
  });
});