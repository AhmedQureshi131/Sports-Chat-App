let generateMessage = (from, text) => {
return {
 from,
 text,
 createAt: new Date().getTime()

};
};
let generateLocationMessage = (from, lat , lng) => {
  return{
    from,
    url: `https://www.google.com/maps?q=${lat}, ${lng}`,
    createAt: new Date().getTime()
  }
}

module.exports = {generateMessage, generateLocationMessage};
