document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const contenedorFiltrosPrincipales = document.querySelectorAll('.btn-custom-principal');
    const contenedorFiltrosSecundarios = document.getElementById('contenedor-filtros-secundarios');
    const inputBusqueda = document.getElementById('input-busqueda');
    
    const modalDetalle = new bootstrap.Modal(document.getElementById('modal-detalle'));
    const imgCarrusel = document.getElementById('imagen-carrusel');
    const btnPrev = document.getElementById('prev');
    const btnNext = document.getElementById('next');
    
    let inventario = [];
    let imagenesActuales = [];
    let indiceActual = 0;
    
    let categoriaPrincipalActual = 'Escenografia';
    let subcategoriaActual = 'Todas';

    async function cargarProductos() {
        try {
            const respuesta = await fetch('productos.json');
            inventario = await respuesta.json();
            generarSubfiltros();
            filtrarYMostrar();
        } catch (error) {
            console.error("Error al cargar JSON:", error);
        }
    }

    contenedorFiltrosPrincipales.forEach(boton => {
        boton.addEventListener('click', (e) => {
            contenedorFiltrosPrincipales.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            categoriaPrincipalActual = e.target.getAttribute('data-principal');
            subcategoriaActual = 'Todas'; 
            generarSubfiltros();
            filtrarYMostrar();
        });
    });

    function generarSubfiltros() {
        contenedorFiltrosSecundarios.innerHTML = '';
        const productosDeEstaArea = inventario.filter(p => p.categoriaPrincipal === categoriaPrincipalActual);
        const subcategorias = ['Todas', ...new Set(productosDeEstaArea.map(p => p.categoria))];
        
        subcategorias.forEach(sub => {
            const boton = document.createElement('button');
            boton.classList.add('btn-custom-secundario');
            if (sub === 'Todas') boton.classList.add('active');
            boton.textContent = sub;
            
            boton.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-custom-secundario').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                subcategoriaActual = sub;
                filtrarYMostrar();
            });
            contenedorFiltrosSecundarios.appendChild(boton);
        });
    }

    function filtrarYMostrar() {
        const termino = inputBusqueda.value.toLowerCase();
        const resultados = inventario.filter(p => {
            const coincidePrincipal = (p.categoriaPrincipal === categoriaPrincipalActual);
            const coincideSub = (subcategoriaActual === 'Todas' || p.categoria === subcategoriaActual);
            const coincideBusqueda = (p.nombre.toLowerCase().includes(termino) || p.id.toLowerCase().includes(termino));
            return coincidePrincipal && coincideSub && coincideBusqueda;
        });
        mostrarProductos(resultados);
    }

    function mostrarProductos(productos) {
        contenedorProductos.innerHTML = '';
        
        if(productos.length === 0) {
            // Se modificó text-start por text-center para acompañar el diseño centrado
            contenedorProductos.innerHTML = '<div class="col-12 text-center text-muted mt-5">No se encontraron resultados.</div>';
            return;
        }

        productos.forEach((p, index) => {
            const col = document.createElement('div');
            col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 fade-in-up';
            col.style.animationDelay = `${index * 0.05}s`;
            
            col.innerHTML = `
                <div class="card h-100 custom-card">
                    <div class="img-wrapper">
                        <img src="${p.imagenes[0]}" alt="${p.nombre}" loading="lazy">
                    </div>
                    <div class="card-body text-center d-flex flex-column justify-content-center">
                        <h3 class="card-title h6 fw-bold mb-1">${p.nombre}</h3>
                        <p class="card-text id-producto mb-0 small fw-bold">REF: ${p.id}</p>
                    </div>
                </div>
            `;
            
            col.addEventListener('click', () => abrirDetalle(p));
            contenedorProductos.appendChild(col);
        });
    }

    function abrirDetalle(producto) {
        imagenesActuales = producto.imagenes;
        indiceActual = 0;
        document.getElementById('modal-titulo').textContent = producto.nombre;
        document.getElementById('modal-id').textContent = `REF: ${producto.id}`;
        document.getElementById('modal-descripcion').textContent = producto.descripcion;
        
        btnPrev.style.display = imagenesActuales.length > 1 ? 'block' : 'none';
        btnNext.style.display = imagenesActuales.length > 1 ? 'block' : 'none';

        actualizarImagen();
        modalDetalle.show();
    }

    function actualizarImagen() { imgCarrusel.src = imagenesActuales[indiceActual]; }
    
    btnNext.onclick = () => { indiceActual = (indiceActual + 1) % imagenesActuales.length; actualizarImagen(); };
    btnPrev.onclick = () => { indiceActual = (indiceActual - 1 + imagenesActuales.length) % imagenesActuales.length; actualizarImagen(); };

    inputBusqueda.addEventListener('input', filtrarYMostrar);
    cargarProductos();
});