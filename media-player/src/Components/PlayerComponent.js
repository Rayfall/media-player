import { NULL } from "node-sass";
import React, {Component} from "react";

const colplaySong = "https://res.cloudinary.com/aetherfall/video/upload/v1604701914/Music/VivaLaVida_d19bx4.mp3";
const drewSong = "https://res.cloudinary.com/aetherfall/video/upload/v1604701905/Music/LightBoss_zo8omf.mp3";

function getTime(time) {
    if (!isNaN(time)) {
      return (
        Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
      );
    }
}

export default class Player extends Component {
    state = {
        selectedTrack: null,
        player: "stopped",
        currentTime: null,
        duration: null
    };

    componentDidMount() {
        this.player.addEventListener("timeupdate", e => {
          this.setState({
            currentTime: e.target.currentTime,
            duration: e.target.duration
          });
        });
    }

    componentWillUnmount() {
        this.player.removeEventListener("timeupdate", () => {});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedTrack !== prevState.selectedTrack) {
          let track;
          switch (this.state.selectedTrack) {
            case "Viva La Vida":
              track = colplaySong;
              break;
            case "Light Boss BGM":
              track = drewSong;
              break;
            default:
              break;
          }
          if (track) {
            this.player.src = track;
            this.player.play();
            this.setState({ player: "playing", duration: this.player.duration });
          }
        }
        if (this.state.player !== prevState.player) {
          if (this.state.player === "paused") {
            this.player.pause();
          } else if (this.state.player === "stopped") {
            this.player.pause();
            this.player.currentTime = 0;
            this.setState({ selectedTrack: null });
          } else if (
            this.state.player === "playing" &&
            prevState.player === "paused"
          ) {
            this.player.play();
          }
        }
    }
    
    render() {
        const list = [
            { id: 1, title: "Viva La Vida"}, 
            {id: 2, title: "Light Boss BGM"}
        ].map(item => {
            return (
              <li
                key={item.id}
                onClick={() => this.setState({ selectedTrack: item.title })}>
                    {item.title}
              </li>
            );
        });

        const currentTime = getTime(this.state.currentTime);
        const duration = getTime(this.state.duration);

        return (            
           <>
                <ul>{list}</ul>
                <div>
                    {this.state.player === "paused" && (
                            <button onClick={() => this.setState({ player: "playing" })}>
                                Play
                            </button>
                        )
                    }
                    {this.state.player === "playing" && (
                            <button onClick={() => this.setState({ player: "paused" })}>
                                Pause
                            </button>
                        )
                    }
                    {this.state.player === "playing" || this.state.player === "paused" ? (
                            <button onClick={() => this.setState({ player: "stopped" })}>
                                Stop
                            </button>
                        ) : (
                        ""
                        )
                    }
                </div>

                {this.state.player === "playing" || this.state.player === "paused" ? (                
                        <div>
                            {currentTime} / {duration}
                        </div>
                    ) : (
                        ""
                    )
                }

                <audio ref={ref => (this.player = ref)} />
           </>
        )
        
    }
}