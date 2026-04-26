document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const contenedorFiltros = document.getElementById('contenedor-filtros');
    
    // Elementos del Modal
    const modal = document.getElementById('modal-detalle');
    const imgCarrusel = document.getElementById('imagen-carrusel');
    const btnPrev = document.getElementById('prev');
    const btnNext = document.getElementById('next');
    
    let inventario = [];
    let imagenesActuales = [];
    let indiceActual = 0;

    async function cargarProductos() {
        try {
            const respuesta = await fetch('productos.json');
            inventario = await respuesta.json();
            generarFiltros(inventario);
            mostrarProductos(inventario);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function generarFiltros(productos) {
        contenedorFiltros.innerHTML = '';
        const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))];
        
        categorias.forEach(cat => {
            const boton = document.createElement('button');
            boton.classList.add('btn-filtro');
            if (cat === 'Todas') boton.classList.add('activo');
            boton.textContent = cat;
            boton.dataset.categoria = cat;
            
            boton.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('activo'));
                e.target.classList.add('activo');
                const catSeleccionada = e.target.dataset.categoria;
                mostrarProductos(catSeleccionada === 'Todas' ? inventario : inventario.filter(p => p.categoria === catSeleccionada));
            });
            contenedorFiltros.appendChild(boton);
        });
    }

    function mostrarProductos(productosParaMostrar) {
        contenedorProductos.innerHTML = '';
        
        productosParaMostrar.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');
            // Usamos la primera imagen del array para la grilla
            tarjeta.innerHTML = `
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}" loading="lazy">
                <div class="tarjeta-info">
                    <h3>${producto.nombre}</h3>
                    <span class="id-producto">REF: ${producto.id}</span>
                </div>
            `;
            
            // Evento para abrir el modal al clickear la tarjeta
            tarjeta.addEventListener('click', () => abrirDetalle(producto));
            contenedorProductos.appendChild(tarjeta);
        });
    }

    // Lógica del Carrusel / Modal
    function abrirDetalle(producto) {
        imagenesActuales = producto.imagenes;
        indiceActual = 0;
        
        document.getElementById('modal-titulo').textContent = producto.nombre;
        document.getElementById('modal-id').textContent = `REF: ${producto.id}`;
        document.getElementById('modal-descripcion').textContent = producto.descripcion;
        
        // Si hay una sola imagen, ocultamos las flechas
        if (imagenesActuales.length <= 1) {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'none';
        } else {
            btnPrev.style.display = 'block';
            btnNext.style.display = 'block';
        }

        actualizarImagen();
        modal.style.display = "block";
    }

    function actualizarImagen() {
        imgCarrusel.src = imagenesActuales[indiceActual];
    }

    btnNext.onclick = () => {
        indiceActual = (indiceActual + 1) % imagenesActuales.length;
        actualizarImagen();
    };

    btnPrev.onclick = () => {
        indiceActual = (indiceActual - 1 + imagenesActuales.length) % imagenesActuales.length;
        actualizarImagen();
    };

    // Cerrar modal con la X
    document.querySelector('.cerrar-modal').onclick = () => modal.style.display = "none";

    // Cerrar modal si hacen click afuera del recuadro blanco
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };

    cargarProductos();
});