$(function() {
  $('#search').on('click', function(e) {
    var query = $("#monarch").val();
    console.log('monarch: ' + query);
  });
});