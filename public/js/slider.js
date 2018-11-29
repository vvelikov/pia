var slider1 = document.getElementById("vslider");
var output1 = document.getElementById("vvalue");
output1.innerHTML = slider1.value;

slider1.oninput = function() {
  output1.innerHTML = this.value;
  console.log(slider1.id + " " + this.value);
}

var slider2 = document.getElementById("hslider");
var output2 = document.getElementById("hvalue");
output2.innerHTML = slider2.value;

slider2.oninput = function() {
  output2.innerHTML = this.value;
  console.log(slider2.id + " " + this.value);
}
