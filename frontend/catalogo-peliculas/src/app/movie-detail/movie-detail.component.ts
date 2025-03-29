import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie';
import { NavbarComponent } from '../shared/navbar/navbar.component';

/**
 * @description Componente para mostrar los detalles de una película específica
 * 
 * Este componente es responsable de:
 * - Obtener el ID de la película de los parámetros de la ruta
 * - Cargar los detalles de la película desde el servicio MovieService
 * - Mostrar la información detallada de la película
 * - Proporcionar navegación de regreso al catálogo
 * 
 * MODIFICACIONES (23/03/2025):
 * - Se importó RouterLink para habilitar la navegación mediante directivas en la plantilla
 * - Se agregó la propiedad 'deleting' para controlar el estado durante la eliminación
 * - Se implementó el método deleteMovie() para eliminar películas con confirmación de usuario
 * - Se mejoró el manejo de errores y feedback visual durante operaciones
 * - Se importó NavbarComponent para incluir la barra de navegación común en toda la aplicación
 * 
 * @usageNotes
 * Este componente se activa cuando el usuario navega a la ruta '/movies/:id'
 */
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  /** Almacena los datos de la película actual */
  movie: Movie | null = null;
  
  /** Indica si los datos están siendo cargados */
  loading: boolean = true;
  
  /** Mensaje de error si ocurre algún problema */
  error: string | null = null;
  
  /** Controla la visualización de información de depuración en la UI */
  debugInfo: boolean = false; // Desactivada la información de depuración

  /** Indica si la eliminación está en proceso */
  deleting: boolean = false;

  /**
   * Constructor del componente
   * @param route Servicio para acceder a los parámetros de la ruta
   * @param router Servicio para la navegación entre componentes
   * @param movieService Servicio para obtener datos de películas
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) { }

  /**
   * Método del ciclo de vida que se ejecuta cuando se inicializa el componente
   * Llama al método loadMovie para cargar los detalles de la película
   */
  ngOnInit(): void {
    console.log('MovieDetailComponent initialized');
    this.loadMovie();
  }

  /**
   * Carga los datos de la película desde el servicio MovieService
   * Utiliza el ID obtenido de los parámetros de la ruta
   * Maneja errores y estados de carga
   */
  loadMovie(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Attempting to load movie with ID:', id);
    
    if (!id) {
      this.error = 'ID de película no proporcionado';
      this.loading = false;
      console.error('No movie ID provided');
      return;
    }

    console.log('Calling movieService.getMovie with ID:', id);
    this.movieService.getMovie(+id).subscribe({
      next: (data) => {
        console.log('Movie data received:', data);
        // Verificar si data tiene las propiedades necesarias
        if (data) {
          this.movie = {
            id: data.id || +id,
            title: data.title || 'Sin título',
            year: data.year || 0,
            synopsis: data.synopsis || 'Sin descripción',
            cover: data.cover || ''
          };
          console.log('Movie object created:', this.movie);
        } else {
          this.error = 'Los datos recibidos no tienen el formato esperado';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading movie:', err);
        this.error = 'Error cargando película: ' + err.message;
        this.loading = false;
      }
    });
  }

  /**
   * Navega de regreso a la lista de películas
   * Se activa cuando el usuario hace clic en el botón "Volver al catálogo"
   */
  goBack(): void {
    this.router.navigate(['/movies']);
  }

  /**
   * Elimina la película actual después de solicitar confirmación
   * Se activa cuando el usuario hace clic en el botón "Eliminar"
   * 
   * MODIFICACIÓN (23/03/2025):
   * - Método implementado para proporcionar la funcionalidad de eliminación
   * - Incluye confirmación del usuario y manejo de estados durante la operación
   */
  deleteMovie(): void {
    if (!this.movie || !this.movie.id) {
      this.error = 'No se puede eliminar: ID de película no disponible';
      return;
    }

    // Solicitar confirmación al usuario
    if (!confirm(`¿Estás seguro de que deseas eliminar la película "${this.movie.title}"? Esta acción no se puede deshacer.`)) {
      return; // El usuario canceló la operación
    }

    this.deleting = true;
    this.movieService.deleteMovie(this.movie.id).subscribe({
      next: () => {
        console.log('Película eliminada correctamente');
        this.deleting = false;
        // Redirigir al usuario al catálogo de películas
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        console.error('Error al eliminar la película:', err);
        this.error = 'Error al eliminar la película: ' + err.message;
        this.deleting = false;
      }
    });
  }
}
