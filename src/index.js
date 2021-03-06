import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      friends: [], // [{id: 1, name: 'Rehab', rating:5}, {id: 2, name: 'Adam', rating:1}]
    };
    this.create = this.create.bind(this);
    this.destroy = this.destroy.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }

  render() {
    //const friends = this.state.friends
    return (
      <div>
        <h1>Friends (The List)</h1>
        <form>
          <button onClick={this.create}>Create</button>
        </form>
        <div id="error"></div>
        <ul>
          <FriendList
            friends={this.state.friends}
            destroy={this.destroy}
            addFriend={this.addFriend}
          />
        </ul>
      </div>
    );
  }

  async create() {
    const friends = this.state.friends;
    try {
      const response = await axios.post('/api/friends');
      friends.push(response.data);
      this.setState({ friends });
    } catch (err) {
      console.log('ERROR');
    }
  }

  async destroy(friend) {
    let friends = this.state.friends;
    try {
      const response = await axios.delete(`/api/friends/${friend.id}`);
      console.log(response.data);
      friends = friends.filter((friendA) => friendA.id !== friend.id);
      this.setState({ friends });
    } catch (err) {
      console.log('ERROR');
    }
  }

  async addFriend(friend, direction) {
    let friends = this.state.friends;
    console.log(direction);
    if (direction === '+') {
      friend.rating++;
    } else {
      friend.rating--;
    }
    try {
      const response = await axios.put(`/api/friends/${friend.id}`, {
        rating: friend.rating,
      });
      console.log(response.data);
      friends = friends.sort((a, b) => (a.rating > b.rating ? -1 : 1));
      this.setState({ friends });
    } catch (err) {
      console.log('ERROR');
    }
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/api/friends');
      this.setState({ friends: response.data });
    } catch (err) {
      console.log('ERROR');
    }
  }
}

const FriendList = ({ friends, destroy, addFriend }) => {
  //  console.log(friends)
  return friends.map((friend) => {
    return (
      <Friend
        friend={friend}
        key={friend.id}
        destroy={destroy}
        addFriend={addFriend}
      />
    );
  });
};

const Friend = ({ friend, destroy, addFriend }) => {
  return (
    <li>
      <h2>{friend.name}</h2>
      <span>{friend.rating}</span>
      <button
        onClick={() => {
          addFriend(friend, '+');
        }}
        // data-id={friend.id}
      >
        +
      </button>
      <button
        onClick={() => {
          addFriend(friend, '-');
        }}
        //data-id={friend.id}
      >
        -
      </button>
      <button
        onClick={() => {
          destroy(friend);
        }}
      >
        x
      </button>
    </li>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));
// const axios = require('axios');

// const render = (friends)=> {
//   const ul = document.querySelector('ul');
//   const error = document.querySelector('#error');
//   error.innerText = '';
//   friends.sort((a, b)=> b.rating - a.rating);
//   const html = friends.map( friend => {
//     return `
//       <li data-id='${friend.id}'>
//         <h2>${ friend.name }</h2>
//         <span>${ friend.rating }</span>
//         <button data-id='${friend.id}'>+</button><button data-id='${friend.id}'>-</button><button data-id='${friend.id}'>x</button>
//       </li>
//     `;
//   }).join('');
//   ul.innerHTML = html;
// };

// const init = async()=> {
//   const response = await axios.get('/api/friends');
//   let friends = response.data;
//   render(friends);
//   const ul = document.querySelector('ul');
//   const form = document.querySelector('form');
//   const error = document.querySelector('#error');

//   ul.addEventListener('click', async(ev)=> {
//     if(ev.target.tagName === 'BUTTON'){
//       if(ev.target.innerHTML === 'x'){
//         const id = ev.target.getAttribute('data-id')*1;
//         await axios.delete(`/api/friends/${id}`);
//         friends = friends.filter(friend => friend.id !== id);
//         render(friends);
//       }
//       else {
//         const id = ev.target.getAttribute('data-id')*1;
//         const friend = friends.find(item => item.id === id);
//         const increase = ev.target.innerHTML === '+';
//         friend.rating = increase ? ++friend.rating : --friend.rating;
//         await axios.put(`/api/friends/${friend.id}`, { rating: friend.rating });
//         render(friends);
//       }
//     }
//   });

//   form.addEventListener('submit', async(ev)=> {
//     ev.preventDefault();
//     try {
//       const response = await axios.post('/api/friends');
//       friends.push(response.data);
//       render(friends);
//     }
//     catch(ex){
//       error.innerText = ex.response.data.error;
//     }
//   });
// };

// init();
