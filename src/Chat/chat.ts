//Disables default RageMP Chat
mp.gui.chat.show(false); //Disables default RageMP Chat
// mp.gui.chat.activate(false);

let chatbox = null;
chatbox = mp.browsers.new('package://chat/chat.html');
chatbox.markAsChat();

mp.events.add('ChatEnable', (toggle) => {
  if (toggle) {
    mp.gui.cursor.show(true, true);
    mp.game.ui.displayHud(false);
  }
  else if (!toggle) {
    mp.game.ui.displayHud(true);
    mp.gui.cursor.show(false, false);
  }
});
