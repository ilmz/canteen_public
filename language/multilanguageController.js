
const english =  require('./english')

const LANGUAGES = {
  ENGLISH: 'en',
}

function getResponseMessage(code, language) {
  let response = "";
  switch (language) {
    case LANGUAGES.ENGLISH:
      response = english.responseMessages[code];
      break;
    case LANGUAGES.ARABIAN:
      response = arabian.responseMessages[code];
      break;
    default:
      response = english.responseMessages[code];
  }
  if (!response) {
    response = english.responseMessages[code] || " ";
  }
  return response;
}



module.exports =  {
  LANGUAGES,
  getResponseMessage,
  
}