exports.run = (client, message, args) => {

  // Pega o canal pela ID
  let channel = client.channels.get('397109089878016011');
  // Ou pelo nome (less persistent)
  channel = client.channels.find('name', 'Musicas S/🎤');
  channel.join()
  .then(connection => console.log('Conectado'))
  .catch(console.error);
};
