import React ,{Component} from 'react';
import '../componentCSS/admin.css'
import Election from '../abis/contracts/Election.json'
import csk from '../iplTeamsImages/csk.png'
import mi from '../iplTeamsImages/mi.png'
import dc from '../iplTeamsImages/dc.png'
import rcb from '../iplTeamsImages/rcb.png'
import srh from '../iplTeamsImages/srh.png'
import kp from '../iplTeamsImages/kp.png'
import kkr from '../iplTeamsImages/kkr.png'
import rr from '../iplTeamsImages/rr.png'


class Admin extends Component {

  constructor(props){
    super(props);

   

    this.startVoting=this.startVoting.bind(this);
    this.endVoting=this.endVoting.bind(this);
    this.showResult=this.showResult.bind(this);
    this.getWinner=this.getWinner.bind(this);



    this.state = {
        currentAccount:'',
        organiser:'',
        status:'',
        votes:'',

      
    };

}



async componentWillMount(){
  
    await this.loadBlockchainData()
  
  }
  

async loadBlockchainData(){
    
      if(!window.web3){
        window.location.href="error";
      }
    const web3 = window.web3;
    const account = await web3.eth.getCoinbase();
    
    this.setState({
   
        currentAccount: account,
      });

    const networkId = await web3.eth.net.getId();
    if(networkId!='3'){
        window.alert("You are on wrong Network.Please select 'ROPSTEN' network from metamask");
        window.location.href="/error";
    }
    else{
         
         const networkData = Election.networks[networkId];
         const election = new web3.eth.Contract(Election.abi, networkData.address);
          //updating organiser
         election.methods.organiser().call({from:this.state.currentAccount},(err,hash)=>{

          if(err){
            window.alert(err);
          }
          else{ 
            var HASH=hash.toLowerCase();
            this.setState({
   
              organiser:HASH
            });

            
          }
         });

         //updating status
         


         election.methods.status().call({from:this.state.currentAccount},(err,hash)=>{

          if(err){
            window.alert(err);
          }
          else{ 
            this.setState({
   
             status:hash
            });
           

            
          }
         });

        
    }





}




async startVoting(e){
    e.preventDefault();
    const networkId = await window.web3.eth.net.getId();
    const election = new window.web3.eth.Contract(Election.abi, Election.networks[networkId].address);
    election.methods.startVoting().send({from:this.state.currentAccount},(err,hash)=>{
      if(err){
        window.alert(err)
      }
      else{
        window.alert("success");
        this.setState({
   
          status:true
         });
      }
    });




}
async endVoting(e){
    e.preventDefault();

    const networkId = await window.web3.eth.net.getId();
    const election = new window.web3.eth.Contract(Election.abi, Election.networks[networkId].address);
    election.methods.endVoting().send({from:this.state.currentAccount},(err,hash)=>{
      if(err){
        window.alert(err)
      }
      else{
        window.alert("success");
        this.setState({
   
          status:false
         });

         election.methods.getResult().call({from:this.state.currentAccount},(err,hash)=>{
          if(err){
            window.alert(err)
          }
          else{
            window.alert("success");
            this.setState({
       
              votes:hash
             });
             
          
    
          }
        })
        
        



      }
    });


}

async showResult(e){
    e.preventDefault();
    const networkId = await window.web3.eth.net.getId();
    const election = new window.web3.eth.Contract(Election.abi, Election.networks[networkId].address);
    election.methods.getResult().call({from:this.state.currentAccount},(err,hash)=>{
      if(err){
        window.alert(err)
      }
      else{
        window.alert("success");
        this.setState({
   
          votes:hash
         });
          // display table
          var table=document.getElementById('tablesection');
          table.style.visibility='visible'
         
      

      }
    })
    
}

async getWinner(e){
  e.preventDefault();
  if(this.state.status==true)
  {
    window.alert("Voting is still LIVE !")

  }
  else{  
      
    var votes=this.state.votes;
    var maxPosition=0
    var maxVotesCount=parseInt(votes[0]);
    for(var i=1;i<8;i++){
      if(parseInt(votes[i])>maxVotesCount)
      {
        maxVotesCount=parseInt(votes[i]);
        maxPosition=i
      }
    }
     this.openModal(maxPosition);
  }
  
}

async closeModal(e){
  e.preventDefault();
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  
  
  
}
async openModal(maxPosition){
  
  var teamNames=["Chennai Super Kings","Mumbai Indians","Royals Challengers Bangalore","Delhi Capitals","Sun Risers Hyderabad","Rajasthan Royals","Kolkata Knight Riders","Kings XI Punjab"]
  var logos=[csk,mi,rcb,dc,srh,rr,kkr,kp]
  var winner=teamNames[maxPosition];
  
  var header=document.getElementById('teamname')
  header.innerHTML=winner;

  var logo=document.getElementById('teamLogo')
  logo.src=logos[maxPosition];
  logo.style.width="200px"
  logo.style.height="200px"


  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}


render(){


  return (

    <div>  

                    <div id="adminHeader">

                            Admin Control Panel

                    </div>

                 <div id="controlButton"> 

                    <div id="leftAlign"> 


                        <div class="butSection">
                          <a  class="button js-button" role="button" onClick={this.startVoting}>Start Voting</a>
                          </div>

                          <div class="butSection">
                          <a  class="button js-button" role="button" onClick={this.endVoting}>Stop Voting</a>
                        </div>

                    </div>

                    <div id="rightAlign">
                             
                          <div class="butSection">
                            <a  class="button js-button" role="button" onClick={this.showResult}>Show Result</a>
                            </div>
                            <div class="butSection">
                            <a  class="button js-button" role="button" onClick={this.getWinner}>Get Winner</a>
                            </div>

                    </div>
        

                 </div>



                 <div id="tablesection">
                             <table id="table" border="1px" >
                                  <tbody>
                                    
                                  <tr> 
                                    <th><span class="row1">TEAMS</span></th>
                                    <th><span class="row1">Number of Votes</span></th>
                                 </tr>
                                 <tr> 
                                    <td>Chennai Super Kings</td>
                                    <td>{this.state.votes[0]}</td>
                                 </tr>
                                 <tr> 
                                    <td>Mumbai Indians</td>
                                    <td>{this.state.votes[1]}</td>
                                 </tr>
                                 <tr> 
                                    <td>Royal Challengers Bangalore</td>
                                    <td>{this.state.votes[2]}</td>
                                 </tr>
                                 <tr> 
                                    <td>Delhi Capitals</td>
                                    <td>{this.state.votes[3]}</td>
                                 </tr>
                                 <tr> 
                                    <td>Sun Risers Hyderabad</td>
                                    <td>{this.state.votes[4]}</td>
                                 </tr>
                                 <tr> 
                                    <td>Rajasthan Royals</td>
                                    <td>{this.state.votes[5]}</td>
                                 </tr>
                                 <tr> 
                                    <td>Kolkata Knight Riders</td>
                                    <td>{this.state.votes[6]}</td>
                                 </tr><tr> 
                                    <td>Kings XI Punjab</td>
                                    <td>{this.state.votes[7]}</td>
                                 </tr>


                                  </tbody>
                                  


                              </table>
                </div>





                <div id="myModal" class="modal">

                   
                    <div class="modal-content">
                      <div class="modal-header" >
                        <span class="close" onClick={this.closeModal}> &times;</span>
                          <div id="teamname">
                           <h2><b>team name</b></h2>
                          </div>
                           
                      </div>
                      <div class="modal-body" id="logo">
                          
                      <img src="" class="teamsImg" id="teamLogo" ></img>
                       
                        
                      </div>
                     
                    </div>

                </div>


    </div>
  




  );

};


}
  

export default Admin;
