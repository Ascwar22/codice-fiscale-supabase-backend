1.Proggetto Sperimentale-Codice Fiscale con collegamento al db di Supabase
-Questo progetto è una semplice applicazione web full-stack costruita con: Node.js, Express e Supabase per il calcolo e la memorizzazione del codice fiscale italiano.

2.Funzionalita'
-Form HTML per l'inserimento dei dati anagrafici.
-Calcolo del codice fiscale secondo le regole italiane.
-Salvataggio dei dati, incluso il codice fiscale gia generato su un database di Supabase.
-Interfaccia utente con una semplice selezione del comune italiano.
-Endpoint di test per verificare se persiste la connessione con Supabase(/test).

3.Tecnologie utilizzate
-Node.js
-Express
-Supabase(PostgreSQL)
-HTML5, CSS(esterni)
-Javascript (per il FrontEnd)

4.I requisiti per l'uso
-Un account Supabase (http://supabase.com) con il proggetto configurato
-File Comuni.json per la scelta dinamica del comune
-Un file .env dove sono stati salvati l'url e la kiave di accesso al supabase

5.Guida alla installazione
dalla bash per clonare il progetto:
 1.git clone https://github.com/tuo-utente/nome-repo.git
 cd nome-repo
2.Installazione delle dipendenze
npm install
3.Creazione del file .env
-SupabaseUrl=il tuo URL di supabase
-SupabaseKey=che e la chiave publica segreta
4.Guida al avviamento del server:
dal terminale:
-node server.js
5.Il progetto si apre in localhost su:
 http://localhost:3000
