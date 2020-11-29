import React ,{Component} from 'react';
import '../componentCSS/error.css'
import tux from '../iplTeamsImages/tux.png'


class Error extends Component {

  constructor(props){
    super(props);

this.reload=this.reload.bind(this);

}

async reload(e){

    window.location.href="/home"
}






render(){


  return (

    <div>  
          

         <div id="section2">
         <p>Something went wrong !</p>
         </div>
          
          <div id="blank">

          <div id="section3">
                 Please make sure :
                <p>1. Use Laptop/PC</p> 
                <p>2. Metamask Extension is installed.</p>
                <p>3. Metamask Network should be 'ROPSTEN' Network</p>

          </div>

          </div>
      

        <div id="section4">
                 
        <button id="reloadButton"  onClick={this.reload}>Reload</button> 

        </div>
        <div id="section5">
        
            <img src={tux} id="tux"></img>

        </div>
        
     


    </div>
  




  );

};


}
  

export default Error;
