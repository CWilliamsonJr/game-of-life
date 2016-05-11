require('../styles/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let timerspeed = 100; // timer variable for the speed of generation. Located here for ease of chaning.

class GameBoard extends React.Component { // contains all of the cells
    constructor(props){
        super(props);
        this.state ={cellcount:40}

    }
    getCellState = (cell) =>{

        let neighborCount = 0;
        let state;
        for( let cellprop in cell){
            if(cell[cellprop] !== cell.myLoc){
                if(this.storedCellState[cell[cellprop]] !== 'dead'){
                    ++neighborCount;
                }
            }
        }
        if( neighborCount < 2 ){
            state = 'dead';
        }else if( neighborCount === 2 ){
            state = 'mature';
        }else if(neighborCount === 3 ){
            if(this.storedCellState[cell.myLoc] === 'dead'){
                state = 'young';
            }else{
                state = 'old';
            }
        }else if(neighborCount > 3){
            state = 'dead';
        }
        this.storedCellState[cell.myLoc] = state;
        return state;
    }
    MakeGrid = (cells = this.state.cellcount) =>{  // makes the grid for the game
        const max = cells * cells
        const indexStart = 1;
        let cellStates = ['mature','dead','dead','dead','dead','dead','dead','dead'];
        let grid = [];
        this.storedCellState = []
         for(let i = indexStart; i <= max; i++){
             let startState = Math.floor(Math.random() * (cellStates.length - 0) + 0);
             grid[i] = <LifeCell myState={this.getCellState} startCellstate={cellStates[startState]} XbyY={cells} validCells={this.CheckEdges} loc={i} key={i} />;
             this.storedCellState[i] = cellStates[startState];
         }
         console.log(this.refs.test);
         return grid;
     };
     CheckEdges = (cell) =>{ // checks the cells on the boarder of the game and sets its this.neighbors to the other side.

         const horizontalStepCount = 1;
         const verticalStepCount = this.state.cellcount;
         let leftEdge, rightEdge,topEdge,bottomEdge = [];

         topEdge = this.MakeEdge(horizontalStepCount,horizontalStepCount);
         rightEdge = this.MakeEdge(verticalStepCount,verticalStepCount);
         leftEdge = this.MakeEdge(horizontalStepCount,verticalStepCount);
         bottomEdge = this.MakeEdge(leftEdge[leftEdge.length - 1],horizontalStepCount);

         let diffTopAndBottom = leftEdge[leftEdge.length - 1] - horizontalStepCount;


         if(rightEdge.indexOf(cell.myLoc) > -1 ){ // connects right edge to the left
             cell.right = cell.myLoc - verticalStepCount;
             cell.upperright = cell.myLoc - verticalStepCount - 1;
             cell.lowerright = cell.myLoc - verticalStepCount + 1;
         }
         if(topEdge.indexOf(cell.myLoc) > -1 ){  // connects top to the bottom
             cell.above = cell.myLoc + diffTopAndBottom;
             cell.upperleft = cell.myLoc + diffTopAndBottom;
             cell.upperright = cell.myLoc + diffTopAndBottom + 1;
         }

         if(bottomEdge.indexOf(cell.myLoc) > -1 ){ // connects bottom to top
             cell.below = cell.myLoc - diffTopAndBottom;
             cell.lowerleft = cell.myLoc - diffTopAndBottom - 1;
             cell.lowerright = cell.myLoc - diffTopAndBottom + 1;
         }

         if(leftEdge.indexOf(cell.myLoc) > -1 ){ // connects left to right
             cell.left = cell.myLoc + verticalStepCount;
             cell.upperleft = cell.myLoc + verticalStepCount - 1;
             cell.lowerleft = cell.myLoc + verticalStepCount + 1;
         }
         if(leftEdge.indexOf(cell.myLoc) > - 1 && topEdge.indexOf(cell.myLoc) > - 1){ // connects upper left corner to lower right corner
             cell.upperleft = bottomEdge[bottomEdge.length - 1];
             cell.left = topEdge[topEdge.length - 1];
             cell.lowerleft = topEdge[topEdge.length - 1] - 1;
         }
         if(rightEdge.indexOf(cell.myLoc) > - 1 && topEdge.indexOf(cell.myLoc) > - 1){ // connects uppper right corner to lower left corner
             cell.lowerright = cell.myLoc + 1 ;
             cell.right = topEdge[0];
             cell.upperright =  topEdge[0] + diffTopAndBottom ;
         }
         if(leftEdge.indexOf(cell.myLoc) > - 1 && bottomEdge.indexOf(cell.myLoc) > - 1){ // connects lower left corner to upper right corner
             cell.upperleft = bottomEdge[bottomEdge.length - 1] - verticalStepCount ;
             cell.left = bottomEdge[bottomEdge.length - 1];
             cell.lowerleft = bottomEdge[bottomEdge.length - 1] - diffTopAndBottom;
         }
         if(rightEdge.indexOf(cell.myLoc) > - 1 && bottomEdge.indexOf(cell.myLoc) > - 1){ // connects lower right to upper left
             cell.lowerright = topEdge[0];
             cell.right = bottomEdge[0];
             cell.upperright =  bottomEdge[0] - verticalStepCount ;
         }

         return cell;
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
        this.state = {life:'dead'};
        this.MyNeighbors();
    }
    componentWillMount(){
        this.setState({life:this.props.startCellstate});

        //this.life = this.props.startCellstate;

    }
    componentDidMount(){
        this.genTimer = setInterval(this.setCellState,timerspeed);
    }
    componentWillUnmount(){
        clearInterval(this.genTimer);
    }
    showLoc = () =>{
        //  console.log(`current location is ${this.props.loc}`);
        //  console.log(this.MyNeighbors());
        if(this.state.life === 'dead'){
            this.setState({life:'mature'});
        }else{
            this.setState({life:'dead'});
        }
    };
    MyNeighbors = () =>{ // tells the cell what it's eight neighbors are
        let distance = this.props.XbyY;
        let myLoc = this.props.loc;
        this.neighbors ={};

        this.neighbors.myLoc = myLoc;
        this.neighbors.left = myLoc - 1;
        this.neighbors.right = myLoc + 1;
        this.neighbors.above = myLoc - distance;
        this.neighbors.below = myLoc + distance;
        this.neighbors.upperleft = myLoc - distance - 1;
        this.neighbors.upperright = myLoc - distance + 1;
        this.neighbors.lowerleft = myLoc + distance -  1;
        this.neighbors.lowerright = myLoc + distance + 1;

        return this.props.validCells(this.neighbors); // checks to be sure its neighbors are valid

    };
    setCellState = () =>{

        let state = this.props.myState(this.neighbors);
        this.setState({life:state});
        //this.life = state;
    }
    render(){

        return(
            <div>
                <div id={'cell_'+this.props.loc} onClick={() => this.showLoc()} className={this.state.life}></div>
            </div>
        );
    };
}


const content = document.getElementById('content');
ReactDOM.render(
    <GameBoard/>, content);
