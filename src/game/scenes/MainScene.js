import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
    this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
  }

create() {
  // Create a simple ground using rectangle
  this.ground = this.add.rectangle(400, 300, 800, 600, 0x87ceeb);

  // Player
  this.player = this.physics.add.sprite(100, 100, "player");
  this.player.setCollideWorldBounds(true);

  this.cursors = this.input.keyboard.createCursorKeys();

  // Add boundaries (walls)
  this.walls = this.physics.add.staticGroup();

  this.walls.create(400, 10, "ground").setScale(8, 0.2).refreshBody(); // top
  this.walls.create(400, 590, "ground").setScale(8, 0.2).refreshBody(); // bottom
  this.walls.create(10, 300, "ground").setScale(0.2, 6).refreshBody(); // left
  this.walls.create(790, 300, "ground").setScale(0.2, 6).refreshBody(); // right

  this.physics.add.collider(this.player, this.walls);
    this.club = this.physics.add.staticGroup();

  this.club.create(600, 300, "ground").setScale(1, 1).refreshBody();
    this.npc = this.physics.add.staticSprite(300, 300, "player").setTint(0xff0000);
      this.physics.add.overlap(this.player, this.club, () => {
    console.log("🏢 Entered Coding Club");
  });

  this.physics.add.overlap(this.player, this.npc, () => {
    console.log("🧍 NPC: Welcome to ClubVerse!");
  });
}

update() {
  const speed = 160;
  let vx = 0;
  let vy = 0;

  if (this.cursors.left.isDown) vx = -speed;
  if (this.cursors.right.isDown) vx = speed;
  if (this.cursors.up.isDown) vy = -speed;
  if (this.cursors.down.isDown) vy = speed;

  // Normalize diagonal speed
  if (vx !== 0 && vy !== 0) {
    vx *= 0.707;
    vy *= 0.707;
  }

  this.player.setVelocity(vx, vy);
}
}