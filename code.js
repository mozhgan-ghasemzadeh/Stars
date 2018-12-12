var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");


var mousex =-1,mousey=-1;
var StarArray =[];
var NumberOfStars =15 ,R =25;

var velocity = 2.5;
console.log(window.innerWidth);
if(window.innerWidth < 450){
	NumberOfStars= 5;
}



//find the location of mouse
window.addEventListener("mousemove",function(event){
	mousex = event.x;
	mousey = event.y;
	
	
})
//change window size (reponsive)
window.addEventListener("resize",function(){
	// if reduce the size of screen
	if (canvas.width > window.innerWidth ||  canvas.height > window.innerHeight){
		for (var i = 0; i< NumberOfStars ; i++) {
			
			if (StarArray[i].x > window.innerWidth ){
				canvas.width = window.innerWidth;
				
				StarArray[i].x = (canvas.width - 3*StarArray[i].ORadius);
				
			}
			else if (StarArray[i].y > window.innerHeight) {
				canvas.height = window.innerHeight;
				StarArray[i].y = (canvas.height - 3*StarArray[i].ORadius);
			}
		}
	}
	// if increase the size of screen
	else{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
})


//star object
function star(x,y,dx,dy,spikes,Radius,rgb){
	this.x = x; //start point x
	this.y = y; // start point y
	this.spikes = spikes; //number of spikes
	this.ORadius = Radius;// outer radius
	this.IRadius = Radius/2;//inner radius
	this.rgb = rgb; // color
	this.dx = dx; //next point x
	this.dy = dy; //next point y
	
	
	
	var StartDegree = Math.PI/2*3;
	var SpikesDegree = Math.PI/spikes;
	var x = this.x;
	var y = this.y;

	
	

	// draw star
	this.draw=function(){
		c.beginPath();
		c.moveTo(this.x,this.y-this.ORadius);
		for(var i=0;i<spikes;i++){
			
			x = this.x + Math.cos(StartDegree)*this.ORadius;
	        y = this.y + Math.sin(StartDegree)*this.ORadius;
	        c.lineTo(x,y);
	        StartDegree+=SpikesDegree;

	        x = this.x + Math.cos(StartDegree)*this.IRadius;
	        y = this.y + Math.sin(StartDegree)*this.IRadius;
	        c.lineTo(x,y);
	        StartDegree+=SpikesDegree;
		}
		c.lineTo(this.x,this.y-this.ORadius);
	    c.closePath();
	    
	    c.fillStyle=this.rgb;
	    c.fill();
	   


	}

	//move stars
	this.move = function(){
		this.draw();
		// if the star hits the edges of screen change direction
		if (this.x - this.ORadius<0 || this.x + this.ORadius>window.innerWidth ) {
			this.dx=-this.dx;

		}
		if (this.y - this.ORadius<0 || this.y + this.ORadius>window.innerHeight) {
			this.dy=-this.dy;
		}

		 // how to move
		this.x+=this.dx;
		this.y+=this.dy;
		
		
		
		

	}
}




canvas.addEventListener("click",explode);


//explode function
function explode(){
	for (var i = 0; i< StarArray.length ; i++) {
		//when mouse is on star change the radius
		if(Math.abs(mousex-StarArray[i].x) < StarArray[i].IRadius && Math.abs(mousey-StarArray[i].y) < StarArray[i].IRadius ){

				var col=StarArray[i].rgb;
				var rad=StarArray[i].ORadius;
				rad/=2;
				var count =30;
				var angle = (Math.PI * 2) / count;
				var pAngle =angle;
				//remove clicked star
				StarArray.splice(i,1);
				
				
				// add new stars
				for (var j = 0; j < count; j++) {
					var v = velocity/2  + Math.random() * velocity/2;
					var vx=Math.cos(pAngle)*v;
					var vy=Math.sin(pAngle)*v;
					
					newstar = new star(mousex,mousey,vx,vy,5,rad,col);
					StarArray.push(newstar);
					pAngle+=angle;
					
				}
				break;
				
				
				
		}
	
	}
}






//it randomize position,velocity,color of each star
function Randomize(){
	var x,y,dx,dy,s,Radius,rgb;
	
	Radius = parseInt(generateRandomNumber(R,R+5));
    x = Math.random()*(innerWidth - 2*Radius) + Radius;
    y = Math.random()*(innerHeight - 2*Radius) + Radius;
    dx = Math.random()*velocity*(Math.random() < 0.5 ? -1 : 1); // move next step
	dy = Math.random()*velocity*(Math.random() < 0.5 ? -1 : 1); //move next step
	s = 5; //number of spikes
	alpha = 0.85;//Math.random();
	rgb = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});// random color
	return [x,y,dx,dy,s,Radius,rgb];
}

    
//create stars
function addStars(){
	for (var i = 0; i< NumberOfStars ; i++) {
		
	    StarArray[i] = new star(Randomize()[0],Randomize()[1],Randomize()[2],Randomize()[3],Randomize()[4],Randomize()[5],Randomize()[6]);
	}
}


//begin animation
function animate(){
requestAnimationFrame(animate);
c.clearRect(0,0,innerWidth,innerHeight);

for (var i = 0; i< StarArray.length ; i++) {
	StarArray[i].move();
}

}

// Random Number generator
function generateRandomNumber(min, max) 
{
    return Math.random() * (max-min) + min ;
} 
addStars();
animate();