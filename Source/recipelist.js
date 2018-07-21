import { withRouter } from 'next/router'
import Layout from '../components/MyLayout.js'
import fetch from 'isomorphic-unfetch'
import Link from 'next/link'
import urlname from '../components/urlname.js'
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

class RecipeList extends React.Component{

  constructor(props){
    super(props);
    this.addEndorsement = this.addEndorsement.bind(this);
    this.removeIngred = this.removeIngred.bind(this);

    var listtext = this.props.listtext;
    var ingredlist = [];
    if(listtext != ""){
      ingredlist = listtext.split(",");
    }
    this.state = {
      listtext: listtext,
      ingredlist: ingredlist,
      recipes: [],
      endorsedrecipes: [],
      listready: false
    }

    fetch(urlname + "/recipes?ulist=" + encodeURI(this.state.listtext)).then(response => response.text()).then(datas => {
      var data = JSON.parse("[" + datas  + "]")
      //console.log("Show data fetched. Count: " + JSON.stringify(data))
      this.setState({
        recipes: data,
        listready: true
      })
    })
  }

  addEndorsement(event){
    var index = this.state.endorsedrecipes.indexOf(event.currentTarget.getAttribute('key2'));
    var temprec = event.currentTarget.getAttribute('key2');
    console.log(event.currentTarget.getAttribute('key2') + "yyyy" + index)
    var tempendorselist = this.state.endorsedrecipes.slice().concat([temprec])

    if(index == -1){
      
      this.setState((prevState, props) => {return {endorsedrecipes: tempendorselist}})
      fetch(urlname + "/endorsement/" + encodeURI(temprec), {method: 'PUT'}).then(response => response.text()).then(data => {
        console.log(data)
        return 1;
      }).then(useless => {fetch(urlname + "/recipes?ulist=" + encodeURI(this.state.listtext)).then(response => response.text()).then(datas => {
        var data = JSON.parse("[" + datas  + "]")
        console.log("Coming second")
        //console.log("Show data fetched. Count: " + JSON.stringify(data))
        this.setState({
          recipes: data
        })
      })
      })
    }
  }

  removeIngred(event){
    var index = this.state.ingredlist.indexOf(event.target.getAttribute('key2'))
    var tempingreds = this.state.ingredlist.slice();
    tempingreds.splice(index, 1);
    var templist = tempingreds.toString();

    this.setState({
      listtext: templist,
      ingredlist: tempingreds,
      listready: false
    })

    fetch(urlname + "/recipes?ulist=" + encodeURI(templist)).then(response => response.text()).then(datas => {
      var data = JSON.parse("[" + datas  + "]")
      //console.log("Show data fetched. Count: " + JSON.stringify(data))
      this.setState({
        recipes: data,
        listready: true
      })
    })
  }

  render(){
    return (
      <div>
      <div align="center"><br/>
      {
        this.state.ingredlist.length == 0
        ? (null) : 
        (this.state.ingredlist.map(ingred => (
          <Button  variant="outlined"  onClick={this.removeIngred} key={ingred} key2={ingred}>{ingred}</Button>
        )))
      }

      <br/><br/>
      {
        this.state.listready 
        ? null
        : <h2>Loading relevant recipes...</h2>
      }

      {
        this.state.recipes.map(recipe => (<div><Card style={{maxWidth: 450,  backgroundColor: '#b3ffb3'}} >
          <CardContent>
            <Typography gutterBottom variant="headline" component="h1">
              <h2>{recipe.name}</h2>
            </Typography>
            <Typography component="p">
              {recipe.ingredients.map(ingred => (
                <Chip label={ingred} />
              ))}
            </Typography>
            <Typography><br/>
              <p>{recipe.description.split('\n').map((item, key) => {
                return <span key={key}>{item}<br/></span>
              })}</p>
            </Typography>
           
            <Typography component="p"><br/><br/>
              <Badge color="secondary" badgeContent={recipe.endorse}>
              <Button size="small"  variant="contained"  color="primary" key2={recipe.name} style={{ fontFamily: "Gentium Book Basic", fontWeight: "bold", fontSize: '15px' }} onClick={this.addEndorsement}>
                {(this.state.endorsedrecipes.indexOf(recipe.name) == -1) ? "Endorse" : "Added endorsement"}
              </Button>
              </Badge>
            </Typography>
          </CardContent>
          <CardActions>
          </CardActions>
        </Card><br/></div>)
        )
      }
      
      <Link  href={{ pathname: '/create', query: {} }}>
        <Button variant="contained"  color="secondary" ><b>Make your own recipe!</b></Button>
      </Link>
      </div><style jsx>{`
        
        h2 {
          font-family: "Gentium Book Basic", Times, serif;
        }

        p {
          font-family: "Noto Sans", Times, serif;
          font-size: 17px;
        }
        
      `}</style>
      </div>
    )
  }
}

const First =  (props) => (
  <Layout>
    <RecipeList listtext={props.listtext} />
  </Layout>
)

First.getInitialProps = async function (context) {
  const listtext = context.query.ingredlist
  console.log(listtext)
  return {listtext: listtext}
}

export default First