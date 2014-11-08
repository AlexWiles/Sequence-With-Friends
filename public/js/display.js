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
BPM = 140;
INTERVAL = 60000 / BPM;
CURRENTCOL = 0;
var beats = getColumn(CURRENTCOL++ % BEATS);
var playingBeats = beats.filter('.selected');

row_numbers = 1
$('.container').append( row(BEATS, row_numbers++) );

$('.newnote').click(function() {
  $('.container').append( row(BEATS, row_numbers++) );
});

$(document).on('click', '.note', function(){
  $(this).toggleClass('selected');
});

function magic() {
  if (playingBeats.length > 0) playingBeats.toggleClass('playing');
  console.log(playingBeats.length);
  beats.toggleClass('on');
  column = getColumn(CURRENTCOL++ % BEATS);
  beats = column.not(".selected");
  beats.toggleClass('on');
  playingBeats = column.filter('.selected');
  if (playingBeats.length > 0) playingBeats.toggleClass('playing');
}

window.setInterval(magic, INTERVAL);
