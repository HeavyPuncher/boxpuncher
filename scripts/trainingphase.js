let json = {};

json.id=0;
json.desc="training data";
json.movements = [0,0,0,0,0]

function keyPressed() {
  if (keyCode === 65) {
      json.movements[0]++;
  }
    if (keyCode === 68) {
      json.movements[1]++;
  }
    if (keyCode === 87) {
      json.movements[2]++;
  }
    if (keyCode === 83) {
      json.movements[3]++;
  }
}

// tracking data should be from -1 to 1 like a vector


function mousePressed() {
    saveJSON(json,"testData.json")
}

//json file created for every user to track movements for training data and save the data