import * as THREE from 'three';
import {scene, renderer, camera} from './startThreeJsandLights.js';
import * as FIELD from './playingField.js'
import {player1, movePlayer, constrainPlayer, computerPlay, COMPUTER_HEIGHT, COM, resetComputer, PLAYER1, computer, PLAYER_WIDTH, PLAYER_HEIGHT} from './player.js';
import {ball, BALL, BALL_RADIUS, resetBall} from './ball.js';
console.log('startThreeJsandLights.js loaded');


FIELD.constructPlayingField(scene); //Construct the playing field




const cube1Geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cube1Material = new THREE.MeshBasicMaterial({color: 0xFFFFF});
const cube1 = new THREE.Mesh(cube1Geometry, cube1Material);
scene.add(cube1);



// // //PLAYER1
// // const	player1Geometry = new THREE.BoxGeometry(4, 10, 1);
// // const	player1Material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
// // const	player1 = new THREE.Mesh(player1Geometry, player1Material);

// // player1.castShadow = true;
// // player1.position.z = 0;
// // player1.position.y = 0;


// const boxHelper = new THREE.BoxHelper(player1, 0xffff00);
// scene.add(boxHelper);

// scene.add(player1);


function ballBounceSideWall() {
	if (ball.position.x >= (FIELD.FIELD_WIDTH / 2) - BALL_RADIUS) {
		FIELD.outerWallX2.material.color.set(0x2C2F4B);
		BALL.velocityX = BALL.velocityX * -1;
		let count = 3;
		const timer = setInterval(function() {
			count--;
			if (count === 0) {
				clearInterval(timer);
				FIELD.outerWallX2.material.color.set(0x10112);
			}
		}, 300);
	}

	if (ball.position.x <= -(FIELD.FIELD_WIDTH / 2) + BALL_RADIUS) {
		FIELD.outerWallX1.material.color.set(0x2C2F4B);
		BALL.velocityX = BALL.velocityX * -1;
		let count = 3;
		const timer = setInterval(function() {
			count--;
			if (count === 0) {
				clearInterval(timer);
				FIELD.outerWallX1.material.color.set(0x10112);
			}
		}, 300);
	}
}

// Collision Detection ( b = ball , p = player)
// function collision(b,p){
// 	let	ballXmax = b.position.z + BALL_RADIUS;
// 	let	ballXmin = b.position.z - BALL_RADIUS;
// 	let	ballYmax = b.position.x - BALL_RADIUS;
// 	let	ballYmin = b.position.x + BALL_RADIUS;

// 	// console.log("BallFront: " + ballFront + " BallBack: " + ballBack + " BallLeft: " + ballLeft + " BallRight" + ballRight);
// 	let	playerXmax = p.position.z + PLAYER_HEIGHT/2;
// 	let	playerXmin = p.position.z - PLAYER_HEIGHT/2;
// 	let	playerYmax = p.position.x - PLAYER_WIDTH/2;
// 	let	playerYmin = p.position.x  + PLAYER_WIDTH/2;

// 	return playerXmin <= ballXmax && playerXmax >= ballXmin && playerYmin <= ballYmax && playerYmax >= ballYmin;
// }


function collision(b, p) {
    let ballXmax = b.position.x + BALL_RADIUS;
    let ballXmin = b.position.x - BALL_RADIUS;
    let ballZmax = b.position.z + BALL_RADIUS;
    let ballZmin = b.position.z - BALL_RADIUS;

    let playerXmax = p.position.x + PLAYER_WIDTH / 2;
    let playerXmin = p.position.x - PLAYER_WIDTH / 2;
    let playerZmax = p.position.z + PLAYER_HEIGHT / 2;
    let playerZmin = p.position.z - PLAYER_HEIGHT / 2;

    // Check if the ball's bounding box overlaps with the player's bounding box
    return playerXmin <= ballXmax && playerXmax >= ballXmin &&
           playerZmin <= ballZmax && playerZmax >= ballZmin;
}

function update() {
	//Check if ball goes outside of the field
	if (ball.position.z + BALL_RADIUS > FIELD.FIELD_LENGTH / 2) {
		COM.score++;
		resetBall();
		resetComputer();
	} else if  (ball.position.z - BALL_RADIUS < -FIELD.FIELD_LENGTH / 2) {
		PLAYER1.score++;
		resetBall();
		resetComputer();
	}

	computerPlay(ball);


	//lets fasten the ball
	ball.position.x += BALL.velocityX;
	ball.position.z += BALL.velocityZ;

	//IF ball hits the sideWalls inverse the balls movement
	ballBounceSideWall();

	// Check on which side of the field is the paddle
	let player = (ball.position.z > 0) ? player1 : computer;



	        // If the ball hits a paddle
			if(collision(ball, player)){
				console.log("Hellocollision!!!!");
				// Check where the ball hits the paddle
				let collidePoint = ball.position.x - player.position.x;
				// Normalize the value of collidePoint, to get numbers between -1 and 1.
				collidePoint = collidePoint / (PLAYER_WIDTH/2);
				console.log("Collid Point: " + collidePoint);
				
				// When the ball hits the top of a paddle we want the ball, to take a -45 degrees angle
				// When the ball hits the center of the paddle we want the ball to take a 0 degrees angle
				// When the ball hits the bottom of the paddle we want the ball to take a 45 degrees
				// Math.PI/4 = 45degrees
				let angleRad = (Math.PI/4) * collidePoint;
				
				// Change the X and Z velocity direction
				let direction = (ball.position.z + BALL_RADIUS < 0) ? 1 : -1;
				BALL.velocityZ = direction * BALL.speed * Math.cos(angleRad);		// Check if correct
				BALL.velocityX = BALL.speed * Math.sin(angleRad);					//Check if correct
				
				// Speed up the ball every time a paddle hits it.
				BALL.speed += 0.025;
			}
		if (BALL.speed >= 0.5) {
			BALL.speed = 0.5;
		}
}

function animate() {
	renderer.render(scene, camera);
	renderer.setAnimationLoop(animate);

	update();
	// constrainPlayer();
	// rotateSets();
	// if (GlobalVar.gameStart === false) {
	// 	startBallMovement();
	// }
	// paddleLogic();
	// ballMovement();
	// ballMove();
}

export {animate};

window.addEventListener('resize', function() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -d * aspect;
  camera.right = d * aspect;
  camera.top = d;
  camera.bottom = -d;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});