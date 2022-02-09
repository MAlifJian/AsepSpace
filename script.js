let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let presedK = {
		a : false,
		d : false,
		space : false
	};

// Utils Function

const clearAll = () => {
	score = 0;
	grids.splice(0, grids.length);
	projectiles.splice(0, projectiles.length);
	invaderProjectiles.splice(0, invaderProjectiles.length)
}

const presed = (dat) => {

	(dat.key == 'a' && dat.type == 'up') ? presedK.a = false : (dat.key == "d" && dat.type == "up") ? presedK.d = false : "";
	(dat.key == 'a' && dat.type == 'down') ? presedK.a = true : (dat.key == 'd' && dat.type =='down') ? presedK.d = true : "";
	(dat.key == 'w' && dat.type == 'down') ? player.shot() : '';
	if (presedK.a == true && player.position.x > 0) {
		player.velocity.x = -7;
		player.rotation = -.15
	}else if (presedK.d == true && player.position.x < canvas.width - player.width) {
		player.velocity.x = 7;
		player.rotation = .15;
	}else{
		player.velocity.x = 0;
		player.rotation = 0;
	}
}

const shot = (projectiles, type = "player") => {
	projectiles.forEach( (projectile , index) => {

		if(type == "invader" && projectile.position.y + projectile.height >= player.position.y && projectile.position.x + projectile.width >= player.position.x && projectile.position.x <= player.position.x + player.width){
			createParticle(player, "white")
			setTimeout(() => {
				projectiles.splice(index,1)
			},0)
			die = true;
		}

		if (projectile.position.y + projectile.radius <= 0 && type == "player" || projectile.position.y - projectile.height >= canvas.height && type == "invader") {
			setTimeout(() => {
				projectiles.splice(index,1)
			},0)
		}else{
			projectile.update()
		}
	})
}


const spawner = () => {
	grids.forEach((grid, gridIndex) => {
		grid.update();
		// Invader Shot
		if(frames % 100 === 0 && grid.invaders.length > 0){
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shot();
		}
		
		grid.invaders.forEach((invader, i) => {
			invader.update(grid.velocity)

			projectiles.forEach((projectile, j) => {
				if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y) {

					setTimeout(() => {
						const invaderFound = grid.invaders.find(invader2 => invader2 === invader);
						const projectileFound = projectiles.find(projectile2 => projectile2 === projectile);
						createParticle(invader, "#002640")
						// Remove Invader And Projectile
						if (invaderFound && projectileFound) {
							
							grid.invaders.splice(i,1);
							projectiles.splice(j,1);
							score++;
							if (grid.invaders.length > 0) {
								const firstInvader = grid.invaders[0];
								const lastInvader = grid.invaders[grid.invaders.length -1];

								grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
								grid.position.x = firstInvader.position.x
							}else{
								grids.splice(gridIndex, 1);
							}
						}
					},0)
				}
			})
		})
	})
}


const createParticle = (object,color,fade) => {
	for(var p = 0; p < 10; p++){
		particles.push(new Particle(
			{
				x: object.position.x + object.width/2
				, y: object.position.y + object.height/2
			}
			,{
				x: (Math.random() -.5) * 2
				, y: (Math.random() -.5) * 2
			}
			,(Math.random() *5)
			, color
			, fade
			)
		)
	};
}


const particle = ()=>{
	particles.forEach((particle, index) => {
		if(particle.position.y >= canvas.height){
			particle.position.x = Math.random() * canvas.width;
			particle.position.y = 0 - particle.radius
		}
		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(index,1)
			},0)
		}else{
			particle.update();
		}
	})
}

// Class
class Player{
	constructor(){
		this.width = 64;
		this.height = 64;
		this.position = {
			x : canvas.width/2 - this.width/2,
			y : canvas.height - 100
		}
		this.rotation = 0;
		this.velocity = {
			x : 0,
			y : 0
		}
		this.sfx = document.createElement('audio');
		this.sfx.src = "laser.mp3";
		this.img = new Image();
		this.img.src = "./img/space.png"
	}
	draw(){
		ctx.save()
		ctx.translate(this.position.x + player.width/2, this.position.y + player.height/2)
		ctx.rotate(this.rotation);
		ctx.translate(-this.position.x - player.width/2, -this.position.y - player.height/2)
		ctx.drawImage(this.img, this.position.x, this.position.y);
		ctx.restore()
	}
	shot(){
		this.sfx.play();
		projectiles.push(new Projectile({x: player.position.x + (player.width/2), y: player.position.y},{x: 0, y: -10}))
	}
	update(){
		this.position.x += this.velocity.x;
		this.draw()
	}
}




class Invader{
	constructor(position){
		this.width = 32 * 1.5;
		this.height = 32 * 1.5;
		this.position = position;
		this.velocity = {
			x : 0,
			y : 0
		}
		this.img = new Image();
		this.img.src = "./img/invaders.png"
	}
	draw(){
		ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
	}
	update(velocity){
		this.position.y += velocity.y;
		this.position.x += velocity.x;
		this.draw()
	}
	shot(){
		invaderProjectiles.push(new InvaderProjectile(
			{x: this.position.x + this.width/2,
			y: this.position.y + this.height
			},
			{x: 0,
			y: 5}
		))
	}
}





class Grid{
	constructor(){
		this.position = {
			x: 0,
			y: 0
		}
		this.velocity = {
			x: 3,
			y: 0
		}

		this.invaders = [];

		const columns = Math.floor(Math.random() * 10 + 5);
		const rows = Math.floor(Math.random() * 5 + 2);

		this.width = columns * 32 * 1.5;
		for (var x = 0; x < columns; x++) {
			for(var y = 0; y < rows; y++){
				this.invaders.push(new Invader({x: x * 32 * 1.5, y: y * 32 * 1.5}))
			}
		}
	}

	update(){
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.velocity.y = 0;
		if (this.position.x >= canvas.width - this.width || this.position.x <= 0) {
			this.velocity.x = - this.velocity.x;
			this.velocity.y = 30;
		}
	}
}







class Projectile{
	constructor(position, velocity){
		this.position = position;
		this.velocity = velocity;

		this.radius = 4;
	}
	draw(){
		ctx.beginPath()
		ctx.arc(this.position.x,this.position.y, this.radius, 0 , Math.PI * 2)
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.closePath()
	}
	update(){
		this.position.y += this.velocity.y;
		this.draw()
	}
}




class InvaderProjectile{
	constructor(position, velocity){
		this.position = position;
		this.velocity = velocity;

		this.width = 4;
		this.height = 10;
	}
	draw(){
		ctx.fillStyle = 'white';
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	update(){
		this.position.y += this.velocity.y;
		this.draw()
	}
}





class Particle{
	constructor(position, velocity,radius,color, fade = true){
		this.position = position;
		this.velocity = velocity;
		this.opacity = 1;
		this.radius = radius;
		this.color = color;
		this.fade = fade
	}
	draw(){
		ctx.save()
		ctx.globalAlpha = this.opacity;
		ctx.beginPath()
		ctx.arc(this.position.x,this.position.y, this.radius, 0 , Math.PI * 2)
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath()
		ctx.restore()
	}
	update(){
		if(this.fade){
			this.opacity -= .01
		}
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.draw()
	}
}


// Event listener

addEventListener('keydown', e => {
	let key = e.key;
	presed({key, type : 'down'})
})

addEventListener('keyup', e => {
	let key = e.key;
	presed({key, type : 'up'});
})

const startBtn = document.querySelector("button")
const content = document.querySelector(".content");
const scoreBoard = document.querySelector(".score")

startBtn.addEventListener('click', () => {
	content.style.display = "none";
	die = false
})

let score = 0;
let frames = 1;
let randomInterval = Math.floor(Math.random() * 500) + 500;

let die = true;
let projectiles = [];

const player = new Player();

const invaderProjectiles = [];
const grids = [new Grid()];
const particles = [];

for(let n = 0; n < 100; n++){
	particles.push(
		new Particle(
			{x: Math.random() * canvas.width
			,y: Math.random() * canvas.height},
			{x: 0
			,y: 1},
			Math.random() * 2,
			"white",
			false
		)
	)
}

function start(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "black";
	ctx.fillRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	ctx.fillText(`Score: ${score}`, 20, 20 , 40);
	particle();
	player.update();
	shot(projectiles);
	shot(invaderProjectiles, "invader");
	spawner();
	

	if (frames % randomInterval === 0) {
		grids.push(new Grid());
		randomInterval = Math.floor(Math.random() * 500) + 500;
		frames = 0;
	}
	frames++;
	
	if(!die){
		requestAnimationFrame(start);;
	}else{
		scoreBoard.innerText = `Score : ${score}`;
		content.style.display = "block";
		menu();
	}
}

function menu(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	clearAll()
	particle();
	if(die){
		requestAnimationFrame(menu)
	}else{
		start()
	}
}

menu();