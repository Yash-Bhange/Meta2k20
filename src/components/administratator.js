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
    this.closeModal=this.closeModal.bind(this);
    this.openModal=this.openModal.bind(this);



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

          var header=document.getElementById('teamname');
          var closeButton=document.getElementById('closeButton');
          closeButton.style.display="none";
          header.innerHTML="Confirming Transaction... It may take a while !"; 
          header.style.fontSize="30px"  
          header.style.textAlign="center";     
          var modal = document.getElementById("myModal");
          modal.style.display = "block";

          var logo=document.getElementById('logo');
          logo.innerHTML="<br></br>"
           
          var loader=document.getElementById('loader');
          loader.style.display="block";
          
          var status=document.getElementById('status');
          status.style.display="block"
        
         



        var voteInterval = setInterval(function(){
          
           window.web3.eth.getTransactionReceipt(hash,(err,result)=>{
            if(err){
              window.alert(err);
            }
            else if(result!=null)
            {
              
              if(result.status==true){
                header.innerHTML="Success !"; 
                loader.style.display="none";
                status.innerHTML="Voting Started Successfully"

                setTimeout(function(){
                  modal.style.display = "none"; 
                  window.location.href="/admin"
                },2000)
                clearInterval(voteInterval);
              }
            }
            else{
              //continue loop
            }
          });

           }, 1000);
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
        var header=document.getElementById('teamname');
        var closeButton=document.getElementById('closeButton');
        closeButton.style.display="none";
        header.innerHTML="Confirming Transaction... It may take a while !"; 
        header.style.fontSize="30px"  
        header.style.textAlign="center";     
        var modal = document.getElementById("myModal");
        modal.style.display = "block";

        var logo=document.getElementById('logo');
        logo.innerHTML="<br></br>"
         
        var loader=document.getElementById('loader');
        loader.style.display="block";
        
        var status=document.getElementById('status');
        status.style.display="block"



        var voteInterval = setInterval(function(){
          
          window.web3.eth.getTransactionReceipt(hash,(err,result)=>{
           if(err){
             window.alert(err);
           }
           else if(result!=null)
           {
             
             if(result.status==true){
               header.innerHTML="Success !"; 
               loader.style.display="none";
               status.innerHTML="Voting Ended"

               setTimeout(function(){
                 modal.style.display = "none"; 
                 window.location.href="/admin"
               },2000)
               clearInterval(voteInterval);
             }
           }
           else{
             //continue loop
           }
         });

          }, 1000);
       
           //updating result at end of voting
         election.methods.getResult().call({from:this.state.currentAccount},(err,hash)=>{
          if(err){
            window.alert(err)
          }
          else{
            
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
        
        this.setState({
   
          votes:hash
         });

         var resultHeader=document.getElementById('resultHeader');
         resultHeader.style.display="block"
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

    //fetching result
    const networkId = await window.web3.eth.net.getId();
    const election = new window.web3.eth.Contract(Election.abi, Election.networks[networkId].address);
    election.methods.getResult().call({from:this.state.currentAccount},(err,hash)=>{
      if(err){
        window.alert(err)
      }
      else{
        
        this.setState({
   
          votes:hash
         });


         //determining winner
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
    })
    //fetching complete
      
    
  }
  
}

closeModal(){
 
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  
}
openModal(maxPosition){
  
  var teamNames=["Chennai Super Kings","Mumbai Indians","Royals Challengers Bangalore","Delhi Capitals","Sun Risers Hyderabad","Rajasthan Royals","Kolkata Knight Riders","Kings XI Punjab"]
  var logos=[csk,mi,rcb,dc,srh,rr,kkr,kp]
  var winner=teamNames[maxPosition];
  
  var header=document.getElementById('teamname')
  header.innerHTML=winner;
  header.style.fontSize="40px"
  header.style.textAlign="center"

  var logo=document.getElementById('teamLogo')
  logo.src=logos[maxPosition];
  logo.style.width="200px"
  logo.style.height="200px"
  logo.style.transform="scale(0.9)";
  
  var logoDiv=document.getElementById('logo')
  logoDiv.style.textAlign="center"


  


  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}


render(){


  return (

    <div id="body">  

                    <div id="adminHeader">

                           Admin Control Panel
                      

                    </div>

                 <div id="controlButton"> 

                            <div id="leftAlign"> 


                            <button id="startVoting"  class="headerButton"  onClick={this.startVoting}>Start Voting</button> 
                            <button id="endVoting"  class="headerButton"  onClick={this.endVoting}>End Voting</button> 

                            </div>

                            <div id="content">
                            <small>WLUG Presents</small><br></br><br></br>
                              <b> METAMORPHOSIS 2K20</b> <br></br>
                              DAY 1: BLOCKCHAIN

                            </div>


                            <div id="rightAlign">
                                    
                            <button id="showResult"  class="headerButton"  onClick={this.showResult}>Show Result</button> 
                            <button id="getWinner"  class="headerButton"  onClick={this.getWinner}>Winner ?</button> 

                            </div>
 
                   </div>


                  <div id="resultHeader">
                    <br></br> 
                    <hr></hr>
                    <span>Results are shown below</span>
                    <hr></hr>
                    <br></br> 
                  </div>
                 <div id="tablesection">
                             <table id="table" border="1px" >
                                  <tbody>
                                    
                                  <tr class="row"> 
                                    <th class="col"><span class="row1">TEAMS</span></th>
                                    <th class="col"><span class="row1">Number of Votes</span></th>
                                 </tr>
                                 <tr class="row"> 
                                    <td class="col">Chennai Super Kings</td>
                                    <td class="col">{this.state.votes[0]}</td>
                                 </tr>
                                 <tr class="row"> 
                                    <td class="col">Mumbai Indians</td>
                                    <td class="col">{this.state.votes[1]}</td>
                                 </tr>
                                 <tr class="row"> 
                                    <td class="col">Royal Challengers Bangalore</td>
                                    <td class="col">{this.state.votes[2]}</td>
                                 </tr>
                                 <tr class="row"> 
                                    <td class="col">Delhi Capitals</td>
                                    <td class="col">{this.state.votes[3]}</td>
                                 </tr>
                                 <tr class="row"> 
                                    <td class="col">Sun Risers Hyderabad</td>
                                    <td class="col">{this.state.votes[4]}</td>
                                 </tr>
                                 <tr class="row"> 
                                    <td class="col">Rajasthan Royals</td>
                                    <td class="col">{this.state.votes[5]}</td>
                                 </tr>
                                 <tr class="row"> 
                                    <td class="col">Kolkata Knight Riders</td>
                                    <td class="col">{this.state.votes[6]}</td>
                                 </tr>
                                 <tr class="row"> 
                                    <td class="col">Kings XI Punjab</td>
                                    <td class="col">{this.state.votes[7]}</td>
                                 </tr>


                                  </tbody>
                                  


                              </table>
                </div>
                <div id="footer">
                  <br></br>
                  <br></br>
                </div>





                <div id="myModal" class="modal">

                   
                    <div class="modal-content">
                      <div class="modal-header" >
                        <span class="close" onClick={this.closeModal} id="closeButton"> &times;</span>
                          <div id="teamname">
                           <h2><b>team name</b></h2>
                          </div>
                           
                      </div>
                      <div class="modal-body" id="logo">
                          
                        <img src="" class="teamsImg" id="teamLogo" ></img>
                       
                        
                      </div>
                      <div id="loader">

                      </div>
                      <div id="status">
                         
                      </div>
                     
                   </div>

                </div>


    </div>
  




  );

};


}
  

export default Admin;
