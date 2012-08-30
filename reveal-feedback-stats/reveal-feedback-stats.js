var host = "http://ec2-184-72-173-33.compute-1.amazonaws.com/keynote";

$(document).ready(function(){
    getSlides();     
});

function getSlides() {
    $.ajax({
      url: host + '/_design/keynote/_view/all_slides',
      dataType: 'json',
      success: function(all_slides) {
          // console.log(all_slides);
          var i, dataSet = [];
          for(i = 0 ; i < all_slides.total_rows ; i++) {
              dataSet.push([all_slides.rows[i].value.title, all_slides.rows[i].value.liked]);
          }
          console.log(dataSet);
          generateStats(dataSet);
      },
      error: function(e) { 
          alert('error ', e);
      }
    });
}

function generateStats(data) {
    console.log(JSON.stringify(data));
    
    var plot = $.jqplot('chartdiv', [data], {
      series:[{renderer:$.jqplot.BarRenderer}],
      axes: {
        xaxis: {
          renderer: $.jqplot.CategoryAxisRenderer,
          label: 'Slides',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          tickRenderer: $.jqplot.CanvasAxisTickRenderer,
          tickOptions: {
              angle: -30,
              fontFamily: 'Courier New',
              fontSize: '9pt'
          }
           
        },
        yaxis: {
          label: 'Liked',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        }
      }
    });
}
