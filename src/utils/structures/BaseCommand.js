module.exports = class BaseCommand {
  constructor(name, category, aliases, cooldown, description, syntax) {
    this.name = name;
    this.category = category;
    this.aliases = aliases;
    this.cooldown = cooldown;
    this.description = description;
    this.syntax = syntax;
  }
}