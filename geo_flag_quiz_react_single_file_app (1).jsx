<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GeoFlag Quiz</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/framer-motion/dist/framer-motion.umd.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>">
</head>
<body class="bg-gray-50">
  <div id="root"></div>
  <script type="text/javascript">
    const { useState, useEffect, useMemo } = React;
    const { motion, AnimatePresence } = window["framer-motion"];

    function codeToFlagEmoji(iso2) {
      if (!iso2) return "";
      return iso2.toUpperCase().replace(/[^A-Z]/g, "").split("").map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join("");
    }

    const COUNTRIES = [["BR","Brasil","América do Sul"],["AR","Argentina","América do Sul"],["CL","Chile","América do Sul"],["UY","Uruguai","América do Sul"],["PY","Paraguai","América do Sul"],["BO","Bolívia","América do Sul"],["PE","Peru","América do Sul"],["CO","Colômbia","América do Sul"],["VE","Venezuela","América do Sul"],["EC","Equador","América do Sul"],["US","Estados Unidos","América do Norte"],["CA","Canadá","América do Norte"],["MX","México","América do Norte"],["PT","Portugal","Europa"],["ES","Espanha","Europa"],["FR","França","Europa"],["DE","Alemanha","Europa"],["IT","Itália","Europa"],["GB","Reino Unido","Europa"],["IE","Irlanda","Europa"],["NL","Países Baixos","Europa"],["BE","Bélgica","Europa"],["CH","Suíça","Europa"],["AT","Áustria","Europa"],["SE","Suécia","Europa"],["NO","Noruega","Europa"],["FI","Finlândia","Europa"],["DK","Dinamarca","Europa"],["PL","Polônia","Europa"],["CZ","Tchéquia","Europa"],["HU","Hungria","Europa"],["RO","Romênia","Europa"],["GR","Grécia","Europa"],["TR","Turquia","Europa/Ásia"],["RU","Rússia","Europa/Ásia"],["CN","China","Ásia"],["JP","Japão","Ásia"],["KR","Coreia do Sul","Ásia"],["IN","Índia","Ásia"],["ID","Indonésia","Ásia"],["SA","Arábia Saudita","Ásia"],["AE","Emirados Árabes Unidos","Ásia"],["IL","Israel","Ásia"],["EG","Egito","África"],["ZA","África do Sul","África"],["NG","Nigéria","África"],["KE","Quênia","África"],["ET","Etiópia","África"],["MA","Marrocos","África"],["DZ","Argélia","África"],["AU","Austrália","Oceania"],["NZ","Nova Zelândia","Oceania"]];

    function shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function sample(arr, k) {
      return shuffle(arr).slice(0, k);
    }

    function GeoFlagQuiz() {
      const pool = useMemo(() => COUNTRIES.map(([iso2, name, region]) => ({ iso2, name, region })), []);
      const [round, setRound] = useState(1);
      const [score, setScore] = useState(0);
      const [seconds, setSeconds] = useState(20);
      const [question, setQuestion] = useState(() => shuffle(pool)[0]);
      const [feedback, setFeedback] = useState(null);

      const options = useMemo(() => {
        const wrongs = sample(pool.filter(c => c.iso2 !== question.iso2), 3);
        return shuffle([question, ...wrongs]);
      }, [question, pool]);

      useEffect(() => {
        if (seconds <= 0) return;
        const id = setTimeout(() => setSeconds(s => s - 1), 1000);
        return () => clearTimeout(id);
      }, [seconds]);

      function handleAnswer(choice) {
        if (!choice) {
          setFeedback("wrong");
          return;
        }
        if (choice.iso2 === question.iso2) {
          setScore(s => s + Math.max(10, 2 * seconds));
          setFeedback("correct");
        } else {
          setFeedback("wrong");
        }
      }

      function nextRound() {
        setRound(r => r + 1);
        setQuestion(sample(pool.filter(c => c.iso2 !== question.iso2), 1)[0]);
        setSeconds(20);
        setFeedback(null);
      }

      return React.createElement("div", { className: "max-w-xl mx-auto p-4 text-center" },
        React.createElement("h1", { className: "text-2xl font-bold mb-4" }, `Rodada ${round} - Pontos: ${score}`),
        React.createElement("div", { className: "text-8xl mb-4" }, codeToFlagEmoji(question.iso2)),
        options.map((opt, i) =>
          React.createElement("button", {
            key: opt.iso2,
            className: `block w-full p-3 mb-2 rounded border ${feedback && opt.iso2 === question.iso2 ? "bg-green-300" : "bg-white"}`,
            onClick: () => handleAnswer(opt)
          }, `${i + 1}. ${opt.name}`)
        ),
        feedback && React.createElement("div", { className: "mt-3" },
          feedback === "correct" ? "✅ Correto!" : `❌ Era ${question.name}`
        ),
        React.createElement("button", { onClick: nextRound, className: "mt-4 p-2 bg-blue-500 text-white rounded" }, "Próxima")
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(GeoFlagQuiz));
  </script>
</body>
</html>
