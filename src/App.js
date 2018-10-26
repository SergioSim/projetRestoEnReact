import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      restos: [],
      isLoading: false,
      error: null,
      nbResto: 10,
      page: 1,
      maxpage: 1
    };
  }

  handleSelect(event){
    this.setState({nbResto:event.target.value},() => this.componentDidMount());
  }

  getMaxpage(respHandler){
    fetch("http://localhost:8080/api/restaurants/count")
      .then(response => {
        return response.json();
      }).then(resp => {
        let maxpagevalue = Math.ceil(resp.data/this.state.nbResto)-1;
        this.setState({maxpage: maxpagevalue, page:maxpagevalue})
      }).then(resp => {
        respHandler();
      });
  }

  navigate(event){
    let butn = event.target.innerText;
    let bid = event.target.id;
    let i = 0;
    let num = 1;
    if(butn === 'max'){
      this.getMaxpage(() => {
        this.changeButtons(0,this.state.page-2,this.state.page-1);
        this.componentDidMount();
      });
      return;

    }else if(butn !== 'min'){
      num = parseInt(butn);
      if(bid === "secondButton" && num > 2){
        this.setState({page: num}, () => this.componentDidMount());
        this.changeButtons(-1);
        return;
      }else if(bid === "thirdButton"){
        this.getMaxpage(() => {
          if(num <= this.state.maxpage){
            this.setState({page: num}, () => this.componentDidMount());
            if(num !== this.state.maxpage){
              this.changeButtons(1);
            }
          }
        });
        return
      }
    }
    this.setState({page: num}, () => this.componentDidMount());
    this.changeButtons(0,2,3);
  }

  changeButtons(i=0,b=0,c=0){
    if(b===0 && c===0){
      b = document.querySelector('#secondButton').innerHTML;
      c = document.querySelector('#thirdButton').innerHTML;
    }
    document.querySelector('#secondButton').innerHTML = parseInt(b) + i;
    document.querySelector('#thirdButton').innerHTML = parseInt(c) + i;
  }

  showRestaurant(event){
    console.log(event);
  }

  removeRestaurant(event,id,resto){
    console.log(event);
    let url = "http://localhost:8080/api/restaurants/" + resto._id;
    console.log("url " + url);
    fetch(url, {
      method: 'delete'
    }).then(response => {
      console.log(response);
      this.componentDidMount();
    });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch('http://localhost:8080/api/restaurants?page=' + this.state.page + "&pagesize=" + this.state.nbResto)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      }).then((restos) => { 
        const restosdata = restos.data;
        this.setState({ restos: restosdata, isLoading: false }); //pour quoi restos.data ne marche pas ?
        console.log(restosdata);
        console.log("page = " + this.state.page);
      }).catch(error => this.setState({ error, isLoading: false }));
  }
  render() {

    let loading = () => {
      if(this.state.isLoading){
        return("Loading...");
      }
    }
    if (this.state.error) {
      return <p>{this.state.error.message}</p>;
    }
    let listeRestos = this.state.restos.map( (resto, id) => {
      return(
        <tr v-for="(restaurant,index) in filteredrestaurants" key={id}>
          <td>{resto.name}</td>
          <td>{resto.cuisine}</td>
          <td>
            <button className="btn btn-dark" value={resto} onClick={(event,index) => this.showRestaurant(event,index,resto)}><i className="fa fa-edit"></i></button>
            <button className="btn btn-dark" value={resto} onClick={(event, index) => this.removeRestaurant(event,index,resto)}><i className="fa fa-trash"></i></button>
          </td>
        </tr>
      )}
    );
    return (
      <div className="App">
        <header className="App-header">

          <h2>Table des Restaurants</h2>
          <h3>{loading()}</h3>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
                <label className="label label-default">Elements par page</label>
            </div>
            <select className="custom-select" id="elementPageDropDown" defaultValue="10" onChange={(event) => this.handleSelect(event)}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
            </select>
          </div>
          <div className="input-group mb-3">
            <input id="searchInput" className="form-control"
                    placeholder="Chercher par nom"/>
          </div>
          <table className="table table-bordered" id="myTable">
            <thead className="thead-dark">
            <tr>
                <th>Nom</th>
                <th>Cuisine</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
              {listeRestos}
            </tbody>
            </table>
            <div className="navigation">
                    <button type="button" className="btn btn-dark" id="firstButton" onClick={(event) => this.navigate(event)}>min</button>
                    <button type="button" className="btn btn-dark" id="secondButton" onClick={(event) => this.navigate(event)}>2</button>
                    <button type="button" className="btn btn-dark" id="thirdButton" onClick={(event) => this.navigate(event)}>3</button>
                    ......................
                    <button type="button" className="btn btn-dark" id="lastPageButton" onClick={(event) => this.navigate(event)} > max </button>
            </div>
        </header>
      </div>
    );
  }
}

export default App;
