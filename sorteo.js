import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//TODO LO DE ARRIBA ES DE FIREBASE

document.addEventListener('DOMContentLoaded', function() {
    // GENERAR 3 PANELES
    generarPanel(1, 100, 'tablaBody1');   // 1-100
    generarPanel(101, 200, 'tablaBody2'); // 101-200  
    generarPanel(201, 300, 'tablaBody3'); // 201-300

    cargarDatosExistentes();

    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('formDatos');
    const btnLimpiar = document.getElementById('btnLimpiar');
    let currentCell = null;

    // Click en celdas
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'TD') {
            const cell = e.target;
            const number = cell.dataset.number;
            
            if (cell.classList.contains('blocked')) {
                mostrarDatosBloqueado(number);
            } else {
                cell.classList.add('selected');
                currentCell = cell;
                document.getElementById('numeroSeleccionado').textContent = number;
                modal.style.display = 'block';
            }
        }
    });

    // BOTÓN LIMPIAR con CLAVE SECRETA
    btnLimpiar.addEventListener('click', function() {
        const clave = prompt('🔐 Ingresa la clave para limpiar registros:');
        
        if (clave === 'Viaje.EEUU.2026') {
            if (confirm('⚠️ ¿Estás seguro de que quieres ELIMINAR TODOS los registros?\n\nEsta acción no se puede deshacer.')) {
                localStorage.removeItem('registros');
                alert('✅ Registros eliminados correctamente');
                location.reload();
            }
        } else {
            // Animación de error
            btnLimpiar.style.animation = 'shake 0.5s';
            setTimeout(() => {
                btnLimpiar.style.animation = '';
            }, 500);
            
            // Opcional: mostrar mensaje sutil
            setTimeout(() => {
                alert('❌ Clave incorrecta');
            }, 100);
        }
    });

    // FUNCIÓN GENERAR PANEL
    function generarPanel(inicio, fin, tbodyId) {
        const tbody = document.getElementById(tbodyId);
        const filas = Math.ceil((fin - inicio + 1) / 10);
        
        for (let fila = 0; fila < filas; fila++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < 10; col++) {
                const numero = inicio + (fila * 10) + col;
                if (numero <= fin) {
                    const td = document.createElement('td');
                    td.textContent = numero;
                    td.setAttribute('data-number', numero);
                    tr.appendChild(td);
                }
            }
            tbody.appendChild(tr);
        }
    }

    // CARGAR DATOS EXISTENTES
    function cargarDatosExistentes() {
        //const registros = JSON.parse(localStorage.getItem('registros') || '[]');
	//const registros = JSON.parse(addDoc(collection(db, "registros"), data);
        const registros = await addDoc(collection(db, "registros"), data);
        registros.forEach(registro => {
            const cell = document.querySelector(`td[data-number="${registro.numero}"]`);
            if (cell) {
                cell.classList.add('blocked');
                cell.title = `${registro.nombre} ${registro.apellido}`;
            }
        });
    }

async function cargarDatosExistentes() {
    const querySnapshot = await getDocs(collection(db, "registros"));
    querySnapshot.forEach((doc) => {
        const registro = doc.data();
        const cell = document.querySelector(`td[data-number="${registro.numero}"]`);
        if (cell) {
            cell.classList.add('blocked');
            cell.title = `${registro.nombre} ${registro.apellido}`;
        }
    });
}

    // MOSTRAR DATOS BLOQUEADO
    function mostrarDatosBloqueado(numero) {
        const registros = JSON.parse(localStorage.getItem('registros') || '[]');
        const registro = registros.find(r => r.numero == numero);
        
        if (registro) {
            const modalContent = `
                <span class="close">&times;</span>
                <h3>📋 Número ${numero} - DATOS</h3>
                <div class="datos-bloqueado">
                    <p><strong>Nombre:</strong> ${registro.nombre}</p>
                    <p><strong>Apellido:</strong> ${registro.apellido}</p>
                    <p><strong>Observación:</strong> ${registro.observacion}</p>
                    <p><strong>Fecha:</strong> ${registro.fecha}</p>
                </div>
                <button onclick="cerrarModal()" class="btn-cerrar">Cerrar</button>
            `;
            document.querySelector('.modal-content').innerHTML = modalContent;
            modal.style.display = 'block';
        }
    }

    // Cerrar modales
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        if (currentCell && !currentCell.classList.contains('blocked')) {
            currentCell.classList.remove('selected');
        }
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            if (currentCell && !currentCell.classList.contains('blocked')) {
                currentCell.classList.remove('selected');
            }
        }
    });

    // Guardar
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const observacion = document.getElementById('observacion').value;
        
        if (!nombre || !apellido) {
            alert('❌ Nombre y Apellido son obligatorios');
            return;
        }
        
        const data = {
            numero: document.getElementById('numeroSeleccionado').textContent,
            nombre: nombre,
            apellido: apellido,
            observacion: observacion || 'Sin observación',
            fecha: new Date().toLocaleString('es-AR')
        };
        
        let registros = JSON.parse(localStorage.getItem('registros') || '[]');
        registros.push(data);
        localStorage.setItem('registros', JSON.stringify(registros));
        
        if (currentCell) {
            currentCell.classList.remove('selected');
            currentCell.classList.add('blocked');
            currentCell.title = `${nombre} ${apellido}`;
        }
        
        form.reset();
        modal.style.display = 'none';
        currentCell = null;
        alert(`✅ Guardado: ${nombre} ${apellido} - Nº ${data.numero}`);
    });
});

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}


//---------------agregado-de-chatgpt

// IMPORTAR FIREBASE (arriba de todo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// CONFIGURACIÓN (te la da Firebase)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

await addDoc(collection(db, "registros"), data);


const querySnapshot = await getDocs(collection(db, "registros"));
querySnapshot.forEach((doc) => {
  const registro = doc.data();
  const cell = document.querySelector(`td[data-number="${registro.numero}"]`);
  if (cell) {
    cell.classList.add('blocked');
    cell.title = `${registro.nombre} ${registro.apellido}`;
  }
});