const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./card_requisitions.db', (err) => {
    if (err) {
        console.error('Error connecting:', err.message);
    } else {
        console.log('Connected to DB');
        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
            if (err) throw err;
            console.log('Tables:', tables);

            db.run(`CREATE TABLE IF NOT EXISTS requisitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        village_town TEXT NOT NULL,
        survey_number TEXT NOT NULL,
        extent TEXT NOT NULL,
        classification TEXT NOT NULL,
        units TEXT NOT NULL,
        nature_of_use TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, () => {
                db.all("SELECT * FROM requisitions", [], (err, rows) => {
                    if (err) throw err;
                    console.log('Data inside requisitions table:', rows.length > 0 ? rows : 'No data yet!');
                    db.close();
                });
            });
        });
    }
});
