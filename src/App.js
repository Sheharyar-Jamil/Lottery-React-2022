import './App.css';
import Lottery from './Lottery';
import React, {Component} from 'react';
import web3 from './web3';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };
  async componentDidMount(){
    const manager = await Lottery.methods.manager().call();
    const players = await Lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(Lottery.options.address);

    this.setState({manager, players, balance});
  }


  onSubmit = async (event) =>{
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'Waiting on transaction success... It took 15 to 30 seconds'});

     await Lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'You have been entered!'});


  };

  onClick = async () =>{
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success... It took 15 to 30 seconds'});
    try{
      await Lottery.methods.pickWinner().send({
        from: accounts[0]
      });
  
      this.setState({message: 'A winner has been picked'});
      
  
    } catch(error){
      this.setState({message: 'Sorry Something went wrong'});
    }
  }
    
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager} 
          There are currently {this.state.players.length} {' '} people entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance,  'ether')} ether!
          </p>

          <hr />

          <form onSubmit = {this.onSubmit}>
            <h3>Want to try your luck?</h3>
            <div>
              <label>Amount of Ether to Enter</label>
              <input
              value = {this.state.value}
              onChange = {event => this.setState({value: event.target.value})} 
              />
            </div>
            <button>Enter</button>
          </form>

          <hr />

          <h3>Ready to pick a winner?</h3>
          <button onClick={this.onClick}>Pick a Winner</button>

          <hr />

          <h2>{this.state.message}</h2>
      </div>

  
    );
  }
}
export default App;
