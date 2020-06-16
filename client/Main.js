import React from 'react'
import Sidebar from './Sidebar'
import Player from './Player'
import AllAlbums from './AllAlbums'
import axios from 'axios'
import SingleAlbum from './SingleAlbum'

const audio = document.createElement('audio');

export default class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      albums: [],
      selectedAlbum: {},
      audio: document.createElement('audio'),
      currentSong: {},
    }
    this.selectAlbum = this.selectAlbum.bind(this)
    this.deselectAlbum = this.deselectAlbum.bind(this)
    this.start = this.start.bind(this)
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
  }


  async componentDidMount() {
    try {
    const response = await axios.get("/api/albums");
    this.setState({ albums: response.data });
    audio.addEventListener("ended", () => {
      this.nextSong(); // or some other way to go to the next song
    });
    } catch (error) {
      console.log('Theres error!')
    }
  }

  async selectAlbum(albumId) {
    try {
      const response = await axios.get(`/api/albums/${albumId}`);
      const album = response.data;
      this.setState({ selectedAlbum: album});
    } catch(error) {
      console.error(error.stack)
    }
  }

  deselectAlbum() {
    this.setState({selectedAlbum: {}})
  }

  start(index){
    console.log('audioUrl', this.state.selectedAlbum.songs[index].audioUrl)
    const audio = document.createElement('audio');
    audio.src = this.state.selectedAlbum.songs[index].audioUrl;
    audio.load();
    audio.play();
    this.setState({
      currentSong: this.state.selectedAlbum.songs[index],
      audio: audio,
    })
  }

  pause(){
    this.state.audio.pause();
  }

  play(){
    this.state.audio.play();
  }

  // next() {
  //   const album = this.state.selectedAlbum.songs;
  //   console.log('this.state.currentSong', this.state.currentSong)
  //   console.log('album', album)
  //   let result;
  //   for (let i = 0; i < album.length; i++) {
  //     if (album[i] === this.state.currentSong) {
  //       if (i + 1 >= album.length) {
  //         result = album[0];
  //       } else {
  //         result = album[i + 1];
  //       }
  //     }
  //   }
  //   const url = result.audioUrl;
  //   this.start(url, result);
  // }

  render() {
    return (
      <div id='main' className='row container'>
        <Sidebar deselectAlbum={this.deselectAlbum} />
        <div className="container">
            {this.state.selectedAlbum.id 
            ? <SingleAlbum selectedAlbum={this.state.selectedAlbum} start={this.start} currentSong={this.state.currentSong}/>
            : <AllAlbums albums={this.state.albums} selectAlbum={this.selectAlbum} />}
        </div>
        <Player 
        handleClick = {this.state.audio.paused ? this.play : this.pause} 
        />
      </div>
    )
  }
}

