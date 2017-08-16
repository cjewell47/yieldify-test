
$(document).ready(function() {

  //Canvas info
  const canvas  = document.getElementById('myCanvas');
  const ctx     = canvas.getContext('2d');
  let width     = $(window).width();
  let height    = $(window).height();
  canvas.width  = width;
  canvas.height = height;
  const radius  = 10;
  let count     = 360;

  //Ball info
  let coordinates    = [0,0];
  let velocity       = [0,0];
  let acceleration   = [0,0];
  const gravity      = 9.8;
  const mass         = 10;
  const gForce       = gravity*mass;
  let forces         = [[0, gForce, false]];
  const bounceFactor = 0.7;
  const color        = '#000';

  //Timing info
  const refreshRate = 0.01;
  let start         = 0;
  let timer         = null;


  window.onresize = function() {
    width   = $(window).width();
    height  = $(window).height();
    canvas.width  = width;
    canvas.height = height;
  };

  canvas.onclick = function(e) {
    reset();
    const x = e.layerX !== undefined ? e.layerX : e.offsetX;
    const y = e.layerY !== undefined ? e.layerY : e.offsetY;
    coordinates = [x,y];
    randomizeNew();
    draw();
    begin();
  };

  function randomizeNew() {
    var randomX = Math.round(Math.random()) * 2 - 1;
    var randomY = Math.round(Math.random()) * 2 - 1;
    var vectorX = ((Math.random() * 1000) + 1) * randomX;
    var vectorY = ((Math.random() * 1000) + 1) * randomY;
    forces.push([vectorX, vectorY, 0.05]);
    // thrust applied for .05s
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(coordinates[0], coordinates[1], radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function physics(rate) {
    const newLocation = [0,0];
    const newForces = [];
    for (let i=0; i < forces.length; i++) {
      const f = forces[i];
      if(f[2] !== false) {
        f[2] -= rate;
      }
      // Thrust forces applying
      if(f[2] < 0) {
        continue;
      }
      // Gravity applying
      newLocation[0] += f[0];
      newLocation[1] += f[1];
      newForces.push(f);
    }

    forces = newForces;
    return newLocation;
  }

  function calculate(rate, newLocation) {
    coordinates = [coordinates[0] + velocity[0]*rate + 0.5*acceleration[0]*rate*rate, coordinates[1] + velocity[1]*rate + 0.5*acceleration[1]*rate*rate];
    acceleration = [newLocation[0]/(mass*rate), newLocation[1]/(mass*rate)];
    velocity = [velocity[0] + 0.5* (acceleration[0] + acceleration[0])*rate, velocity[1] + 0.5* (acceleration[1] + acceleration[1])*rate];
  }

  function handleCollision() {
    //Left
    if (coordinates[0] <= radius) {
      coordinates[0] = radius;
      velocity[0] *= -bounceFactor;
      velocity[1] *= bounceFactor;
    }

    //Right
    if (coordinates[0] >= width-radius) {
      coordinates[0] = width-radius;
      velocity[0] *= -bounceFactor;
      velocity[1] *= bounceFactor;
    }

    //Top
    if (coordinates[1] <= radius) {
      coordinates[1] = radius;
      velocity[0] *= bounceFactor;
      velocity[1] *= -bounceFactor;
    }

    //Bottom
    if (coordinates[1] > height-radius) {
      coordinates[1] = height-radius;
      velocity[0] *= bounceFactor;
      velocity[1] *=-bounceFactor;
    }
  }

  //Movement
  function move() {
    var newStart = new Date().getTime();
    var rate = (newStart-start)/1000;

    if(rate < refreshRate) {
      rate = refreshRate;
    }
    start = newStart;

    const newLocation = physics(rate);
    calculate(rate, newLocation);
    handleCollision();

    draw();
  }

  function begin() {
    start = new Date().getTime();
    timer = setInterval(move, refreshRate*1000);
  }

  function reset() {
    clearInterval(timer);
    timer = null;
    acceleration = velocity = [0, 0];
  }

  let up;
  function myCount() {
    if(count === 0) {
      up = true;
    }
    if(count === 360) {
      up = false;
    }
    if(up) {
      count ++;
    }
    if(!up) {
      count--;
    }

    const color1 = 'hsl(' + count + ', 100%, 70%)';
    const color2 = 'hsl(' + count/2 + ', 100%, 70%)';
    $('#myCanvas').css(
      'background',
      'linear-gradient(' + count + 'deg, ' + color1 + ' 0%, ' + color2 + ' 100%)'
    );

  }

  setInterval(myCount, 30);

});
