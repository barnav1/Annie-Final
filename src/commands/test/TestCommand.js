const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
const mongoose = require('mongoose')
const Setting = require('../../database/models/settingsSchema');
const odm = require('../../odm.js')

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'testing', [], 5);
  }

  async run(client, message, args) {

  }
}