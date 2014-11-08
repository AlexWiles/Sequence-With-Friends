function row(beats, row_number) {
  newrow = jQuery('<div/>', {id: row_number, class: 'row' });
  return newrow.append( function() {
    return $.map($(Array(beats)),function(val, i) {
      return jQuery('<div/>', {
        id: i.toString(),
        class: 'note col' + i.toString() + " row" + row_number.toString(),
      })
    })
  })
}

function getColumn(beat) {
  return $( ".col" + beat.toString() );
}

BEATS = 16;
BPM = 480;
INTERVAL = 60000 / BPM;
CURRENTCOL = 0;
var beats = getColumn(CURRENTCOL++ % BEATS);

row_numbers = 1
$('.container').append( row(BEATS, row_numbers++) );

$('.newnote').click(function() {
  $('.container').append( row(BEATS, row_numbers++) );
});

$(document).on('click', '.note', function(){
  $(this).toggleClass('selected');
});

function magic() {
  beats.toggleClass('on');
  beats = getColumn(CURRENTCOL++ % BEATS);
  beats.toggleClass('on');
  selectedBeats = beats.hasClass('selected');
}

window.setInterval(magic, INTERVAL);

