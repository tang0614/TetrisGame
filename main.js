const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20,20);
//*********************global variables*********************//
const matrix_t =[
    [0,0,0],
    [1,1,1],
    [0,1,0],
];

const player = {
    pos: {x:0,y:0},
    matrix: matrix_t,
}

//canvas width is 240, height is 400. We want to divide canvas by matrix. 
//Since scale is 20, the matrix is 12 * 20
//create empty matrix filled with zero
const arena = createMatrix(12,20);  


//*********************functions*********************//
function createMatrix(w,h){
    const matrix =[];
    while(h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

//Draw player's matrix
//Iterate matrix by row and then by column
//Value is matrix[rowIndex][colIndex]
//Since canvas axis mirrors y=x, and we want the draw the same pattern as player's matrix
//We take the inverse of y, x in FillRect
//offset axis matches canvas matrix

function drawMatrix(matrixName,offset){
    matrixName.forEach((x,rowIndex)=>{
        x.forEach((value,columnIndex)=>{
            if(value!==0){
                context.fillStyle ='blue';
                //because coordinates of canvas is mirror y=x
                context.fillRect(
                    columnIndex+offset.x,
                    rowIndex+offset.y, 
                    1, 
                    1
                    );
            }

        });

    });
}

//After collide
//Drawing position of matrix on arena
function merge(arena,player){

    player.matrix.forEach((row,rowIndex)=>{
        row.forEach((value,colIndex)=>{
            if(value!=0){
                arena[rowIndex+player.pos.y][colIndex+player.pos.x] = value;
            }
        });
    });

}

function collide(arena,player){
    const [ma,pos] = [player.matrix,player.pos];
  
    for(let i=0; i<ma.length; i++){
        
        for(let j=0; j<ma[i].length; j++){
            //matrix element is not zero
            //arena is not zero
            // if column, row do not exist, means out of canvas, also count as collide
            if(i+pos.y>19){
                console.log('outof boundary');
                return true;

            }else{
                console.log('within boundary');
                if ((ma[i][j] !==0) &&(arena[i+pos.y][j+pos.x] !==0)){
 
                    return true;
                }else{
                    continue;
                }

            }
            
        }
    }
    
   
}


function playerDrop(){
    player.pos.y+=1;
    drawCounter = 0;

    if(collide(arena,player)){ 
        player.pos.y--;
        merge(arena,player);
        player.pos.y=0;
    }

}

function playerMove(dir){
    player.pos.x+=dir
    if(collide(arena,player)){ 
        player.pos.x-=dir
    }
    
}
function draw(player){
    //only draw inside canvas size

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(player.matrix,player.pos);
    drawMatrix(arena,{x:0,y:0});
    
}

let drawCounter = 0;
let drawInterval = 1000; //1000 is one sec
let lastTime =0;

function update(time=0){
    const dt = time - lastTime;
    drawCounter += dt;

    //update every one sec
    if(drawCounter > drawInterval){
        console.log('updating...');
        console.log('player.pos.x...');
        console.log(player.pos.x);
        console.log('player.pos.y...');
        console.log(player.pos.y);
        playerDrop();
       
        
        console.table(arena);
    }
    
    draw(player);
    
    requestAnimationFrame(update);
    lastTime = time;
}

// keydown keyboard key is pressed down
document.addEventListener('keydown', event=>{
    if(event.keyCode == 37){
        playerMove(-1);
        // if(player.pos.x+player.matrix[0].length>3){
        //     player.pos.x-=1;
        // }
        
        
    }else if(event.keyCode == 39){
        playerMove(1);
        // if(player.pos.x+player.matrix[0].length<12){
        //     player.pos.x+=1;
        // }
   
    }else if(event.keyCode == 40){
        playerDrop();
    }
})
update();

