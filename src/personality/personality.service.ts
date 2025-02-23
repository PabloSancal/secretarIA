/**
 * PersonalityService - Servicio que maneja el test de personalidad.
 *
 * Este servicio carga las preguntas desde un archivo y evalúa las respuestas del usuario
 * para determinar su tipo de personalidad.
 */
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PersonalityService {
  private readonly logger = new Logger(PersonalityService.name);
  private questions: any[];

  constructor() {
    this.loadQuestions();
  }

  private loadQuestions() {
    try {
      const filePath = path.join(__dirname, '../../src/personality/questions.json');
      console.log(filePath)
      const data = fs.readFileSync(filePath, 'utf8');
      this.questions = JSON.parse(data);
      this.logger.log('Preguntas de personalidad cargadas exitosamente.');
    } catch (error) {
      this.logger.error('Error cargando las preguntas de personalidad:', error);
      this.questions = [];
    }
  }

  /**
   * Obtiene todas las preguntas del test de personalidad.
   * @returns Lista de preguntas.
   */
  getQuestions(): any[] {
    return this.questions;
  }

  /**
   * Evalúa las respuestas del usuario y determina un tipo de personalidad.
   * @param answers Respuestas del usuario.
   * @returns Tipo de personalidad determinado.
   */
  evaluateAnswers(answers: any[]): string {
    // Lógica para evaluar las respuestas y determinar la personalidad.
    // Esta parte debe implementarse según la metodología del test.
    this.logger.log('Evaluando respuestas del usuario...');
    return 'Tipo de personalidad generado';
  }
}
