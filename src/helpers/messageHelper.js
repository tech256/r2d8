const messageIsFromABot = function( event ) {
  if  ( event.type === 'message' && ( event.subtype === 'bot_message' || 
      ( event.bot_profile !== null && event.bot_profile !== undefined && event.bot_profile.name == 'bot' ) ) ) {
      return true;
  }
  return false;
}



module.exports = { messageIsFromABot };