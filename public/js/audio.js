var PLAYERS = {}

var player = new Tone.Player("../samples/BD0075.wav", function(){ });
player.toMaster();

function playNotes() {
  player.start;
}
