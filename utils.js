// Utils Function

const presed = (dat) => {

	(dat.key == 'a' && dat.type == 'up') ? presedK.a = false : (dat.key == "d" && dat.type == "up") ? presedK.d = false : "";
	(dat.key == 'a' && dat.type == 'down') ? presedK.a = true : (dat.key == 'd' && dat.type =='down') ? presedK.d = true : "";
	(dat.key == 'w' && dat.type == 'down') ? projectiles.push(new Projectile({x: player.position.x + (player.width/2), y: player.position.y},{x: 0, y: -10})) : '';
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

const shot = () => {
	projectiles.forEach( (projectile , index) => {
		if (projectile.position.y + projectile.radius <= 0) {
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
		grid.update()
		grid.invaders.forEach((invader, i) => {
			invader.update(grid.velocity)

			projectiles.forEach((projectile, j) => {
				if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y) {

					setTimeout(() => {
						const invaderFound = grid.invaders.find(invader2 => invader2 === invader);
						const projectileFound = projectiles.find(projectile2 => projectile2 === projectile);

						for(var p = 0; p < 15; p++){
								particles.push(new Particle(
									{
										x: invader.position.x + invader.width/2
										, y: invader.position.y + invader.height/2
									}
									,{
										x: (Math.random() -.5) * 2
										, y: (Math.random() -.5) * 2
									}
									,(Math.random() *3)
									)
								)
							};
						// Remove Invader And Projectile
						if (invaderFound && projectileFound) {
							
							grid.invaders.splice(i,1);
							projectiles.splice(j,1);

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

const particle = ()=>{
	particles.forEach((particle, index) => {
		particle.update();
		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(index,1)
			},0)
		}
	})
}

export {presed, shot,spawner,particle}