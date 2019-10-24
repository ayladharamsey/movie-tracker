import React, { Component } from 'react';
import './App.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import { getMovies, createNewUser, getFavorites, setFavorites } from '../../apiCalls';
import { setMovies, faveMovie, setUser, isLoading, hasErrored, setFaves } from '../../actions';
import MoviesContainer from '../MoviesContainer/MoviesContainer';
import Login from '../Login/Login';
import CreateUser from '../CreateUser/CreateUser';

class App extends Component {
  
  async componentDidMount() {
    try {
      this.props.isLoading(true);
      const films = await getMovies();
      this.props.setMovies(films);
      this.props.isLoading(false); 
    } catch({ message }) {
      this.props.hasErrored(message);
      this.props.isLoading(false);
    }

  }
  
   addUser = async newUser => {
      try {
        await createNewUser(newUser);
        const users = await getFavorites(); 
        this.props.setUser(users);
      } catch(error) {
        this.props.isLoading(false);
        this.props.hasErrored(error.message);
      }
    }
    
    retrieveFavorites = async id => {
      try {
        this.props.isLoading(true);
        const faves = await getFavorites(id);
        this.props.isLoading(false);
        this.props.setFaves(faves);
      } catch(error) {
        this.props.isLoading(false);
        this.props.hasErrored(error.message);
    }
}

render() {
    const { movieData, setUser } = this.props;
    return (
      <main>
        <CreateUser addUser={this.addUser} />
        <div className="login_form">
          <Login setUser={setUser} />
        </div>
        <h1>Something Movie Related!</h1>
        {this.props.loading ? null : <MoviesContainer movieData={movieData}/>}
      </main>
    );
  }
}

const mapStateToProps = state => ({
  movieData: state.movieData,
  favoritedMovie: state.favoritedMovie,
  user: state.user,
  loading: state.loading,
  hasErrored: state.hasErrored  
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setMovies,
    faveMovie,
    setUser,
    isLoading,
    hasErrored,
    setFaves
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(App);
