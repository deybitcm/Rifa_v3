let participantes = [
    {
        id: 12345,
        nombre: 'Participante 1',
        estado: true,
    },
    
];
let premios = [
    {
        nombre: 'Audífonos',
        estado: true,
    },
    {
        nombre: 'Parlante',
        estado: true,
    },
    {
        nombre: 'Kit Closet Kawaii',
        estado: true,
    },
    {
        nombre: 'Mouse',
        estado: true,
    },
    {
        nombre: 'Kit Logitech Teclado + Mouse',
        estado: true,
    },
    {
        nombre: 'Piercing',
        estado: true,
    },
    {
        nombre: 'Peluche Sanrio x Yugioh',
        estado: true,
    },
    {
        nombre: 'Cooler',
        estado: true,
    },
    {
        nombre: 'Cupón de Descuento',
        estado: true,
    },
    {
        nombre: 'Hervidor Electrico',
        estado: true,
    },
    {
        nombre: 'Tatuaje',
        estado: true,
    },
    {
        nombre: 'Kit Teros 4 en 1',
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
                // Separar por el punto y coma
                const [id, nombre] = valor.split(';');

                if (tipo === 'participantes') {
                    valor = valor.split(';');
                    const participante = {
                        id: id.trim(),
                        nombre: nombre.trim(),
                        estado: true,
                    };
                    participantes.push(participante);
                } else if (tipo === 'premios') {
                    const premio = {
                        id: id.trim(),
                        nombre: nombre.trim(),
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
            li.classList.add('clickable');
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
        spanNombre.textContent = participante.id;
        // spanCodigo.textContent = participante.codigo;
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

        ganadores.push({ id:ganador.id ,participante: ganador.nombre, premio: premio.nombre }); // Añadir el ganador a la lista de ganadores

        selectedPremioIndex = null;  // Reiniciar la selección de premios
        actualizarListas();
        participantes = participantes.filter(element => element.id !== ganador.id)  // Actualizar las listas

        mostrarGanador(ganador.id, ganador.nombre, premio.nombre);
    } else {
        alert('Debes seleccionar un premio antes de sortear.');
    }
}


function mostrarGanador(id, ganador, premio) {
    document.getElementById('code').textContent = '';
    document.getElementById('sorteo').style.display = 'none';
    document.getElementById('ganador').style.display = 'block';

    document.getElementById('contador').style.display = 'block';
    document.getElementById('nombreGanador').textContent = '';
    document.getElementById('premioGanador').textContent = '';
    document.getElementById('volverButton').style.display = 'none';

    let contador = 3;
    const contadorElemento = document.getElementById('contador');
    contadorElemento.textContent = contador;

    const interval = setInterval(() => {
        contador--;
        contadorElemento.textContent = contador;

        if (contador === 0) {
            clearInterval(interval);
            document.getElementById('contador').style.display = 'none';
            // Crear 1 span: uno para el texto "Ganador:" y otro para el nombre del ganador
            const labelId = document.createElement('span');
            labelId.textContent = id;
            labelId.id = 'labelId';

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
            document.getElementById('code').appendChild(labelId)

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

function mostrarGanadores() {
    const listaGanadores = document.getElementById('listaGanadoresFinal');
    listaGanadores.innerHTML = 'No hay ganadores aún.';
    if(ganadores.length > 0){
        listaGanadores.innerHTML = '';
    }
    ganadores.forEach(ganador => {
        const li = document.createElement('li');
        // Crear 2 divs, uno para el nombre del ganador y otro para el premio
        const divGanador = document.createElement('div');
        divGanador.textContent = `${ganador.participante} - ${ganador.premio}`; // Cambiar por el nombre del ganador
        divGanador.classList.add('elementoListaGanador');

        const divPremio = document.createElement('div');
        divPremio.textContent = ganador.id;
        divPremio.classList.add('elementoListaGanador');

        // Insertar los divs en el li
        li.appendChild(divGanador);
        li.appendChild(divPremio);

        li.classList.add('elementoListaGanador');
        listaGanadores.appendChild(li);
    });
}

function mostrarGanadoresFinalSorteo() {
    const listaGanadores = document.getElementById('listaGanadoresFinalSorteo');
    listaGanadores.innerHTML = 'No hubo ganadores en este sorteo.';
    if(ganadores.length > 0){
        listaGanadores.innerHTML = '';
    }
    ganadores.forEach(ganador => {
        const li = document.createElement('li');
        // Crear 2 divs, uno para el nombre del ganador y otro para el premio
        const divGanador = document.createElement('div');
        divGanador.textContent = `${ganador.participante} - ${ganador.premio}`; // Cambiar por el nombre del ganador
        divGanador.classList.add('elementoListaGanador');

        const divPremio = document.createElement('div');
        divPremio.textContent = ganador.id;
        divPremio.classList.add('elementoListaGanador');

        // Insertar los divs en el li
        li.appendChild(divGanador);
        li.appendChild(divPremio);

        li.classList.add('elementoListaGanador');
        listaGanadores.appendChild(li);
    });
}

function volverAlSorteo() {
    document.getElementById('ganador').style.display = 'none';
    const premiosDisponibles = premios.filter(premio => premio.estado);
    if(premiosDisponibles.length > 0 && participantes.length > 0){
        document.getElementById('sorteo').style.display = 'flex';
        actualizarListas();
    } else {
        document.getElementById('sorteo').style.display = 'none';
        document.getElementById('finSorteo').style.display = 'block';
        mostrarGanadoresFinalSorteo();
    }
}

function alAgua() {
    // Seleccionar un participante aleatorio con estado = true (que aún no haya ganado)
    if (participantes.length > 0) {
        let alAguaIndex;
        do {
            alAguaIndex = Math.floor(Math.random() * participantes.length);
        } while (participantes[alAguaIndex].estado === false);

        const perdedor = participantes[alAguaIndex];
        participantes[alAguaIndex].estado = false; // Marcar al participante como eliminado

        // Mostrar el resultado de "Al Agua"
        mostrarAlAgua(perdedor.id, perdedor.nombre);

        // Eliminar el participante de la lista
        participantes = participantes.filter(element => element.id !== perdedor.id);

        // Actualizar las listas
        actualizarListas();
    } else {
        alert("No hay más participantes disponibles para ir al agua.");
    }
}

function mostrarAlAgua(id, nombre) {
    document.getElementById('codigoAlAgua').textContent = '';
    document.getElementById('sorteo').style.display = 'none';
    document.getElementById('alAgua').style.display = 'block';

    document.getElementById('contadorAlAgua').style.display = 'block';
    document.getElementById('nombreAlAgua').textContent = '';
    document.getElementById('volverButtonAlAgua').style.display = 'none';

    let contador = 3;
    const contadorElemento = document.getElementById('contadorAlAgua');
    contadorElemento.textContent = contador;

    const interval = setInterval(() => {
        contador--;
        contadorElemento.textContent = contador;

        if (contador === 0) {
            clearInterval(interval);
            document.getElementById('contadorAlAgua').style.display = 'none';

            // Crear un span para el ID
            const labelId = document.createElement('span');
            labelId.textContent = id;
            labelId.id = 'labelIdAlAgua';
            document.getElementById('codigoAlAgua').appendChild(labelId);

            // Crear dos spans para mostrar "Participante al agua:"
            const labelAlAgua = document.createElement('span');
            labelAlAgua.textContent = 'Participante al agua: ';
            labelAlAgua.id = 'labelAlAgua';

            const nombreParticipante = document.createElement('span');
            nombreParticipante.textContent = nombre;
            nombreParticipante.id = 'nombreParticipanteAlAgua';

            // Insertar los elementos en el div correspondiente
            document.getElementById('nombreAlAgua').appendChild(labelAlAgua);
            document.getElementById('nombreAlAgua').appendChild(nombreParticipante);

            document.getElementById('volverButtonAlAgua').style.display = 'block';
        }
    }, 1000);
}

function volverAlSorteoDesdeAlAgua() {
    document.getElementById('alAgua').style.display = 'none';
    const premiosDisponibles = premios.filter(premio => premio.estado);
    if (premiosDisponibles.length > 0 && participantes.length > 0) {
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
            id: 12345,
            nombre: 'Participante 1',
            estado: true,
        },
        
    ];
    premios = [
        {
            nombre: 'Audífonos',
            estado: true,
        },
        {
            nombre: 'Parlante',
            estado: true,
        },
        {
            nombre: 'Kit Closet Kawaii',
            estado: true,
        },
        {
            nombre: 'Mouse',
            estado: true,
        },
        {
            nombre: 'Kit Logitech Teclado + Mouse',
            estado: true,
        },
        {
            nombre: 'Piercing',
            estado: true,
        },
        {
            nombre: 'Peluche Sanrio x Yugioh',
            estado: true,
        },
        {
            nombre: 'Cooler',
            estado: true,
        },
        {
            nombre: 'Cupón de Descuento',
            estado: true,
        },
        {
            nombre: 'Hervidor Electrico',
            estado: true,
        },
        {
            nombre: 'Tatuaje',
            estado: true,
        },
        {
            nombre: 'Kit Teros 4 en 1',
            estado: true,
        },
    ];
    
    ganadores = [];
    selectedPremioIndex = null;

    document.getElementById('finSorteo').style.display = 'none';
    document.getElementById('cargarDatos').style.display = 'block';
}
