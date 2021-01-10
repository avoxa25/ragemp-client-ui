mp.gui.chat.show(false);

mp.events.add('ToggleChat', (hidden: boolean) => {
  mp.gui.cursor.show(!hidden, !hidden);
});

const chat = mp.browsers.new('package://Chat/chat.html');
chat.markAsChat();