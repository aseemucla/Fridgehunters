import Layout from '../components/MyLayout.js'
import WrapLayout from '../components/WrapLayout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import urlname from '../components/urlname.js'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


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


class Dropdown extends React.Component{
	constructor(props){
	  super(props)
	  this.state = {
	    listOpen: false,
	    title: this.props.title,
	    textValue: "",
	    ingredtextlist: []
	  }

	  this.showMenu = this.showMenu.bind(this);
	  this.closeMenu = this.closeMenu.bind(this);
	  this.RemoveIngred = this.RemoveIngred.bind(this);
	  this.addIngredient = this.addIngredient.bind(this);
	}

	showMenu(event){
		if(this.state.listOpen){
			this.setState({ textValue: event.target.value.toLowerCase(), listOpen: false }, () => {
		        document.removeEventListener('click', this.closeMenu);
		    });  
		}
		else{
	  		this.setState({
	  			textValue: event.target.value.toLowerCase(),
	    		listOpen: true
	  		},  () => {
      		document.addEventListener('click', this.closeMenu);
    		})
		}
	}

	RemoveIngred(event){
		var index = +(this.state.ingredtextlist.indexOf(event.target.getAttribute('key2')));
		console.log(index)
		var changedArray = this.state.ingredtextlist.slice();
		changedArray.splice(index, 1);
		this.setState((prevState, props) => {return {ingredtextlist: changedArray}})
	}

	addIngredient(event){
		event.persist();

		if(event.currentTarget.id == "addButton"){
			if(this.state.textValue == ""){
				return;
			}
			if(this.state.ingredtextlist.findIndex(ing => ing == this.state.textValue) == -1){
				//this.setState((prevState, props) => {return {ingredlist: prevState.ingredlist.concat([(
					//<h1 onClick={this.RemoveIngred} key={this.state.textValue}>{this.state.textValue}</h1>
				//)])}})

				this.setState((prevState, props) => {return {ingredtextlist: prevState.ingredtextlist.concat([this.state.textValue])}})
			}

			
		}
		else{
			var custom = event.currentTarget.getAttribute('customtext')
			this.setState({ listOpen: false }, () => {
		        document.removeEventListener('click', this.closeMenu);
		    });  
		    //if(this.state.ingredlist.findIndex(ing => ing.key == event.target.getAttribute('customtext')) == -1){
		    if(this.state.ingredtextlist.findIndex(ing => ing == custom) == -1){
				//this.setState((prevState, props) => {return {ingredlist: prevState.ingredlist.concat([(
				//<h1 onClick={this.RemoveIngred} key={event.target.getAttribute('customtext')}>{event.target.getAttribute('customtext')}</h1>
				//)])}})

				this.setState((prevState, props) => {return {ingredtextlist: prevState.ingredtextlist.concat([custom])}})
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

	render(){
		return(
			<div>
			<div align="center" >
			<br/><br/><br/>
			<form name="addForm" onSubmit={(event) => this.showMenu(event)}>
		        <label>
		          	<h2>What's in your fridge? </h2>
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
				<div><br/><br/><br/><br/></div>
				)
			}

			
			
			<div class="inline">
			{
				this.state.ingredtextlist.map(ingred => (
					<Button  variant="outlined" onClick={this.RemoveIngred} key={ingred} key2={ingred}>{ingred}</Button>
				)
				)
			}
			</div>

			<br/><br/><br/><br/>
			<Link  href={{ pathname: '/recipelist', query: { ingredlist: this.state.ingredtextlist.toString() } }}>
	        	<Button variant="contained" style={{fontFamily: "Montserrat", fontWeight: "bold", fontSize: '20px' }} color="primary">FIND RECIPES</Button>
	        </Link>
			
			</div><style jsx>{`
	        

	        h2 {
	          font-family: "Gentium Book Basic", Times, serif;
	        }
	        
	      `}</style>
	      </div>
			
			

		);
	}
}



const Index = () => (
  <Layout>
  	<Dropdown title="Pick an ingredient"/>
  </Layout>
)

export default Index