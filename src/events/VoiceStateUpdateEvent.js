// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const BaseEvent = require('../utils/structures/BaseEvent');
module.exports = class WoiceStateUpdateEvent extends BaseEvent {
  constructor() {
    super('voiceStateUpdate');
  }
  
  async run(client, oldState, newState) {
    if (oldState.guild.id !== '757346743598710866') return;
    if (oldState.channel && newState.channel) {
      if (oldState.channel.id === newState.channel.id) return;
    }
    const channels = ['757348976906207352', '757359784436432978', '889293729855324240', '777528922933297162', '788892141534838794', '829752192197328987', '812028558620885034']
    const roles = ['891611297383346196', '891611539893796864', '891613030255853568', '891611939896188928', '891611974167842886', '891611983286247424', '891612957111353394']
    if (oldState.channel) {
      if (!channels.includes(oldState.channel.id)) {

      }
      else {
        await oldState.member.roles.remove(roles[channels.indexOf(oldState.channel.id)])
      }
    }
    if (newState.channel) {
      if (!channels.includes(newState.channel.id)) {

      }
      else {
        await newState.member.roles.add(roles[channels.indexOf(newState.channel.id)])
      }
    }
  }
}