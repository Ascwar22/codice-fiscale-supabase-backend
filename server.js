const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

//DEBUG: stampa le variabili ambiente per sicurezza
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "✓ presente" : "✗ mancante");
//Consentire le richieste da netlify


//Inizializza Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const port = 3000;

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(express.static(__dirname)));

app.use(cors({
origin: 'codice-fiscale-supabase.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
//TEST: connessione Supabase
app.get('/test', async (req, res) => {
  const { data, error } = await supabase.from('CodiciFiscali').select('*').limit(1);
  if (error) {
    console.error('Test errore:', error);
    return res.send('Errore');
  }
  res.send('Connesso correttamente a Supabase!');
});
app.get('/', (req, res) => {
  res.send(path.join(__dirname, 'index.html'));
});


// Funzione per calcolare il codice fiscale
function calcolaCodiceFiscale({ nome, cognome, anno, mese, giorno, sesso, codiceComune }) {
  // Funzione per estrarre le consonanti
  function estraiConsonanti(stringa) {
    return stringa.replace(/[^A-Za-z]/g, '')
                  .replace(/[AEIOUaeiou]/g, '')
                  .toUpperCase();
  }

  // Funzione per estrarre le vocali
  function estraiVocali(stringa) {
    return stringa.replace(/[^A-Za-z]/g, '')
                  .replace(/[^AEIOUaeiou]/g, '')
                  .toUpperCase();
  }

  // Funzione per generare la parte del codice fiscale basata su nome e cognome
  function generaParteNome(nome) {
    let parte = estraiConsonanti(nome) + estraiVocali(nome);
    return parte.length >= 3 ? parte.slice(0, 3) : parte + 'X'.repeat(3 - parte.length);
  }

  // Funzione per estrarre l'anno
  function annoToCodice(anno) {
    return anno.toString().slice(2, 4); // Gli ultimi due numeri dell'anno
  }

  // Funzione per convertire il mese
  function meseToCodice(mese) {
    const mesi = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'P']; // Codifica dei mesi
    return mesi[mese - 1]; // Mesi da 1 a 12
  }

  // Funzione per convertire il giorno
  function giornoToCodice(giorno, sesso) {
    if (sesso === 'F') {
      giorno += 40; // Se femmina, somma 40 al giorno
    }
    return giorno.toString().padStart(2, '0'); // Rende il giorno a due cifre
  }

  // Estrazione delle parti del codice fiscale
  const parteCognome = generaParteNome(cognome);
  const parteNome = generaParteNome(nome);
  
  // Calcolo del codice fiscale
  const codiceFiscale = `${parteCognome}${parteNome}${annoToCodice(anno)}${meseToCodice(mese)}${giornoToCodice(giorno, sesso)}${codiceComune}`;

  return codiceFiscale;
}

// Form handler
app.post('/invia', async (req, res) => {
  const { nome, cognome, anno, mese, giorno, sesso, Nome_Comune } = req.body;

  // Codice del comune (modifica con un sistema per recuperarlo dinamicamente)
  const codiceComune = 'Z404'; // Sostituisci con il codice del comune corretto

  // Calcola il codice fiscale
  const codiceFiscale = calcolaCodiceFiscale({
    nome,
    cognome,
    anno,
    mese,
    giorno,
    sesso,
    codiceComune
  });

  // Inserisci i dati nel database Supabase
  const { data, error } = await supabase
    .from('CodiciFiscali')
    .insert([{ nome, cognome, anno, mese, giorno, sesso, Nome_Comune, codiceFiscale }]);

  if (error) {
    console.error('Errore Supabase:', error);
    return res.status(500).send('Errore nel salvataggio.');
  }

  console.log('Dati salvati con successo:', data);
  res.send('Dati salvati con successo!');
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
