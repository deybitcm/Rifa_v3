let participantes = [
    'Participante 1',
    'Participante 2',
    'Participante 3',
];
let premios = [
    'Premio 1',
    'Premio 2',
    'Premio 3',
    'Premio 4',
    'Premio 5',
];


function procesarCSV(tipo) {
    let inputFile = null;
    if (tipo === 'participantes') {
        inputFile = document.getElementById('csvParticipantes');
        participantes = [];
    } else if (tipo === 'premios') {
        inputFile = document.getElementById('csvPremios');
        premios = [];
    }

    if (inputFile.files.length === 0) {
        alert(`Por favor selecciona un archivo CSV para ${tipo}.`);
        return;
    }

    const file = inputFile.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const contenido = e.target.result;
        const filas = contenido.split('\n');

        filas.forEach(fila => {
            const valor = fila.trim();
            if (valor) {
                if (tipo === 'participantes') {
                    participantes.push(valor);
                } else if (tipo === 'premios') {
                    premios.push(valor);
                }
            }
        });

        alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} importados correctamente.`);
    };

    reader.readAsText(file);
}


function cargarSorteo() {
    if (participantes.length > 0 && premios.length > 0) {
        document.getElementById('cargarDatos').style.display = 'none';
        document.getElementById('sorteo').style.display = 'block';

        actualizarListas();
    } else {
        alert('Debes agregar participantes y premios antes de continuar.');
    }
}


let selectedPremioIndex = null;
let ganadores = []; // Definimos la lista de ganadores

function actualizarListas() {
    const listaPremios = document.getElementById('listaPremios');
    listaPremios.innerHTML = '';
    premios.forEach((premio, index) => {
        const li = document.createElement('li');
        li.textContent = premio;
        li.onclick = function () {
            seleccionarPremio(index, li);
        };
        if (index === selectedPremioIndex) {
            li.style.backgroundColor = 'lightblue'; // Resalta el premio seleccionado
            //cambiar color de texto
            li.style.color = 'black';
        }
        listaPremios.appendChild(li);
    });

    const listaGanadores = document.getElementById('listaGanadores');
    listaGanadores.innerHTML = '';
    ganadores.forEach(ganador => {
        const li = document.createElement('li');
        li.textContent = `${ganador.participante} - ${ganador.premio}`;
        listaGanadores.appendChild(li);
    });
}

function seleccionarPremio(index, li) {
    selectedPremioIndex = index;
    actualizarListas(); // Actualizar la lista para resaltar el premio seleccionado
}

function sortearGanador() {
    if (selectedPremioIndex !== null) {
        const ganadorIndex = Math.floor(Math.random() * participantes.length);
        const ganador = participantes[ganadorIndex];
        const premio = premios[selectedPremioIndex];

        participantes.splice(ganadorIndex, 1);  // Eliminar ganador de la lista de participantes
        premios.splice(selectedPremioIndex, 1);  // Eliminar premio de la lista de premios

        ganadores.push({ participante: ganador, premio: premio }); // Añadir el ganador a la lista de ganadores

        selectedPremioIndex = null;  // Reiniciar la selección de premios
        actualizarListas();  // Actualizar las listas

        mostrarGanador(ganador, premio);
    } else {
        alert('Debes seleccionar un premio antes de sortear.');
    }
}


function mostrarGanador(ganador, premio) {
    document.getElementById('sorteo').style.display = 'none';
    document.getElementById('ganador').style.display = 'block';

    document.getElementById('contador').style.display = 'block';
    document.getElementById('nombreGanador').textContent = '';
    document.getElementById('premioGanador').textContent = '';
    document.getElementById('volverButton').style.display = 'none';
    

    let contador = 5;
    const contadorElemento = document.getElementById('contador');
    contadorElemento.textContent = contador;

    const interval = setInterval(() => {
        contador--;
        contadorElemento.textContent = contador;

        if (contador === 0) {
            clearInterval(interval);
            document.getElementById('contador').style.display = 'none';
            // Crear 2 span: uno para el texto "Ganador:" y otro para el nombre del ganador
            const labelGanador = document.createElement('span');
            labelGanador.textContent = 'Ganador: ';
            labelGanador.id = 'labelGanador';

            const nombreGanador = document.createElement('span');
            nombreGanador.textContent = ganador;
            nombreGanador.id = 'nombreGanador';
            //Insertar los elementos en el div correspondiente
            document.getElementById('nombreGanador').appendChild(labelGanador);
            document.getElementById('nombreGanador').appendChild(nombreGanador);

            // Crear 2 span: uno para el texto "Premio:" y otro para el nombre del premio
            const labelPremio = document.createElement('span');
            labelPremio.textContent = 'Premio: ';
            labelPremio.id = 'labelPremio';

            const premioGanador = document.createElement('span');
            premioGanador.textContent = premio;
            premioGanador.id = 'premioGanador';
            //Insertar los elementos en el div correspondiente
            document.getElementById('premioGanador').appendChild(labelPremio);
            document.getElementById('premioGanador').appendChild(premioGanador);  

            document.getElementById('volverButton').style.display = 'block';

            // Explosión inicial de confeti
        confetti({
            particleCount: 150,
            spread: 70,
            startVelocity: 50,
            origin: { y: 0.7 }
        });

        // Luego, lluvia continua de confeti
        const confetiInterval = setInterval(() => {
            confetti({
                particleCount: 20,
                angle: 90,
                spread: 3000,
                startVelocity: 10,
                gravity: 0.5,
                ticks: 200,
                origin: { x: Math.random(), y: -0.2 }
            });
        }, 250); // Intervalo corto para simular lluvia continua

        // Detener el confeti al volver
        document.getElementById('volverButton').onclick = function() {
            clearInterval(confetiInterval);
            volverAlSorteo();
        };
        }

        
    }, 1000);
}

function volverAlSorteo() {
    document.getElementById('ganador').style.display = 'none';
    document.getElementById('sorteo').style.display = 'block';
    actualizarListas();
}
