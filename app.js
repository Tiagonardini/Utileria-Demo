document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const contenedorFiltros = document.getElementById('contenedor-filtros');
    let inventario = [];

    // Cargar los datos desde el JSON local
    async function cargarProductos() {
        try {
            const respuesta = await fetch('productos.json');
            inventario = await respuesta.json();
            
            generarFiltros(inventario);
            mostrarProductos(inventario);
        } catch (error) {
            console.error("Error cargando el JSON:", error);
            contenedorProductos.innerHTML = '<p>Error al cargar el catálogo. Verificá que XAMPP esté corriendo.</p>';
        }
    }

    // Extraer categorías únicas y crear los botones
    function generarFiltros(productos) {
        const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))];
        
        categorias.forEach(cat => {
            const boton = document.createElement('button');
            boton.classList.add('btn-filtro');
            if (cat === 'Todas') boton.classList.add('activo');
            
            boton.textContent = cat;
            boton.dataset.categoria = cat;
            
            boton.addEventListener('click', (e) => {
                // Cambiar el estilo del botón activo
                document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('activo'));
                e.target.classList.add('activo');
                
                // Filtrar el array
                const catSeleccionada = e.target.dataset.categoria;
                if (catSeleccionada === 'Todas') {
                    mostrarProductos(inventario);
                } else {
                    mostrarProductos(inventario.filter(p => p.categoria === catSeleccionada));
                }
            });
            
            contenedorFiltros.appendChild(boton);
        });
    }

    // Generar el HTML de las tarjetas
    function mostrarProductos(productosParaMostrar) {
        contenedorProductos.innerHTML = '';
        
        if (productosParaMostrar.length === 0) {
            contenedorProductos.innerHTML = '<p>No hay productos en esta categoría.</p>';
            return;
        }

        productosParaMostrar.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta');
            
            tarjeta.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                <div class="tarjeta-info">
                    <h3>${producto.nombre}</h3>
                    <span class="id-producto">REF: ${producto.id}</span>
                </div>
            `;
            
            contenedorProductos.appendChild(tarjeta);
        });
    }

    // Iniciar la app
    cargarProductos();
});