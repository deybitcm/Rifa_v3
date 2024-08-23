let participantes = [
    {
        nombre: 'Participante 1',
        estado: true,
        codigo: '1234',
    },
    {
        nombre: 'Participante 2',
        estado: true,
        codigo: '5678',
    },
    {
        nombre: 'Participante 3',
        estado: true,
        codigo: '9012',
    },
    {
        nombre: 'Participante 4',
        estado: true,
        codigo: '3456',
    },
    {
        nombre: 'Participante 5',
        estado: true,
        codigo: '7890',
    },
    {
        nombre: 'Participante 6',
        estado: true,
        codigo: '1145',
    },
    {
        nombre: 'Participante 7',
        estado: true,
        codigo: '1198',
    },
    {
        nombre: 'Participante 8',
        estado: true,
        codigo: '1157',
    },
    {
        nombre: 'Participante 9',
        estado: true,
        codigo: '1158',
    },
    {
        nombre: 'Participante 10',
        estado: true,
        codigo: '1159',
    },
];
let premios = [
    {
        nombre: 'Premio 1',
        estado: true,
    },
    {
        nombre: 'Premio 2',
        estado: true,
    },
    {
        nombre: 'Premio 3',
        estado: true,
    },
    {
        nombre: 'Premio 4',
        estado: true,
    },
    {
        nombre: 'Premio 5',
        estado: true,
    },
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
            let valor = fila.trim();
            if (valor) {
                if (tipo === 'participantes') {
                    valor = valor.split(';');
                    const participante = {
                        nombre: valor[1],
                        estado: true,
                        codigo: valor[0],
                    };
                    participantes.push(participante);
                } else if (tipo === 'premios') {
                    const premio = {
                        nombre: valor,
                        estado: true,
                    };
                    premios.push(premio);
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
        document.getElementById('sorteo').style.display = 'flex';

        actualizarListas();
    } else {
        alert('Debes agregar participantes y premios antes de continuar.');
    }
}

let selectedPremioIndex = null;
let ganadores = []; // Definimos la lista de ganadores

function actualizarListas() {
    const listaPremios = document.getElementById('listaPremiosInicial');
    listaPremios.innerHTML = '';
    premios.forEach((premio, index) => {
        const li = document.createElement('li');
        if(premio.estado === false){
            li.classList.add('desactivado');
        }
        else {
            li.onclick = function () {
                seleccionarPremio(index, li);
            };
        }
        li.textContent = premio.nombre;
        if (index === selectedPremioIndex) {
            li.style.backgroundColor = 'lightblue'; // Resalta el premio seleccionado
            //cambiar color de texto
            li.style.color = 'black';
        }
        listaPremios.appendChild(li);
    });

    const listaParticipantes = document.getElementById('listaParticipantes');
    listaParticipantes.innerHTML = '';
    participantes.forEach(participante => {
        const li = document.createElement('li');
        const spanNombre = document.createElement('span');
        const spanCodigo = document.createElement('span');
        spanNombre.textContent = participante.nombre;
        spanCodigo.textContent = participante.codigo;
        li.appendChild(spanNombre);
        li.appendChild(spanCodigo);
        listaParticipantes.appendChild(li);
    });

    mostrarGanadores();
}

function seleccionarPremio(index, li) {
    selectedPremioIndex = index;
    actualizarListas(); // Actualizar la lista para resaltar el premio seleccionado
}

function sortearGanador() {
    if (selectedPremioIndex !== null) {        
        //seleccionar un ganador aleatorio de participantes con estado = true
        do {
            var ganadorIndex = Math.floor(Math.random() * participantes.length);
        } while (participantes[ganadorIndex].estado === false);
        const ganador = participantes[ganadorIndex];
        const premio = premios[selectedPremioIndex];

        participantes[ganadorIndex].estado = false; // Marcar al ganador como no disponible

        premios[selectedPremioIndex].estado = false; // Marcar el premio como no disponible

        ganadores.push({ participante: ganador.nombre, premio: premio.nombre, codigo: ganador.codigo }); // Añadir el ganador a la lista de ganadores

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
    document.getElementById('codigoGanador').textContent = '';

    let contador = 2;
    const contadorElemento = document.getElementById('contador');
    contadorElemento.textContent = contador;

    const interval = setInterval(() => {
        contador--;
        contadorElemento.textContent = contador;

        if (contador === 0) {
            clearInterval(interval);
            document.getElementById('contador').style.display = 'none';

            const codigoGandor = document.getElementById('codigoGanador');
            codigoGandor.textContent = ganador.codigo;

            // Crear 2 span: uno para el texto "Ganador:" y otro para el nombre del ganador
            const labelGanador = document.createElement('span');
            labelGanador.textContent = 'Ganador: ';
            labelGanador.id = 'labelGanador';

            const nombreGanador = document.createElement('span');
            nombreGanador.textContent = ganador.nombre;
            nombreGanador.id = 'nombreGanador';
            //Insertar los elementos en el div correspondiente
            document.getElementById('nombreGanador').appendChild(labelGanador);
            document.getElementById('nombreGanador').appendChild(nombreGanador);

            // Crear 2 span: uno para el texto "Premio:" y otro para el nombre del premio
            const labelPremio = document.createElement('span');
            labelPremio.textContent = 'Premio: ';
            labelPremio.id = 'labelPremio';

            const premioGanador = document.createElement('span');
            premioGanador.textContent = premio.nombre;
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

function mostrarGanadores() {
    const listaGanadores = document.getElementById('listaGanadoresFinal');
    listaGanadores.innerHTML = '';
    ganadores.forEach(ganador => {
        const li = document.createElement('li');
        li.textContent = `${ganador.participante} - ${ganador.premio}`;
        li.style.alignContent = 'center';
        li.style.textAlign = 'center';
        listaGanadores.appendChild(li);
    });
}

function mostrarGanadoresFinalSorteo() {
    const listaGanadores = document.getElementById('listaGanadoresFinalSorteo');
    listaGanadores.innerHTML = '';
    ganadores.forEach(ganador => {
        const li = document.createElement('li');
        li.textContent = `${ganador.participante} - ${ganador.premio}`;
        li.style.alignContent = 'center';
        li.style.textAlign = 'center';
        listaGanadores.appendChild(li);
    });
}

function volverAlSorteo() {
    document.getElementById('ganador').style.display = 'none';
    const premiosDisponibles = premios.filter(premio => premio.estado);
    if(premiosDisponibles.length > 0){
        document.getElementById('sorteo').style.display = 'flex';
        actualizarListas();
    } else {
        document.getElementById('sorteo').style.display = 'none';
        document.getElementById('finSorteo').style.display = 'block';
        mostrarGanadoresFinalSorteo();
    }
}

function reiniciarSorteo() {
    participantes = [
        {
            nombre: 'Participante 1',
            estado: true,
        },
        {
            nombre: 'Participante 2',
            estado: true,
        },
        {
            nombre: 'Participante 3',
            estado: true,
        },
        {
            nombre: 'Participante 4',
            estado: true,
        },
        {
            nombre: 'Participante 5',
            estado: true,
        },
        {
            nombre: 'Participante 6',
            estado: true,
        },
        {
            nombre: 'Participante 7',
            estado: true,
        },
        {
            nombre: 'Participante 8',
            estado: true,
        },
        {
            nombre: 'Participante 9',
            estado: true,
        },
        {
            nombre: 'Participante 10',
            estado: true,
        },
    ];
    premios = [
        {
            nombre: 'Premio 1',
            estado: true,
        },
        {
            nombre: 'Premio 2',
            estado: true,
        },
        {
            nombre: 'Premio 3',
            estado: true,
        },
        {
            nombre: 'Premio 4',
            estado: true,
        },
        {
            nombre: 'Premio 5',
            estado: true,
        },
    ];
    ganadores = [];
    selectedPremioIndex = null;

    document.getElementById('finSorteo').style.display = 'none';
    document.getElementById('cargarDatos').style.display = 'block';
}
