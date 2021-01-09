mp.gui.chat.show(false);

let chatbox = mp.browsers.new('package://chat/chat.html');
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
