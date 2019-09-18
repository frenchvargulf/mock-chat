import React, { Component } from 'react';
import Pusher from 'pusher-js';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: this.props.currentUser.id,
      line: [],
      users: this.props.currentUser.users,
      userIds: this.props.currentUser.users.map( (user) => {
        return user.id;
      }),
      data: [],
    }

    this.pusher = new Pusher('4f21d161f02e7ab3f286', {
      cluster: 'eu',
    });
  }

  isPainting = false;


  colors = [ this.userStrokeStyle, this.user1StrokeStyle, this.user2StrokeStyle ]
  userStrokeStyle = '#EE92C2'; 
  user1StrokeStyle = '#F0C987';
  user2StrokeStyle = 'dodgerblue';


  line = [];
  userId = this.props.currentUser.id;
  
  prevPos = { offsetX: 0, offsetY: 0 };

  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      this.position = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      this.line = this.line.concat(this.position);
      this.paint(this.prevPos, offSetData, this.userStrokeStyle);
    }
  }

  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      this.sendPaintData();
    }
  }

  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }


async sendPaintData() {
  const body = {
    userId: this.userId,
    line: this.line,
  };

  const req = await fetch('http://localhost:4000/paint', {
    method: 'post',
    body: JSON.stringify( body ),
    headers: {
      'content-type': 'application/json',
    },
  });
 
  const res = await req.json();
  console.log(res)
  this.line = [];
  
}

  componentWillUnmount(){
    Promise.resolve()
  }

  componentDidMount() {
    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;

    const channel = this.pusher.subscribe('painting');
    channel.bind('draw', (data) => {
      const { userId, line } = data;
      if (userId !== this.userId) {
        line.forEach((position) => {
          this.paint(position.start, position.stop, this.user1StrokeStyle);
        });
      }
    });


  }

  render() {
    
    return (
      <canvas
        ref={(ref) => (this.canvas = ref)}
        style={{ background: 'black', zIndex:'100000000000'}}
        onMouseDown={ (e) => this.onMouseDown(e)}
        onMouseLeave={ (e) => this.endPaintEvent(e)}
        onMouseUp={ (e) => this.endPaintEvent(e)}
        onMouseMove={ (e) => this.onMouseMove(e)}
      />
    );
  }
}

export default Canvas;