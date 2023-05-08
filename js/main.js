function GetUrl(code) {
    const url = "https://docs.google.com/spreadsheets/d/18xu5gGVZR3xL5qxss1b1dhz7CDwN6T-bnqr6GTyax3c/export?format=csv"; // Reemplaza 'ID_DEL_DOCUMENTO' con el ID real de tu archivo de Google Sheets

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los datos: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');
            result = '';
            
            for (let i = 0; i < lines.length; i++) {
                const currentLine = lines[i].trim();
                if (!currentLine) continue;

                const values = currentLine.split(',');
                if (values[0] == code){
                    result = values[1];
                    break;
                }
            }

            if(result)
                window.open(result, '_blank');
            else
                console.error("Error al obtener el url.");
        })
        .catch(error => {
            console.error("Error al hacer fetch:", error);
        });
}

