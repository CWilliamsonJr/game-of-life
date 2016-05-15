require('../styles/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let timerspeed = 200; // timer variable for the speed of generation. Located here for ease of chaning.

class GameBoard extends React.Component { // contains all of the cells
    constructor(props) {
        super(props);
        this.state = {
            cellcount: 40
        };

    }
    componentWillMount() {
        this.cells = this.GenerateNeighbors(); // makes the neighbors on page load
    }
    getCellState = (cell,storedCellState) => { // used to determine if a cell will live or die in the next generation
        let cells = this.cells;
        let neighborCount = 0;
        let state = 'dead';
        for (let cellprop in cells[cell]) {
            if (cellprop !== 'myLoc') {
                if (storedCellState[this.cells[cell][cellprop]] !== 'dead' && !!storedCellState[this.cells[cell][cellprop]] ) {
                    //console.log(this.cells);
                    ++neighborCount;
                }
            }
        }
        if (neighborCount <= 1) {
            state = 'dead';
        } else if (neighborCount === 2) {
            if (storedCellState[this.cells[cell].myLoc] === 'dead') {
                state = 'dead';
            } else {
                state = 'mature';
            }
        } else if (neighborCount === 3) {
            if (storedCellState[this.cells[cell].myLoc] === 'dead') {
                state = 'young';
            } else {
                state = 'old';
            }
        } else if (neighborCount >= 4) {
            state = 'dead';
        }
        //this.storedCellState[cell.myLoc] = state;
        return state;
    };

    MakeNeighbors = (location) => { // tells the cell what it's eight neighbors are
        let distance = this.state.cellcount;
        let myLoc = location;
        let neighbors = {};

        neighbors.myLoc = myLoc;
        neighbors.left = myLoc - 1;
        neighbors.right = myLoc + 1;
        neighbors.above = myLoc - distance;
        neighbors.below = myLoc + distance;
        neighbors.upperleft = myLoc - distance - 1;
        neighbors.upperright = myLoc - distance + 1;
        neighbors.lowerleft = myLoc + distance - 1;
        neighbors.lowerright = myLoc + distance + 1;

        neighbors = this.CheckEdges(neighbors);
        return neighbors;
    };

    GenerateNeighbors(cells = this.state.cellcount) { // makes the array for the neighbors
        const max = cells * cells
        const indexStart = 1;
        let grid = [];

        for (let i = indexStart; i <= max; i++) {
            grid[i] = this.MakeNeighbors(i);
        }

        return grid;
    };

    CheckEdges = (cell) => { // checks the cells on the boarder of the game and sets its this.neighbors to the other side.

        const horizontalStepCount = 1;
        const verticalStepCount = this.state.cellcount;
        let leftEdge,
            rightEdge,
            topEdge,
            bottomEdge = [];

        topEdge = this.MakeEdge(horizontalStepCount, horizontalStepCount);
        rightEdge = this.MakeEdge(verticalStepCount, verticalStepCount);
        leftEdge = this.MakeEdge(horizontalStepCount, verticalStepCount);
        bottomEdge = this.MakeEdge(leftEdge[leftEdge.length - 1], horizontalStepCount);

        let diffTopAndBottom = leftEdge[leftEdge.length - 1] - horizontalStepCount;

        if (rightEdge.indexOf(cell.myLoc) > -1) { // connects right edge to the left
            cell.right = leftEdge[rightEdge.indexOf(cell.myLoc)];
            cell.upperright = leftEdge[rightEdge.indexOf(cell.myLoc)] - verticalStepCount;
            cell.lowerright = cell.myLoc + 1;
        }else if (topEdge.indexOf(cell.myLoc) > -1) { // connects top to the bottom
            cell.above = bottomEdge[topEdge.indexOf(cell.myLoc)];
            cell.upperleft = cell.myLoc + diffTopAndBottom - 1;
            cell.upperright = cell.myLoc + diffTopAndBottom + 1;
        }else if (bottomEdge.indexOf(cell.myLoc) > -1) { // connects bottom to top
            cell.below = topEdge[bottomEdge.indexOf(cell.myLoc)];
            cell.lowerleft = cell.myLoc - diffTopAndBottom - 1;
            cell.lowerright = cell.myLoc - diffTopAndBottom + 1;
        } else if (leftEdge.indexOf(cell.myLoc) > -1) { // connects left to right
            cell.left = rightEdge[leftEdge.indexOf(cell.myLoc)];
            cell.upperleft = cell.myLoc - 1;
            cell.lowerleft = rightEdge[leftEdge.indexOf(cell.myLoc)] + verticalStepCount;
        }

        if (leftEdge.indexOf(cell.myLoc) > - 1 && topEdge.indexOf(cell.myLoc) > - 1) { // connects upper left corner to lower right corner
            cell.upperleft = bottomEdge[bottomEdge.length - 1];
            cell.left = topEdge[topEdge.length - 1];
        }else if (rightEdge.indexOf(cell.myLoc) > - 1 && topEdge.indexOf(cell.myLoc) > - 1) { // connects uppper right corner to lower left corner
            cell.lowerright = cell.myLoc + 1;
            cell.upperright = topEdge[0] + diffTopAndBottom;
        }else if (leftEdge.indexOf(cell.myLoc) > - 1 && bottomEdge.indexOf(cell.myLoc) > - 1) { // connects lower left corner to upper right corner
            cell.upperleft = bottomEdge[bottomEdge.length - 1] - verticalStepCount;
            cell.lowerleft = bottomEdge[bottomEdge.length - 1] - diffTopAndBottom;
        }else if (rightEdge.indexOf(cell.myLoc) > - 1 && bottomEdge.indexOf(cell.myLoc) > - 1) { // connects lower right to upper left
            cell.lowerright = topEdge[0];
            cell.upperright = bottomEdge[0] - verticalStepCount;
        }


        return cell;
    };
    MakeEdge = (startPos, stepCount) => { // determines which cells are boarder cells
        let count = this.state.cellcount;
        let edge = [];
        while (count-- > 0) {
            edge.push(startPos);
            startPos += stepCount;
        }
        return edge;
    };




    render() {

        return (
            <div className='container'>
                <div className='row'>
                    <div className='cell-container' >
                        <LifeCell cellState={this.getCellState} cellcount={this.state.cellcount}/>
                    </div>
                </div>
            </div>
        );
    };
}

class LifeCell extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        //this.MakeGrid(); // does the inital seeding of the cells
        this.time_btn_text = 'Pause Timer';
    }
    componentDidMount() {
           this.genTimer = setInterval(this.Generation,timerspeed); // starts timer on page load
          this.stop = false; // used to determine whether or not the stop the timer
    }
    componentWillUnmount() {
         clearInterval(this.genTimer); // clears timer on page unload
    }
    Generation = () =>{ // does the cell cyles for the board

        let cells = this.props.cellcount;
        const max = cells * cells
        const indexStart = 1;
        let cellStatus = [];

        for (let i = indexStart; i <= max; i++) {
         cellStatus[i] = this.refs[i].className;
       }
        cellStatus = cellStatus.map((element,index,array)=>{
            if(!!element){
                 return element = this.props.cellState(index,array);
            }
        });
        for (let i = indexStart; i <= max; i++) {
         this.refs[i].className = cellStatus[i] ;
       }
    };

    Addlife =(cell) => { // allows for manually setting a cell alive or dead
        if(this.refs[cell].className === 'dead'){
            this.refs[cell].className = 'young';
        }else{
            this.refs[cell].className = 'dead';
        }
     };

    MakeGrid = (cells = this.props.cellcount) => { // makes the grid for the game
        const max = cells * cells
        const indexStart = 1;
        let cellStates = ['mature','mature','mature','dead','dead','dead','dead' ]; // used to generate the board
        let cellStatus = [];
        for (let i = indexStart; i <= max; i++) {
           let startState = Math.floor(Math.random() * (cellStates.length - 0) + 0);
           cellStatus[i] = cellStates[startState];
       }
       return cellStatus;
        //this.setState({storedCellStates:cellStatus});
    };

    Timer = () =>{ //starts and stops the timer
        this.stop = !this.stop;
        if(this.stop){
             clearInterval(this.genTimer);
             $('#time_btn').text('Resume Timer');
        }else {
             this.genTimer = setInterval(this.Generation,timerspeed);
             $('#time_btn').text('Pause Timer');
        }
    };

    Step = () =>{ // goes through the generation cycles one step at a time
        if(this.stop){
             this.Generation();
        }
    };
    ClearBoard = () =>{
        let cells = this.props.cellcount;
        const max = cells * cells
        const indexStart = 1;

        for (let i = indexStart; i <= max; i++) {
         this.refs[i].className = 'dead';
       }
       this.stop = false;
       this.Timer();
   };

    render() {
        let cellStates = this.MakeGrid(); // sets cellStates to the states of the cells on the board
        return (
            <div>
            <div className='cell-board'>
                {cellStates.map((element,index,array)=>{ // prints cell states to the board
                    if(!!element){
                         return (<div title={'cell '+index} ref={index} onClick={()=>this.Addlife(index)} id={index} key={index} className={element} ></div>)
                    }
                })}
            </div>
                <ButtonGroup clear={()=>this.ClearBoard()} stop={()=>this.Timer()} step={()=>this.Step()} newBoard={()=>this.MakeGrid()} /> {/*Buttons to control the board */}
            </div>

        );
    };
}

class ButtonGroup extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className='ctrl_btns'>
                <button id='time_btn' onClick={()=>this.props.stop()}>Pause Timer</button>
                <button onClick={()=>this.props.step()}>Step</button>
                <button onClick={()=> this.props.newBoard()}>Random</button>
                <button onClick={()=> this.props.clear()}>Clear Board</button>
            </div>
        );
    }
}

const content = document.getElementById('content'); ReactDOM.render(
<GameBoard/>, content);
