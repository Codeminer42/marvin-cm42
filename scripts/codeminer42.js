// Commands:
//   !alessandro - Display "I commented in your PR"
//   !almoso - Capybara tells you to have lunch
//   !brownbag - Give instructions on how to schedule a brownbag
//   !english - Do you speak it ?
//   !excuses - Show programming excuses
//   !godead - Display GoDead logo
//   !talysson - Display Talysson card
//   !test - Display all tests links
module.exports = (robot) => {
  robot.hear(/!almoso\b/, (res) => {
    res.send("http://i.imgur.com/gTviOgc.jpg");
  });

  robot.hear(/!english\b/, (res) => {
    res.send("https://www.youtube.com/watch?v=a0x6vIAtFcI");
  });

  robot.hear(/!test\b/, (res) => {
    res.send(
      [
        process.env.TEST_LINKS
          ? process.env.TEST_LINKS
          : "Frontend: <https://gist.github.com/talyssonoc/4b55d989ca0dee5b842dd01fbd5e3698>",
        "Backend: <https://gist.github.com/talyssonoc/fa8094bc4f87ecee9f483f5fbc16862c>",
        "Mobile: <https://gist.github.com/akitaonrails/ec29ca437ee1f18d9a2e613292a541bf>",
      ].join("\n")
    );
  });

  robot.hear(/!brownbag\b/, (res) => {
    res.send(
      [
        "**CM42 Brown Bags**: _quintas-feiras das 12:30 às 13:00_ no YouTube :tv: (<https://youtube.com/Codeminer42TV>).",
        ":calendar: Confira a última ou a próxima brownbag com os comandos `!brownbagprev` e `!brownbagnext`",
        "",
        "**Quer apresentar?**",
        "- Preencha o formulário em <https://forms.gle/dPBDuQzi3gVTfuXbA> e leia todas as informações.",
        "- Agendamento, dúvidas, etc, é só falar com `@paulodiovani`.",
        "",
        "Não é necessário preparação ou slides, apenas vontade de compartilhar algo com os colegas.",
      ].join("\n")
    );
  });

  robot.hear(/!excuses\b/, (res) => {
    const url =
      "https://gist.githubusercontent.com/paulodiovani/edfcf4bbc33dfcf16366ac2374802b86/raw/286da386ad35785b2ed9f158e665c8129536e0ce/excuses.txt";

    robot.http(url).get()((err, resp, body) => {
      if (err) return res.send(`Encountered an error :( ${err}`);

      const excuses = body.split("\n");
      const selected = excuses[Math.floor(Math.random() * excuses.length)];
      res.send(selected);
    });
  });

  robot.hear(/!alessandro\b/, (res) => {
    res.send(
      "http://res.cloudinary.com/paulodiovani/image/upload/v1528308466/alessandro_lumaqm.jpg"
    );
  });

  robot.hear(/!godead\b/, (res) => {
    res.send(
      "https://res.cloudinary.com/dgjml2eyw/image/upload/v1545308158/godead.png"
    );
  });

  robot.hear(/!talysson\b/, (res) => {
    res.send(
      [
        "It's time to duel",
        "https://res.cloudinary.com/dgjml2eyw/image/upload/v1545316115/taly.png",
      ].join("\n")
    );
  });
};
