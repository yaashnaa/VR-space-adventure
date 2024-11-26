let world,
  ufo,
  platform1,
  platform2,
  platform3,
  platform4,
  score = 0,
  collectibles = [],
  spaceStation,
  ring,
  wormhole,
  orb,
  buffer1,
  buffer2,
  texture1,
  texture2
let light1,
  assetID = "glow-gif";
let signpost;
let orbsCollected = [];
let particlesArray = [];
let orbs = [];
let rotatingSpheres = [];
let hoverDirection = 1;
let hoverY = 10;
let hoverSpeed = 0.02;
let hoverRange = 0.5;
let angle = 0;
let wormhole1, wormhole2;
let collectSound, spacemusic, gameOverSound;

function preload() {
  collectSound = loadSound('./sounds/collect.mp3'); // For collecting orbs
  spacemusic = loadSound('./sounds/space_music.mp3'); 
  gameOverSound = loadSound('./sounds/game-over.mp3'); // For teleporting
}

function setup() {
  noCanvas();
  world = new AFrameP5.World("VRScene");
  spacemusic.setVolume(0.3); // Adjust volume (0 to 1)
  spacemusic.loop();
  let sky = new AFrameP5.Sky({
    asset: "bg",
  });
  world.add(sky);
  let planetTextures = [
    "p1",
    "p2",
    "p3",
    "p4",
    "p5",
    "p6",
    "p7",
    "p8",
    "p9",
    "p10",
  ];
  platform1 = new AFrameP5.Box({
    x: random(-100, 100), 
    y: random(-50, 100),
    z: random(-100, 150),
    width: 10,
    height: 2,
    depth: 5,
    asset: "platform",
    clickFunction: function (thePlatform) {
      world.slideToObject(thePlatform, 1000);
    },
  });
  world.add(platform1);

  platform2 = new AFrameP5.Box({
    x: random(-100, 100),
    y: random(-50, 100), 
    z: random(-100, 150),
    width: 10,
    height: 2,
    depth: 5,
    asset: "platform",
    clickFunction: function (thePlatform) {
      world.slideToObject(thePlatform, 1000);
    },
  });
  world.add(platform2);
  platform3 = new AFrameP5.Box({
    x: random(-100, 100), 
    y: random(-50, 100),
    z: random(-100, 150),
    width: 10,
    height: 2,
    depth: 5,
    asset: "platform",
    clickFunction: function (thePlatform) {
      world.slideToObject(thePlatform, 1000);
    },
  });
  world.add(platform3);

  platform4 = new AFrameP5.Box({
    x: random(-100, 100),
    y: random(-50, 100), 
    z: random(-100, 150),
    width: 10,
    height: 2,
    depth: 5,
    asset: "platform",
    clickFunction: function (thePlatform) {
      world.slideToObject(thePlatform, 1000);
    },
  });
  world.add(platform4);

  world.add(sky);

  buffer1 = createGraphics(256, 256);
  buffer2 = createGraphics(256, 256);
  buffer1.background(255);
  buffer2.background(255);
  texture1 = world.createDynamicTextureFromCreateGraphics(buffer1);
  texture2 = world.createDynamicTextureFromCreateGraphics(buffer2);
  spaceStation = new AFrameP5.GLTF({
    asset: "spaceStation",
    x: 20,
    y: 5,
    z: -60,
    attributes: {
      scale: "2 2 2",
      rotation: "0 45 0",
    },
  });
  world.add(spaceStation);

  //stars
  for (let i = 0; i < 200; i++) {
    let star = new AFrameP5.Sphere({
      x: random(-150, 150),
      y: random(-10, 150),
      z: random(-150, 150),
      radius: 0.6,
      asset: "star_texture",
      opacity: random(0.5, 1),
    });
    world.add(star);
  }

  // orbs
  for (let i = 0; i < 10; i++) {
    let model = new Orb(
      random(-100, 150),
      random(10, 90),
      random(-150, 100),
      "glowing-model"
    );
    model.addToWorld(world);
    orbs.push(model);
  }
  wormhole1 = new AFrameP5.Torus({
    x: random(-50, 50),
    y: random(10, 50),
    z: random(-50, 50),
    rotationX: -90,
    asset: texture1,
    radius: 2,
    tube: 0.5,
    dynamicTexture: true,
    dynamicTextureWidth: 256,
    dynamicTextureHeight: 256,
  });
  world.add(wormhole1);
  wormhole2 = new AFrameP5.Torus({
    x: random(-100, 100),
    y: random(10, 70),
    z: random(-80, 70),
    rotationX: -90,
    asset: texture2,
    radius: 4,
    tube: 0.8,
    dynamicTexture: true,
    dynamicTextureWidth: 256,
    dynamicTextureHeight: 256,
  });
  world.add(wormhole2);

  // planets
  for (let i = 0; i < 15; i++) {
    let t = random(planetTextures);
    let planet = new AFrameP5.Sphere({
      x: random(-250, 250),
      y: random(-150, 250),
      z: random(-350, 350),
      radius: random(5, 15),
      asset: t,
    });
    world.add(planet);
  }

  // UFO
  ufo = new AFrameP5.Container3D({
    x: 0,
    y: 10,
    z: 0,
  });

  // UFO base
  let base = new AFrameP5.Sphere({
    x: 0,
    y: 0,
    z: 0,
    radius: 2,
    scaleY: 0.5,
    red: 150,
    green: 150,
    blue: 150,
  });
  ufo.addChild(base);

  // UFO TOP
  let dome = new AFrameP5.Sphere({
    x: 0,
    y: 1,
    z: 0,
    radius: 1.5,
    red: 200,
    green: 200,
    blue: 255,
    opacity: 0.8,
  });
  ufo.addChild(dome);

let beam = new AFrameP5.Cylinder({
    x: 0, y: -2, z: 0,
    radius: 1,
    height: 3,
    red: 200, green: 255, blue: 200,
    opacity: 0.5 
});
ufo.addChild(beam);
  let asteroid = new AFrameP5.Box({
    x: random(-150, 150), // Expand the range
    y: random(-10, 150), // Allow for more verticality
    z: random(-150, 150),
    width: random(1, 3),
    height: random(1, 3),
    depth: random(1, 3),
    red: 100,
    green: 100,
    blue: 100,
  });
  world.add(asteroid);
  world.add(ufo);
}

function draw() {
  // ufo hover
  hoverY += hoverSpeed * hoverDirection;

  if (hoverY > 10 + hoverRange || hoverY < 10 - hoverRange) {
    hoverDirection *= -1;
  }
  ufo.setPosition(ufo.getX(), hoverY, ufo.getZ());
  ufo.spinY(0.5);

  let s1 = random(5, 30);
  buffer1.fill(random(255));
  buffer1.rect(random(0, 256), random(0, 256), s1, s1);
  let s2 = random(5, 30);
  buffer2.fill(random(255), random(255), random(255));
  buffer2.ellipse(random(0, 256), random(0, 256), s2, s2);

  for (let model of orbs) {
    model.animate(frameCount);
  }
  for (let sphere of rotatingSpheres) {
    sphere.animate();
  }

  wormhole1.spinX(1);
  wormhole1.spinY(0.8);
  wormhole2.spinX(1);
  wormhole2.spinY(0.8);
}

function mousePressed() {
  for (let i = orbs.length - 1; i >= 0; i--) {
    let model = orbs[i];
    let position = model.model.tag.object3D.position;
    let distance = dist(
      position.x,
      position.y,
      position.z,
      world.getUserPosition().x,
      world.getUserPosition().y,
      world.getUserPosition().z
    );

    if (distance < 5) {
      model.model.hide();
      collectSound.play();
      orbs.splice(i, 1);
      score++;
      orbsCollected.push(model);
      document.getElementById("score").textContent = score;
      if (orbs.length === 0) {
        showCompletionMessage();
      }
    }
    //       console.log("Model position:", position);
    // console.log("User position:", world.getUserPosition());
  }
}
function showCompletionMessage() {
  gameOverSound.play();
  spacemusic.stop();
  let feedback = document.getElementById("feedback");
  feedback.textContent = "Congratulations! You've collected all the items!";

  document.getElementById("restartButton").style.display = "block";
}
function restartGame() {
  score = 0;
  document.getElementById("score").textContent = score;

  orbs.forEach((orb) => world.remove(orb.model));
  orbs = [];

  for (let i = 0; i < 10; i++) {
    let orb = new Orb(
      random(-100, 150),
      random(10, 90),
      random(-150, 100),
      "glowing-model"
    );
    orb.addToWorld(world);
    orbs.push(orb);
  }

  document.getElementById("restartButton").style.display = "none";
  document.getElementById("feedback").textContent = "";
}

class Orb {
  constructor(x, y, z, assetID) {
    this.model = new AFrameP5.GLTF({
      x: x,
      y: y,
      z: z,
      asset: assetID,
      attributes: {
        scale: "0.2 0.2 0.2",
        rotation: "0 0 0",
      },
    });
    this.baseY = y;
  }

  // Add the model to the world
  addToWorld(world) {
    world.add(this.model);
  }

  animate(frameCount) {
    let currentRotation = this.model.getRotationY();
    this.model.setRotation(
      this.model.getRotationX(),
      currentRotation + 0.5,
      this.model.getRotationZ()
    );

    let verticalMove = frameCount * 0.05 * 0.5;
    this.model.setPosition(
      this.model.getX(),
      this.baseY + verticalMove,
      this.model.getZ()
    );
  }
}
