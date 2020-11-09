import React ,{Component} from 'react';
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';
import '../componentCSS/home.css';
import csk from '../iplTeamsImages/csk.png'
import mi from '../iplTeamsImages/mi.png'
import dc from '../iplTeamsImages/dc.png'
import rcb from '../iplTeamsImages/rcb.png'
import srh from '../iplTeamsImages/srh.png'
import kp from '../iplTeamsImages/kp.png'
import kkr from '../iplTeamsImages/kkr.png'
import rr from '../iplTeamsImages/rr.png'
import wlugImg from '../iplTeamsImages/WLUG.jpg'
import Election from '../abis/contracts/Election.json'



class Home extends Component{  
  //constructor
  constructor(props){
    super(props);

    

    this.state = {
      currentAccount:'',
      organiser:'',
      status:'',
      chossenTeam:'-1',
      chossenTeamName:''
    
  };

  this.adminEntry=this.adminEntry.bind(this);
  this.vote=this.vote.bind(this);
  this.finalVote=this.finalVote.bind(this);
  this.loadStatus=this.loadStatus.bind(this);
  this.closeModal=this.closeModal.bind(this);
  this.addLoader=this.addLoader.bind(this);
  this.winner=this.winner.bind(this);
  this.result=this.result.bind(this);

    
  };


  async componentWillMount(){
  
    await this.loadBlockchainData();
 
  
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
         console.log(networkData.address)

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
          //updatiing status
         election.methods.status().call({from:this.state.currentAccount},(err,hash)=>{

          if(err){
            window.alert(err);
          }
          else{ 
            this.setState({
   
             status:hash
            });
            this.loadStatus();

            
          }
         });

        

        
    }





}





async adminEntry(e){
  e.preventDefault();
 
  if(this.state.currentAccount!=this.state.organiser)
  {
      window.alert("Normal User are not allowed");
      
  }else{
      window.location.href="/admin";
  }
}

async result(){
   
  if(this.state.status==true){
    window.alert("Voting is still LIVE")
  }
  else{

  }



}

async winner(){

  if(this.state.status==true){
    window.alert("Voting is still LIVE")
  }
  else
  {

  }

}





async vote(e){
  e.preventDefault();
  var id=e.target.id;
  var teamName=id.slice(1);
  this.setState({
   
    chossenTeam:id[0],
    chossenTeamName:teamName
  });

  var modal = document.getElementById("myModal");
  modal.style.display = "block";

}

async closeModal(e){
  e.preventDefault();
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  this.setState({
   
    chossenTeam:'-1',
    chossenTeamName:''
  });
  window.location.href="/home"
  
  
}


async finalVote(e){
  e.preventDefault();
    
   if(this.state.status==false){
     window.alert("Voting has not started yet !")
    
   }
   else{  



            const networkId = await window.web3.eth.net.getId();
            const election = new window.web3.eth.Contract(Election.abi, Election.networks[networkId].address);
            
            election.methods.check().call({from:this.state.currentAccount},(err,hash)=>{
              if(err){
                window.alert(err);
              }
              else{
                if(hash==false){
                    window.alert("you cannot vote again !")
                    
                }
                else{

                            
                      var index=parseInt(this.state.chossenTeam);
                      
                      election.methods.vote(index).send({from:this.state.currentAccount},(err,hash)=>{
                  
                      if(err){
                        window.alert(err);
                      }
                      else{
                        
                        this.addLoader(hash);
                        
                      }
                      });
                  


                }
              }
            });

   }
  
}


addLoader(hash){
 
  var loader=document.getElementById('loader');
  loader.style.display="block";
  var button=document.getElementById('vote');
  button.style.display="none";
  var closeButton=document.getElementById('closebutton');
  closeButton.style.display="none";
  var confirmForm=document.getElementById('info');
  confirmForm.style.display="none";
  confirmForm.style.marginTop="10px"
  var status=document.getElementById('status1');
  status.innerHTML="Processing..."
  status.style.marginTop="30px"
  var modal = document.getElementById("myModal"); 


  var voteInterval = setInterval(function(){
    
     window.web3.eth.getTransactionReceipt(hash,(err,result)=>{
      if(err){
        window.alert(err);
      }
      else if(result!=null)
      {
        
        if(result.status==true){
         
          loader.style.display="none";
          status.innerHTML="Vote Succesfully Recorded !"
          
          setTimeout(function(){
            modal.style.display = "none"; 
            window.location.href="/home"
          },2000)
          clearInterval(voteInterval);

        }
      }
      else{
        //continue loop
      }
    });

     }, 1000);

  //end
}

async loadStatus(){
    
     var tag=document.getElementById('blink_me');
     console.log("dsabdhjbd"+this.state.status)
     if(this.state.status==true){
    
      tag.innerHTML="Voting is live !"
      tag.style.color="red"
      tag.style.animationDuration='1.5s';
     }
    

}







  render(){
           
    return (
      <div >  

      <div id="header">
         
         <div id="adminSection">
                  <button id="adminButton"  class="headerButton"  onClick={this.adminEntry}>Admin</button> 
                  
                  
         </div> 
          <div id="userSection">
                <span id="userAddress"> <b> Current user : </b><u>{this.state.currentAccount}</u></span> 
          </div>

         

      </div>
          
      
      <div id="belowHeader">
         
           
                  {/* <div id="wlugSection"> */}
                          {/* <img src={wlugImg} id="wlugLogo"></img> */}
                  {/* </div> */}


                  <div id="mainTopic">
                         
                         <span id="mT1">
                               <small>WLUG Presents</small> <br></br> <br></br>
                                <b> METAMORPHOSIS 2K20</b>   <br></br>
                                <span>Day 1: BLOCKCHAIN</span>
                    
                         </span>
                  </div>


      </div>
     
      



      <div id="que">
          
        <span>
          Vote for your Favorite IPL team !
        </span>

      </div>






      
      <div id="blink_me">
        <span>Admin has not started Voting !</span>
      </div>


      <div id="representatives">  

    

      
           <div id="1" class="teamDiv">
           <img src={csk} class="teamsImg" id="0Chennai Super Kings" onClick={this.vote}></img>
           </div>

           <div id="2" class="teamDiv">
           <img src={mi} class="teamsImg" id="1Mumbai Indians" onClick={this.vote}></img>
           </div>

           <div id="3" class="teamDiv">
           <img src={rcb} class="teamsImg" id="2Royal Challengers Bangalore" onClick={this.vote}></img>
           </div>

           <div id="4" class="teamDiv">
           <img src={dc} class="teamsImg" id="3Delhi Capitals" onClick={this.vote}></img>
           </div>  

           <br></br><br></br>   <br></br><br></br>

           <div id="5" class="teamDiv">
           <img src={srh} class="teamsImg" id="4Sun Risers Hyderabad" onClick={this.vote}></img>
           </div>

           <div id="6" class="teamDiv">
           <img src={rr} class="teamsImg" id="5Rajasthan Royals" onClick={this.vote}></img>
           </div>

           <div id="_7" class="teamDiv">
           <img src={kkr} class="teamsImg" id="6Kolkata Knight Riders" onClick={this.vote}></img>
           </div>

           <div id="_8" class="teamDiv">
           <img src={kp} class="teamsImg" id="7Kings XI Punjab" onClick={this.vote}></img>
           </div>
            



      
      </div>



      <div id="bottomSpace">

      </div>

      <div id="myModal" class="modal">

                   
                    <div class="modal-content">
                      <div class="modal-header" >
                        <span class="close" onClick={this.closeModal} id="closebutton">&times;</span>
                          <center> <h2><b><span id="modalHeader">Vote for {this.state.chossenTeamName}</span></b></h2></center> 
                      </div>
                      <div class="modal-body">
                          

                          <div id="confirmForm">
                                 <form id="myForm" onSubmit={this.finalVote}>
                                    <div id="info">
                                          <br></br>
                                        <label>Current User :</label>   <br></br>
                                        <input type="text" size="45" value={this.state.currentAccount} readOnly></input>  <br></br><br></br> <br></br><br></br>
                                    </div>
                                    <div id="loader">
                                          
                                    </div>
                                    <center><button type="submit" id="vote"><b>Vote</b></button></center><br></br><br></br>
                                    <div id="status1">

                                    </div>
                                   
        
                                 </form>
                          </div>
                        
                      </div>
                     
                    </div>

        </div>



       
      </div>
    );



  }
 
}

export default Home;
