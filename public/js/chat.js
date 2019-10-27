let socket = io();

function scrollToBottom(){
 let messages = document.querySelector('#messages','#location-message-template').lastElementChild;
  messages.scrollIntoView();
}

socket.on('connect', function() {
let searchQuery = window.location.search.substring(1);
let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');

socket.emit('join', params, function(err){
  if(err){
    alert(err);
    window.location.href = '/';
  }else {
    console.log('No Error!!');
  }
})
});

socket.on('disconnect',function () {
console.log('Disconnected to server:');

});

socket.on('updateUsersList', function (users){
     let ol = document.createElement('ol');
     users.forEach(function (user){
     let li = document.createElement('li');
     li.innerHTML = user;
     ol.appendChild(li);
   });
   let usersList = document.querySelector('#users');
   usersList.innerHTML = "";
   usersList.appendChild(ol);

})


socket.on('newMessage', function (message){
const template = document.querySelector('#message-template').innerHTML;
const formattedTime = moment(message.createAt).format('LT');
const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createAt: formattedTime

});

const div = document.createElement('div');
div.innerHTML = html

document.querySelector('#messages').appendChild(div);
scrollToBottom();
});

socket.on('newLocationMessage', function (message){
  const formattedTime = moment(message.createAt).format('LT');
  console.log("newLocationMessage", message);

  const template = document.querySelector('#location-message-template').innerHTML;

  const html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createAt: formattedTime

  });
  const div = document.createElement('div');
  div.innerHTML = html

  document.querySelector('#messages').appendChild(div);
  scrollToBottom();
});



document.querySelector('#submit-btn').addEventListener('click', function(e){
e.preventDefault();

socket.emit("CreateMessage", {
    text: document.querySelector('input[name = "message"]').value

}, function(){
   document.querySelector('input[name = "message"]').value = '';
})
})

document.querySelector('#send-location').addEventListener('click', function(e){
if(!navigator.geolocation){
  return alert('Geolocation is not supported by your browser!!')
}
 navigator.geolocation.getCurrentPosition(function (position)
 {
   socket.emit('createLocationMessage', {
    lat: position.coords.latitude,
    lng: position.coords.longitude
   })
 }, function (){
   alert('Unable to fetch location.')
 })


});
