
var host = "http://ec2-184-72-173-33.compute-1.amazonaws.com/keynote";

$(document).ready(function() {
    $(".button").click(function() {
        onLikeClick();
    });
    setInterval(updateCurrentSlide, 1000);
});

function showNotification(msg) {
    $('.message').html(msg);
    $('.message').addClass('show');
    setTimeout(function(){$('.message').removeClass('show');}, 2000);
}

function likeSlide(slide) {
    var newSlide = slide;
    newSlide.liked = slide.liked + 1; 
    console.log(JSON.stringify(newSlide));
    $.ajax({
      url: host + '/' + slide._id,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(newSlide),
      success: function(result) {
          showNotification('You liked "' + newSlide.title + '"');
          console.log(JSON.stringify(result));
      },
      error: function(e) {
          alert('likeSlide: An error occured ' + JSON.stringify(e));
      }
    });
}

function getSlide(slideId) {
    $.ajax({
      url: host + '/' + slideId,
      dataType: 'json',
      success: function(slide) {
          console.log('Current slide is: ' + JSON.stringify(slide));
          likeSlide(slide);
      },
      error: function() { 
          alert('getSlide: An error occured');
      }
    });
}

function onLikeClick() {
    $.ajax({
      url: host + '/current',
      dataType: 'json',
      success: function(current) {
          console.log("Current slide ID is: "+current.slide_id);
          getSlide(current.slide_id);
      },
      error: function() { 
          alert('onLike: An error occured');
      }
    });
}

function updateCurrentSlide() {
    $.ajax({
      url: host + '/current',
      dataType: 'json',
      success: function(current) {
        $.ajax({
          url: host + '/' + current.slide_id,
          dataType: 'json',
          success: function(slide) {
              $('#currentSlide').html(slide.title);
          },
          error: function() { 
              alert('getSlideTile: An error occured');
          }
        });
      },
      error: function() { 
          alert('updateCurrentSlide: An error occured');
      }
    });
}
