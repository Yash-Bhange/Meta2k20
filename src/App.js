import React ,{Component} from 'react';
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';
import './App.css';
import Web3 from 'web3';

import Admin from './components/administratator.js'
import Home from './components/home.js'
import Error from './components/error.js'

class App extends Component{  
  //constructor
  constructor(props){
    super(props);

    //rather knife order text future sheriff spend upon love victory remember keep

    
    
  };



  async componentWillMount(){
    await this.loadWeb3()
    
  
  }


  async loadWeb3(){
    if(window.ethereum){
      window.web3=new Web3(window.ethereum); //new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));   //
  
      await window.ethereum.enable();
    }
    else if(window.web3)
    {
      window.web3=new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('MetaMask Extension  not detected !');
      
    }
  
  }


  render(){
           
    return (
     <div>


                    <BrowserRouter>
                
                              <Switch>
                                    <Route exact path="/admin" component={()=><Admin />} />
                                    <Route exact path="/home" component={()=><Home />} />
                                    <Route exact path="/error" component={()=><Error />} />
                                    <Redirect to="/home" />

                                    
                                    
                                      
                              </Switch>
                
                </BrowserRouter>



       
      </div>
    );



  }
 
}

export default App;
