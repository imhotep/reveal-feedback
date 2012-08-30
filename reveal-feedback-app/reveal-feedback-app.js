
var host = "http://ec2-184-72-173-33.compute-1.amazonaws.com/keynote";

$(document).ready(function() {
    $(".button").click(function() {
        onLikeClick();
    })
});

//function testCreate() {
//    var slide = {
//        liked: 0,
//        title: 'Slide Test ' + Math.floor(Math.random()*11)
//    };
//
//    $.ajax({
//      url: host,
//      type: 'POST',
//      contentType: 'application/json',
//      data: JSON.stringify(slide),
//      dataType: 'json',
//      success: function(result) {
//          // create new slide
//          console.log('Slide added!', result);
//          var slideId = result.id;
//          // get current slide document
//          $.ajax({
//            url: host + '/current',
//            dataType: 'json',
//            success: function(current) {
//                // update current slide document
//                current.slide_id = slideId;
//                $.ajax({
//                  url: host + '/current',
//                  type: 'PUT',
//                  contentType: 'application/json',
//                  data: JSON.stringify(current),
//                  success: function(result) {
//                      console.log('Current slide updated to '+slideId);
//                      console.log(JSON.stringify(result));
//                  },
//                  error: function(e) {
//                      alert('error ' + JSON.stringify(e));
//                  }
//                });
//            },
//            error: function() { 
//                alert('error');
//            }
//          });
//      },
//      error: function(e) {
//          alert('error ' + JSON.stringify(e));
//      }
//    });
//};

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
          alert('error ' + JSON.stringify(e));
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
          alert('error');
      }
    });
}

function onLikeClick() {
//    testCreate();
    $.ajax({
      url: host + '/current',
      dataType: 'json',
      success: function(current) {
          console.log("Current slide ID is: "+current.slide_id);
          getSlide(current.slide_id);
      },
      error: function() { 
          alert('error');
      }
    });
}
