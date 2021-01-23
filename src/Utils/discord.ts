import { LocalEvents } from '../Constants/localEvents';

mp.events.add(LocalEvents.DiscordSetStatus, (secondString) => {
  mp.discord.update("Играет на SweetLifeRP", secondString);
});