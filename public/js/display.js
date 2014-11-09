BEATS = 16;
BPM = 240;
INTERVAL = 60000 / BPM/2;
CURRENTCOL = 0;
/// sum io shit

var socket = io();

Dropzone.options.myDropzone = {
  init: function() {
    var self = this;
    // config
    self.options.addRemoveLinks = false;
    //New file added
    self.on("addedfile", function(file) {
      console.log('upload started', file);
    });

    // Send file starts
    self.on("sending", function(file) {
      console.log('upload started', file);
    });

    self.on("success", function(file,responseText) {
      $('.container').append( row(BEATS, row_numbers++, file.name) );
      $('.container').append('<br />');
      socket.emit('newFile', file.name);
    });
  }
};

var PLAYERS = {}

function newSample(filename) {
  var player = new Tone.Sampler("/public/samples/" + filename, function(){});
  player.toMaster();
  return player;
}

function playNotes(beats) {
  beats.each( function() {
    PLAYERS[$(this).attr('row')].triggerAttackRelease(0);
  });
}


//// DISPLAY

function row(beats, row_number, filename) {
  PLAYERS[row_number] = newSample(filename);
  newrow = jQuery('<div/>', {id: row_number, class: 'row' });
  return newrow.append( function() {
    return $.map($(Array(beats)),function(val, i) {
      return jQuery('<div/>', {
        id: i.toString(),
        class: 'animated fadeIn note col' + i.toString() + " row" + row_number.toString(),
        row: row_number,
        col: i,
      })
    })
  })
}

function getColumn(beat) {
  return $( ".col" + beat.toString() );
}

var beats = getColumn(CURRENTCOL++ % BEATS);
var playingBeats = beats.filter('.selected');


var playing = window.setInterval(magic, INTERVAL);


/// CLICK HANDLERS

$('.pause').click(function() {
  clearInterval(playing);
});

$('.play').click(function() {
  clearInterval(playing);
  playing = window.setInterval(magic, INTERVAL);
});


$(document).on('click', '.note', function(){
  $(this).toggleClass('selected');
  var loc = $(this).attr('row') + "," + $(this).attr('col');
  socket.emit('selection', loc);
});



function magic() {
  if (playingBeats.length > 0) {
    playingBeats.toggleClass('playing');
    bgcolor();
  }

  beats.toggleClass('on');
  column = getColumn(CURRENTCOL++ % BEATS);
  beats = column.not(".selected");
  beats.toggleClass('on');
  playingBeats = column.filter('.selected');

  if (playingBeats.length > 0) {
    playingBeats.toggleClass('playing');
  }
  playNotes(playingBeats);
}

var c = 0
function bgcolor() {
}

socket.on('selection', function(msg){
  var loc = msg.split(',');
  console.log(msg);
  $('#' + loc[1] + '.row' + loc[0]).toggleClass('selected');
});

socket.on('initial', function(msg) {
  console.log(msg);
  $.each(msg, function(i, m) {
    var loc = m.split(',');
    $('#' + loc[1] + '.row' + loc[0]).toggleClass('selected');
  });
});


socket.on('newRow', function(msg){
  console.log(msg);
  $('.container').append( row(BEATS, row_numbers++, msg) );
  $('.container').append('<br />');
});


row_numbers = 1
socket.on('files', function(msg){
  var not_hidden = jQuery.grep(msg, function(s) { return !s.match(/^\..*/) });
  $.each(not_hidden, function(i, f) {
    $('.container').append( row(BEATS, row_numbers++, f) );
    $('.container').append('<br />');
  });
});
