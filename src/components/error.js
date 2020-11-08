import React ,{Component} from 'react';
import '../componentCSS/error.css'


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

    <div id="section1">  
          

         <div id="section2">
         <p>Something went wrong !</p>
         </div>
         
        <div id="section3">
                <p> <b> Please make sure :</b></p>  
                <p>1. Use Laptop/pc</p> 
                <p>2. Metamask Extension is installed.</p>
                <p>3. Metamask Network should be 'ROPSTEN' Network</p>

        </div>

        <div id="section4">
                 
        <a  class="button js-button" role="button" onClick={this.reload}>Reload</a>

        </div>
        
     


    </div>
  




  );

};


}
  

export default Error;
