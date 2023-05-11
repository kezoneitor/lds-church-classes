const escuelaDominicalUrl = "https://docs.google.com/spreadsheets/d/18xu5gGVZR3xL5qxss1b1dhz7CDwN6T-bnqr6GTyax3c/export?format=csv"; // Reemplaza 'ID_DEL_DOCUMENTO' con el ID real de tu archivo de Google Sheets
const edEmail = "edkeslerthc@gmail.com";
const Enum = {
    Text: 0,
    Key: 1,
    URL: 2,
    Disabled: 3,
    Hidden: 4,
    BtnClass: 5
}

function GetUrl(code) {
    fetch(escuelaDominicalUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los datos: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');
            let isEnabled = false;
            let result = '';

            for (let i = 1; i < lines.length; i++) {
                const currentLine = lines[i].trim();
                if (!currentLine) continue;

                const values = currentLine.split(',');
                if (values[Enum.Key] == code) {
                    result = values[Enum.URL];
                    isEnabled = values[Enum.Disabled] == "";
                    break;
                }
            }

            if (result) {
                if(isEnabled)
                    window.open(result, '_blank');
            }
            else
                console.error("Error al obtener el url.");
        })
        .catch(error => {
            console.error("Error al hacer fetch:", error);
        });
}

function submitFeedback() {
    const name = $("#name").val();
    const feedback = $("#feedback").val();

    if (!name || !feedback) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const subject = encodeURIComponent(`Comentarios de ${name}`);
    const body = encodeURIComponent(feedback);
    const mailtoLink = `mailto:${edEmail}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
}

$(document).ready(function () {
    // Fetch para obtener la cantidad de botones
    fetch(escuelaDominicalUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los datos: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');

            for (let i = 1; i < lines.length; i++) {
                const currentLine = lines[i].trim();
                if (!currentLine) continue;

                const values = currentLine.split(',');

                // Crear un botón y asignarle un valor
                const boton = $('<button></button>').text(values[Enum.Text]).val(values[Enum.Key]);

                // Esta deshabilitado
                const isEnabled = values[Enum.Disabled] == "";
                boton.prop('disabled', !isEnabled)

                // Esta oculto
                const isHidden = values[Enum.Hidden] != "";
                boton.prop('hidden', isHidden)

                //Agregar clases
                boton.addClass(`btn ${isEnabled ? values[Enum.BtnClass] : 'disabled'}`);

                // Añadir un evento click al botón
                boton.on('click', function () {
                    GetUrl($(this).val());
                });

                // Añadir el botón clonado al contenedor
                $('#btnList').append(boton);
            }
        })
        .catch(error => {
            console.error("Error al hacer fetch:", error);
        });

    // Metodo para enviar el feedback por correo
    $("#feedback-form").on("submit", function (event) {
        event.preventDefault();
        submitFeedback();
    });
});