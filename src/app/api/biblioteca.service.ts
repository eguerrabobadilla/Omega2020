import { Injectable } from '@angular/core';
import { apiBase } from './apiBase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaService extends apiBase {

    testApi: string;
	APIUrl: string;


  	constructor(public http: HttpClient) {
     	super();
    	this.Ws = 'api/biblioteca';
    	this.testApi = 'https://www.breakingbadapi.com/api';
		
		// https://www.alfalbs.app/ApiOmega/api/biblioteca/filter/video/video/0/3
		//https://localhost:5001/api/biblioteca/infinite/0/2/Mapa
		//biblioteca/infinite/0/2/Mapa
		// biblioteca/filter/{skip}/{take}/{tipo}
		// /api/bibliotecafavoritos/filter/Flora/0/4
		//http://localhost:5000/api/bibliotecafavoritos/filter/{text}/{skip}/{take}

		// editar recurso
		// http://localhost:5000/api/biblioteca/55340
  	}


	//   http://localhost:5000/api/biblioteca
		// 	"Titulo": "Test",
		// 	"Tipo": "Audio",
		// 	"Descripcion": "Test",
		// 	"Ano": "2020",
		// 	"Mes": "Diciembre",
		// 	"Semana": "Semana 2",
		// 	"MateriaId": 8,
		// 	"Grado": 1,
		// 	"Grupo": "A",
		// 	"GrupoIngles": "NO",
		// 	"RecursosDetalles" : [
		// 		{
		// 			"PathRecurso": "lobo.png",
		// 			"PathRecursoUser": "lobo.png"
		// 		},
		// 		{
		// 			"PathRecurso": "perro.png",
		// 			"PathRecursoUser": "perro.png"
		// 		}
		// 	]
		// }
	
	addBibliotecaRecurso(datos): Observable <any[]> {
		return this.http.post<any[]>(`${this.url}/${this.Ws}/`, datos);
	}

	editBibliotecaRecurso(datos): Observable <any[]> {
		return this.http.put<any[]>(`${this.url}/${this.Ws}/${datos.Id}`, datos);
	}

	getBibliotecaTotales(): Observable <any[]> {
		return this.http.get<any[]>(`${this.url}/${this.Ws}/totales`);
	}


	getBibliotecaDatosInfinite(tipo, skip, limit): Observable<any[]> {
		return this.http.get<any[]>(`${this.url}/${this.Ws}/infinite/${skip}/${limit}/${tipo}`);
	}
	
	//"filter/video/video/0/3";
	getBibliotecaBuscarDatos(tipo, palabra, skip): Observable<any[]> {
		return this.http.get<any[]>(`${this.url}/${this.Ws}/filter/${tipo}/${palabra}/${skip}/8`);
	}


	//FAVORITOS PART
	addRecursoToFavoritos(data): Observable<any[]> {
		//http://10.14.10.154:5000/api/bibliotecafavoritos
		return this.http.post<any[]>(`${this.url}/api/bibliotecafavoritos`, data);
	}

	deleteRecursoToFavoritos(data): Observable<any[]> {
		//http://10.14.10.154:5000/api/bibliotecafavoritos
		return this.http.put<any[]>(`${this.url}/api/bibliotecafavoritos`, data);
	}
	
	getBibliotecaFavoritos(skip, limit): Observable<any[]> {
		return this.http.get<any[]>(`${this.url}/api/bibliotecafavoritos/infinite/${skip}/${limit}`);
	}

	getBibliotecaFavoritosSearch(params): Observable <any[]> {
		return this.http.get<any[]>(`${this.url}/api/bibliotecafavoritos/filter/${params}/0/8`);
	}

    //get totales en tipos de archivos
    getAllCharacters(): Observable<any[]> {
        return this.http.get<any[]>(`${this.testApi}/characters`);
    }
    getCharactersLimit(datos: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.testApi}/characters?${datos}`);
    }
	getSearchCharacters(dato): Observable<any[]> {
		let text = dato.replace(/ /g, '+');
		return this.http.get<any[]>(`${this.testApi}/characters?name=${text}`);
	}

}
