var flite = require('flite2')

var message = "you know what we need? some more waffles!"
var c = {
    voice: 'slt'
};


flite([c], function (err, speech) {
  if (err) { return console.error(err) }
  //console.log(speech.voices);
  speech.say(message, function (err) {
    if (err) { return console.error(err) }
    /// make sure to have your sound on :)
  });
});
