const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20,20);
//*********************global variables*********************//
const matrix_t =[
    [0,0,0],
    [1,1,1],
    [0,1,0],
];

const player ={
    matrix: matrix_t,
    pos: {x:5,y:5}

};

const colors =[
    null,
    'red',
    'blue',
    'violet',
    'green',
    'purple',
    'orange',
    'pink',
];

//canvas width is 240, height is 400. We want to divide canvas by matrix. 
//Since scale is 20, the matrix is 12 * 20
//create empty matrix filled with zero
const arena = createMatrix(12,20);  

let drawCounter = 0;
let drawInterval = 1000; //1000 is one sec
let lastTime =0;

//*********************functions*********************//
function createMatrix(w,h){
    const matrix =[];
    while(h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}


function createPiece(type)
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

function playerReset(){
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[Math.floor(pieces.length*Math.random())])
    player.pos.x = Math.floor(arena.length / 2) - Math.floor(player.matrix[0].length);
    player.pos.y = 0;

    if(collide(arena,player)){
        console.log('full..........');
        arena.forEach(row=>row.fill(0));
    }

}

function cancelRow(){
    outer: for(let row=arena.length-1; row>=0; row--){
        for(let col=0; col<arena[row].length; col++){
            if(arena[row][col]===0){
                continue outer;
            }
        }
        //if not found 0
        const deletedRow = arena.splice(row,1)[0].fill(0);
        arena.unshift(deletedRow); // put on top of the arena matrix
        row++;

    }
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
                context.fillStyle =colors[value];
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
//search which tile in matrix collide with tile in arena
function collide(arena,player){
    const [ma,pos] = [player.matrix,player.pos];
  
    for(let i=0; i<ma.length; i++){
        for(let j=0; j<ma[i].length; j++){
            // if row do not exist, means out of canvas
            if(!arena[i+pos.y]){
                if (ma[i][j] !==0){
                    //when out of bound arena[i+pos.y][j+pos.x] is undefined
                    console.log('colliding bottom....');   
                    return true;
                }else{
                    continue;
                }

            }
            else{
                if ((ma[i][j] !==0) &&(arena[i+pos.y][j+pos.x] !==0)){
                    //when out of bound arena[i+pos.y][j+pos.x] is undefined
                    console.log('colliding....');        
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
        playerReset();
        cancelRow();
    }

}

function playerMove(dir){
    player.pos.x+=dir
    if(collide(arena,player)){ 
        console.log('colliding left/right');
        player.pos.x-=dir
    }
    
}

function rotate(matrix,dir){
    for(i=0; i<matrix.length; i++){
        for(j=0; j<i; j++){
            [
                matrix[i][j],
                matrix[j][i]
            ]=
            [
                matrix[j][i],
                matrix[i][j]
            ]
        }
    }

    if(dir>0){
        matrix.forEach(row=>row.reverse());
        
    }else if(dir<0){
        matrix.reverse()
    }
}

function playerRotate(dir){

    rotate(player.matrix,dir);

    if(collide(arena,player)){ 
        console.log('colliding not not able to rotate');
        rotate(player.matrix,-dir);
    }

}

function draw(player){
    //only draw inside canvas size

    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(player.matrix,player.pos);
    drawMatrix(arena,{x:0,y:0});
    
}


function update(time=0){
    const dt = time - lastTime;
    drawCounter += dt;

    //update every one sec
    if(drawCounter > drawInterval){
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
    }else if(event.keyCode == 40){
        playerDrop();
    }else if(event.keyCode == 81){
        playerRotate(-1);
    }else if(event.keyCode == 87){
        playerRotate(1);
    }
})
update();

