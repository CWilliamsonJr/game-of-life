require('../styles/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';

class GameBoard extends React.Component { // contains all of the cells
    constructor(props){
        super(props);
        this.state ={cellcount:40}

    }
    MakeGrid = (cells = this.state.cellcount) =>{  // makes the grid for the game
        const max = cells * cells
        const indexStart = 1;
         let grid = [];
         for(let i = indexStart; i <= max; i++){
             grid[i] = <LifeCell XbyY={cells} validCells={this.CheckEdges} loc={i} key={i} />;
         }
         return grid;
     };
     CheckEdges = (cell) =>{ // checks the cells on the boarder of the game to set relevant neighbors to NaN
         const verticalStepCount = this.state.cellcount;
         const horizontalStepCount = 1;
         let leftEdge, rightEdge,topEdge,bottomEdge = [];

         topEdge = this.MakeEdge(horizontalStepCount,horizontalStepCount);
         rightEdge = this.MakeEdge(verticalStepCount,verticalStepCount);
         leftEdge = this.MakeEdge(horizontalStepCount,verticalStepCount);
         bottomEdge = this.MakeEdge(leftEdge[leftEdge.length - 1],horizontalStepCount);

         let diffTopAndBottom = leftEdge[leftEdge.length - 1] - horizontalStepCount;


         if(rightEdge.indexOf(cell.myLoc) > -1 ){
             cell.right = cell.myLoc - verticalStepCount;
             cell.upperleft = cell.myLoc - verticalStepCount - 1;
             cell.lowerright = cell.myLoc - verticalStepCount + 1;
         }
         if(topEdge.indexOf(cell.myLoc) > -1 ){
             cell.above = cell.myLoc + diffTopAndBottom;
             cell.upperleft = cell.myLoc + diffTopAndBottom;
             cell.upperright = cell.myLoc + diffTopAndBottom + 1;
         }

         if(bottomEdge.indexOf(cell.myLoc) > -1 ){
             cell.below = cell.myLoc - diffTopAndBottom;
             cell.lowerleft = cell.myLoc - diffTopAndBottom - 1;
             cell.lowerright = cell.myLoc - diffTopAndBottom + 1;
         }

         if(leftEdge.indexOf(cell.myLoc) > -1 ){
             cell.left = cell.myLoc + verticalStepCount;
             cell.upperleft = cell.myLoc + verticalStepCount - 1;
             cell.lowerleft = cell.myLoc + verticalStepCount + 1;
         }
         if(leftEdge.indexOf(cell.myLoc) > - 1 && topEdge.indexOf(cell.myLoc) > - 1){
             cell.upperleft = bottomEdge[bottomEdge.length - 1];
             cell.left = topEdge[topEdge.length - 1];
             cell.lowerleft = topEdge[topEdge.length - 1] - 1;
         }
         if(rightEdge.indexOf(cell.myLoc) > - 1 && topEdge.indexOf(cell.myLoc) > - 1){
             cell.lowerright = cell.myLoc + 1 ;
             cell.right = topEdge[0];
             cell.upperright =  topEdge[0] + diffTopAndBottom ;
         }
         if(leftEdge.indexOf(cell.myLoc) > - 1 && bottomEdge.indexOf(cell.myLoc) > - 1){
             cell.upperleft = bottomEdge[bottomEdge.length - 1] - verticalStepCount ;
             cell.left = bottomEdge[bottomEdge.length - 1];
             cell.lowerleft = bottomEdge[bottomEdge.length - 1] - diffTopAndBottom;
         }
         if(rightEdge.indexOf(cell.myLoc) > - 1 && bottomEdge.indexOf(cell.myLoc) > - 1){
             cell.lowerright = topEdge[0];
             cell.right = bottomEdge[0];
             cell.upperright =  bottomEdge[0] - verticalStepCount ;
         }



         return cell;
        //  console.log(`leftEdge is is ${leftEdge}`);
        //  console.log(`rightEdge is is ${rightEdge}`);
        //  console.log(`topEdge is is ${topEdge}`);
        //  console.log(`bottomEdge is is ${bottomEdge}`);
     };
     MakeEdge = (startPos,stepCount) =>{ // determines which cells are boarder cells
         let count = this.state.cellcount;
         let edge = [];
         while(count --> 0 ){
            edge.push(startPos);
            startPos += stepCount;
         }
         return edge;
     };
    render(){
        let grid = this.MakeGrid();
        //this.CheckEdges();
        return(
            <div className='container'>
                <div className='row'>
                    <div className='cell-board'>
                        {grid}
                    </div>
                </div>
            </div>
        );
    };
}

class LifeCell extends React.Component {
    constructor(props){
        super(props);

    }
    showLoc = () =>{
        console.log(`current location is ${this.props.loc}`);
        console.log(this.MyNeighbors());
    };
    MyNeighbors = () =>{ // tells the cell what it's eight neighbors are
        let distance = this.props.XbyY;
        let myLoc = this.props.loc;
        let neighbors ={};

        neighbors.myLoc = myLoc;
        neighbors.left = myLoc - 1;
        neighbors.right = myLoc + 1;
        neighbors.above = myLoc - distance;
        neighbors.below = myLoc + distance;
        neighbors.upperleft = myLoc - distance - 1;
        neighbors.upperright = myLoc - distance + 1;
        neighbors.lowerleft = myLoc + distance -  1;
        neighbors.lowerright = myLoc + distance + 1;

        return this.props.validCells(neighbors); // checks to be sure its neighbors are valid

    };

    render(){

        return(
            <div id={'cell_'+this.props.loc} onClick={() => this.showLoc()} className='cell dead'></div>
        );
    };
}


const content = document.getElementById('content');
ReactDOM.render(
    <GameBoard/>, content);
