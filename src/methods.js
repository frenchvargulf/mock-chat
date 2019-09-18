import axios from 'axios';

function onDrop(pictureFiles) {
  this.setState({
    pictures: this.state.pictures.concat(pictureFiles)
  });
}

function openImageUploadDialog() {
  console.log(this.state.showImageUploadDialog)
  this.setState({
    showImageUploadDialog: true
  });
}

function closeImageUploadDialog() {
  this.setState({
    showImageUploadDialog: false
  });
}

function toggleEmojiPicker() {
  this.setState({
    showEmojiPicker: !this.state.showEmojiPicker,
  });
}

// function addEmoji(emoji) {
//   const { newMessage } = this.state;
//   const text = `${newMessage}${emoji.native}`;

//   this.setState({
//     newMessage: text,
//     showEmojiPicker: false,
//   });
// }

function sendFile(event) {
    event.preventDefault();
    const { currentUser, fileUploadMessage, pictures, currentRoom } = this.state;

    if (pictures.length === 0) return;

    const parts = [];
    console.log(fileUploadMessage)
    if (fileUploadMessage.trim() !== "") {
      parts.push({
        type: "text/plain",
        content: fileUploadMessage
      });
    }

    pictures.forEach(pic => {
      parts.push({
        file: pic
      });
    });

    currentUser.sendMultipartMessage({
      roomId: `${currentRoom.id}`,
      parts
    });

    this.setState({
      fileUploadMessage: "",
      pictures: [],
      showImageUploadDialog: false
    });
}



// function updateLanguage(event) {
//   const { value } = event.target;
//   const { messages } = this.state;
//   this.setState(
//     {
//       language: value,
//     },
//     () => {
//       messages.forEach(message => {
//         translateText.call(this, message);
//       });
//     }
//   );
// }

// function translateText(message) {
//   const { language, messages } = this.state;
//   const { text, key } = message;

//   console.log(language)
//   console.log(messages)
//   axios
//     .post('http://localhost:4000/translate', {
//       text,
//       lang: language,
//     })
//     .then(response => {
//       const index = messages.findIndex(item => {
//         console.log(item)
//         return item.key === key
//       });
//       console.log(index)

    

//       const msg = {
//         ...message,
//         text: response.data.TranslatedText,
//       };

     
   
//       if (index !== -1) {
//         messages.splice(index, 1, msg);
//       } else {
//         messages.push(msg);
//       }
      
//       this.setState({
//         messages: messages.sort((a, b) => {
//           console.log(a)
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         }),
//         // messages: messages,
//       });
      
//     })
//     .catch(console.error)
// }


function handleSlashCommand(message) {
  const cmd = message.split(" ")[0];
  const query = message.slice(cmd.length)

  if (cmd !== "/news") {
    alert(`${cmd} is not a valid command`);
    return;
  }

   return sendNews.call(this, query);
}



function sendNews(query) {
  const { currentUser, currentRoom } = this.state;

  fetch(`https://newsapi.org/v2/everything?q=${query}&pageSize=3&apiKey=2b676df86424467b88261f62eb567899`)
    .then(res => res.json())
    .then(data => {
      const parts = [];
      data.articles.forEach(article => {
        parts.push({
          type: "text/plain",
          content: `${article.title} - ${article.source.name} - ${article.url}`
        });
      });
      console.log(parts)

      currentUser.sendMultipartMessage({
        roomId: `${currentRoom.id}`,
        parts: [parts[0]]
      });
     
    })
    .catch(console.error);
}

export {
  onDrop,
  sendFile,
  toggleEmojiPicker,
  // addEmoji,
  openImageUploadDialog,
  closeImageUploadDialog,
  handleSlashCommand,
  // updateLanguage,
  // translateText,
  sendNews
};