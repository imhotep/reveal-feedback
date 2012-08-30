var host = "http://ec2-184-72-173-33.compute-1.amazonaws.com/keynote";

function getTitle(slideElement) {
    var i,
    titleTags = ['h1', 'h2', 'h3', 'h4'],
    title = '';
    for(i = 0, j = titleTags.length ; i < j ; i += 1) {
        if(slideElement.getElementsByTagName(titleTags[i]).length > 0) {
            title += slideElement.getElementsByTagName(titleTags[i])[0].innerHTML;
        }
    }
    return title;
}

function postNewSlide(slide) {

    $.ajax({
      url: host,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(slide),
      dataType: 'json',
      success: function(result) {
          console.log('Slide added!', result);
          var slideId = result.id;
      },
      error: function(e) {
          alert('error ' + JSON.stringify(e));
      }
    });

}

function updateCurrentSlide(slideId) {
    $.ajax({
      url: host + '/current',
      dataType: 'json',
      success: function(current) {
          // update current slide document
          current.slide_id = slideId;
          $.ajax({
            url: host + '/current',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(current),
            success: function(result) {
                console.log('Current slide updated to '+slideId);
                console.log(JSON.stringify(result));
            },
            error: function(e) {
                alert('error ' + JSON.stringify(e));
            }
          });
      },
      error: function() {
          alert('error');
      }
    });
}

function slideExists(indexh, indexv, successCB, errorCB) {
    var key = indexh + '-' + indexv;
    $.ajax({
      url: host + '/_design/keynote/_view/docs_by_indices?key=' + JSON.stringify(key),
      dataType: 'json',
      success: function(r) {
          if(r.rows.length == 1) {
              successCB(true, r.rows[0]);
          } else {
              successCB(false, null);
          }
      },
      error: function() { 
          errorCB();
      }
    });
}

Reveal.addEventListener('slidechanged', function(event) {
    var title = getTitle(event.currentSlide);
    slideExists(event.indexh, event.indexv, function(exists, slide) {
        if(exists == true && slide != null) {
             updateCurrentSlide(slide.id);
        } else {
            var slide = {
                liked: 0,
                title: title,
                indexh: event.indexh,
                indexv: event.indexv
            };
            postNewSlide(slide);
        }
    }, function(e) { alert('error'); });
});
