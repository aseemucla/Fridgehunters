import { withRouter } from 'next/router'
import Layout from '../components/MyLayout.js'
import fetch from 'isomorphic-unfetch'
import Link from 'next/link'
import urlname from '../components/urlname.js'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
const querystring = require('querystring');


class Listing extends React.Component{
  constructor(props){
      super(props)
      console.log(this.props.textValue)
      this.state = {
        list: [],
      }
  }

  componentWillMount(){
    this.setState({
        
        list: ["Loading..."]
    });
    fetch(urlname + "/ingredients?uname=" + encodeURI(this.props.textValue)).then(response => response.text()).then(data => {
      console.log("Show data fetched. Count: " + data)
      var datalist = data.split(",");
      if(data == ""){
        this.setState({
        
            list: []
        });
      }
      else{
        this.setState({
        
            list: datalist
        });
      }

    })
    
      
  }

  render(){
    return (
        <div align="center">
        <List component="nav"  style = {{width: 250}}><Divider />
          {this.state.list.map((ingred) => (<div key={ingred}>
            <ListItem button onClick={this.props.onClicker} customtext={ingred}>
                  <ListItemText primary={ingred} />
              </ListItem>
              <Divider />
              </div>
          ))}
        </List>
        </div>
    )
  }
  
}

class Creator extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      listOpen: false,
      textValue: "",
      ingredtextlist: [],
      name: "",
      description: "",
      buttonInfo: "Add recipe!",
      errorInfo: ""
    }

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.RemoveIngred = this.RemoveIngred.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.createRecipe = this.createRecipe.bind(this);
  }

  showMenu(event){
    this.setState({
      buttonInfo: "Add recipe!",
      errorInfo: ""
    })
    if(this.state.listOpen){
      this.setState({ textValue: event.currentTarget.value.toLowerCase(), listOpen: false }, () => {
            document.removeEventListener('click', this.closeMenu);
        });  
    }
    else{
        this.setState({
          textValue: event.currentTarget.value.toLowerCase(),
          listOpen: true
        },  () => {
          document.addEventListener('click', this.closeMenu);
        })
    }
  }

  RemoveIngred(event){
    var index = +(this.state.ingredtextlist.indexOf(event.target.getAttribute('key2')));
    var changedArray = this.state.ingredtextlist.slice();
    changedArray.splice(index, 1);
    this.setState((prevState, props) => {return {ingredtextlist: changedArray}})
  }

  addIngredient(event){
    event.persist();
    var custom = event.currentTarget.getAttribute('customtext')
    var tmparr = this.state.ingredtextlist.slice().concat([custom]);

    if(event.currentTarget.id == "addButton"){
      if(this.state.textValue == ""){
        return;
      }

      if(this.state.ingredtextlist.findIndex(ing => ing == this.state.textValue) == -1){
        //this.setState((prevState, props) => {return {ingredlist: prevState.ingredlist.concat([(
          //<h1 onClick={this.RemoveIngred} key={this.state.textValue}>{this.state.textValue}</h1>
        //)])}})

        tmparr = this.state.ingredtextlist.slice().concat([this.state.textValue]);

        this.setState((prevState, props) => {return {ingredtextlist: tmparr}})
      }

      
    }

    else{
      this.setState({ listOpen: false }, () => {
            document.removeEventListener('click', this.closeMenu);
        });  
        //if(this.state.ingredlist.findIndex(ing => ing.key == event.target.getAttribute('customtext')) == -1){
        if(this.state.ingredtextlist.findIndex(ing => ing == custom) == -1){
        //this.setState((prevState, props) => {return {ingredlist: prevState.ingredlist.concat([(
        //<h1 onClick={this.RemoveIngred} key={event.target.getAttribute('customtext')}>{event.target.getAttribute('customtext')}</h1>
        //)])}})

        this.setState((prevState, props) => {return {ingredtextlist: tmparr}})
      }
      
      
    }
  }

  closeMenu(event) {
    
      if (!this.dropdownMenu.contains(event.target)) {
        
        this.setState({ listOpen: false }, () => {
          document.removeEventListener('click', this.closeMenu);
        });  
        
      }
  }

  changeName(event){
    this.setState({
      buttonInfo: "Add recipe!",
      errorInfo: "",
      name: event.currentTarget.value
    })
  }

  changeDescription(event){
    this.setState({
      buttonInfo: "Add recipe!",
      errorInfo: "",
      description: event.currentTarget.value
    })
  }

  createRecipe(){
    this.setState({
      buttonInfo: "Adding recipe..."
    })
    if(this.state.name == "" || this.state.description == "" || this.state.ingredtextlist == []){
      this.setState({
        errorInfo: "One or more fields is left blank. Try again."
      })
      return;
    }

    var params = {
      uname: this.state.name,
      ulist: this.state.ingredtextlist.toString(),
      udesc: this.state.description
    }

    var queryAdd = querystring.stringify(params);

    fetch(urlname + "/recipes", {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(params)}).then(response => response.text()).then(data => {
      if(data == "Recipe exists"){
        this.setState({
          errorInfo: "Recipe name exists. Try again."
        })
      }
      else{
        console.log("Added recipe " + data)
        this.setState({
          buttonInfo: "Recipe added!"
        })
      }
      
    })
  }

  render(){
    return (
      <div>
      <div align="center"><br/><br/>

      <form name="nameForm" onSubmit={(event) => this.showMenu(event)}>
        <label>
          <h3>Recipe name</h3> 
          <TextField  onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}} onChange={(event) => this.changeName(event)} margin="normal" />
        </label>
      </form>

      <br/><br/>

      <form name="addForm" onSubmit={(event) => this.showMenu(event)}>
        <label>
            <h3>Add ingredients</h3>
            <TextField  onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}} onChange={(event) => this.showMenu(event)} margin="normal" />
        </label>
            
      </form>

      <Button variant="contained" color="secondary" onClick={this.addIngredient} id="addButton"  style={{ fontFamily: "Gentium Book Basic", fontWeight: "bold", fontSize: '16px' }}>Pick ingredient</Button>
      
      { 
        this.state.listOpen 
        ?(
        <div className="menu" ref={(element) => {
          this.dropdownMenu = element;
        }}>
          <Listing textValue={this.state.textValue} onClicker={this.addIngredient}/>
        </div>
        )
        :(
        <div><br/></div>
        )
      }

      
      
      <div class="inline">
      {
        this.state.ingredtextlist.map(ingred => (
          <Button  variant="outlined" onClick={this.RemoveIngred} key={ingred} key2={ingred}>{ingred}</Button>
        )
        )
      }
      </div><br/><br/><br/>


      <h3>Enter recipe</h3> 
      <TextField  style={{width: 300}} multiline={true} rows={5} onChange={(event) => this.changeDescription(event)} />

      <br/><br/><br/>
      <h4>{this.state.errorInfo}</h4>

      <Button variant="contained" style={{fontFamily: "Montserrat", fontWeight: "bold", fontSize: '20px' }} color="primary" onClick={this.createRecipe}>{this.state.buttonInfo}</Button>

      </div><style jsx>{`
 

        h3 {
          font-family: "Gentium Book Basic", Times, serif;
        }
        
      `}</style>
      </div>
    )
  }
}

const First =  (props) => (
  <Layout>
    <Creator/>
  </Layout>
)

export default First