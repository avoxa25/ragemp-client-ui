import { KeyboardKeys } from "../constants/enums/keyboard-keys";
import { RemoteEvent } from "../constants/events/remote-event";
import { RemoteResponse } from "../constants/events/remote-response";
import { VoiceChatConstants } from "../constants/voice-chat";

class VoiceChat {
  private use3d: boolean;
  private useAutoVolume: boolean;
  private maxRange: number;
  private listeners: PlayerMp[];
  private isListening: boolean;

  constructor() {
    this.use3d = true;
    this.useAutoVolume = false;
    this.maxRange = 10.0;
    this.listeners = [];
    this.isListening = false;

    mp.keys.bind(KeyboardKeys.KeyN, true, () => this.EnableMicrophone());
    mp.keys.bind(KeyboardKeys.KeyN, false, () => this.DisableMicrophone());

    mp.events.add(RageEnums.EventKey.PLAYER_QUIT, (p: PlayerMp) => this.PlayerDisconnect(p));
    mp.events.add(RageEnums.EventKey.PLAYER_START_TALKING, (p: PlayerMp) => this.PlayerStartTalking(p));
    mp.events.add(RageEnums.EventKey.PLAYER_STOP_TALKING, (p: PlayerMp) => this.PlayerStopTalking(p));

    mp.events.add(RemoteResponse.VoiceReloaded, () => this.VoiceChatReload());

    setInterval(() => {
      mp.players.forEachInStreamRange(player => this.AddPlayerToListeners(player));
      this.CheckListeners();
    }, 350);
  }

  private EnableMicrophone(): void {
    if (mp.gui.cursor.visible) return;
    if (mp.players.local.getVariable(VoiceChatConstants.VoiceChatMuted) as boolean) return;

    if (!mp.voiceChat.muted) return;
    mp.voiceChat.muted = false;
    mp.players.local.playFacialAnim('mic_chatter', 'mp_facial');
  }

  private DisableMicrophone(): void {
    if (mp.voiceChat.muted) return;
    mp.voiceChat.muted = true;
    mp.players.local.playFacialAnim('mood_normal_1', 'facials@gen_male@variations@normal');
  }

  private VoiceManagerAddPlayer(player: PlayerMp, notify: boolean): void {
    if (this.listeners.indexOf(player) !== -1) return;

    if (notify) mp.events.callRemote(RemoteEvent.VoiceAddListener, player);
    this.listeners.push(player);
    this.isListening = true;

    player.voice3d = true;
    player.voiceVolume = 0.0;
  }

  private VoiceManagerRemovePlayer(player: PlayerMp, notify: boolean): void {
    let index = this.listeners.indexOf(player);
    if (index === -1) return;

    if (notify) mp.events.callRemote(RemoteEvent.VoiceRemoveListener, player);
    this.listeners.splice(index, 1);
    this.isListening = false;
  }

  private PlayerDisconnect(player: PlayerMp): void {
    if (this.isListening) this.VoiceManagerRemovePlayer(player, false);
  }

  private VoiceChatMute(): void {
    this.DisableMicrophone();
  }

  private VoiceChatReload(): void {
    mp.voiceChat.cleanupAndReload(true, true, true);
  }

  private AddPlayerToListeners(player: PlayerMp): void {
    if (player === mp.players.local) return;
    if (this.isListening) return;

    const isPlayerInRange = mp.game.system.vdist(
      player.position.x,
      player.position.y,
      player.position.z,

      mp.players.local.position.x,
      mp.players.local.position.y,
      mp.players.local.position.z) <= this.maxRange;

    if (isPlayerInRange) this.VoiceManagerAddPlayer(player, true);
  }

  private CheckListeners(): void {
    this.listeners.forEach((player) => {
      if (player.handle !== 0) {
        const distance = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
        if (distance > this.maxRange) this.VoiceManagerRemovePlayer(player, true);
        else if (!this.useAutoVolume) player.voiceVolume = 1 - (distance / this.maxRange);
      }
      else this.VoiceManagerRemovePlayer(player, true);
    });
  }

  private PlayerStartTalking(player: PlayerMp): void {
    player.voice3d = true;
    mp.players.local.playFacialAnim('mic_chatter', 'mp_facial');
  }

  private PlayerStopTalking(player: PlayerMp): void {
    player.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
  }
}

let voiceChat: VoiceChat | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => voiceChat = voiceChat ? voiceChat : new VoiceChat());