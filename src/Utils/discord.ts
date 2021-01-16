import { LocalEvents } from '../Constants/localEvents';

mp.events.add(LocalEvents.DiscordSetStatus, (firstString, secondString) => {
  mp.discord.update(firstString, secondString);
});