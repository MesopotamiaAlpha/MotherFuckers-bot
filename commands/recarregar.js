exports.run = (client, message, args) => {
  if(!args || args.size < 1) return message.reply("Precisa especificar o comando para recarregar.");
  // o caminho e relativo a **pasta atual*** , entao ./filename.js
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.reply(`O comando ${args[0]} foi recarregado`);
};

