import { EmotionalEvent } from '../models/emotional-event.model';
import { Phase } from '../models/phase.model';
import { Symptom } from '../models/symptom.model';
import { Technique } from '../models/technique.model';

// =============================================================================
//  EXPEDIENTE — contenido completo
//  Todo el texto de la experiencia vive aquí. Para reescribir cualquier frase
//  no hace falta tocar ningún componente: se edita en este archivo y ya.
// =============================================================================

export const DEPARTMENT = 'Departamento Técnico de Sentimientos No Controlados' as const;

export const DOSSIER = {
  id: 'EXP-DTSNC-2026 / ADGP-01',
  classification: 'INFORME CONFIDENCIAL',
  tags: ['URGENT', 'IMPORTANT', 'ALL'],
  title: 'Caso confirmado: me encantas demasiado',
  lockLine: 'Expediente clasificado',
  accessNote: 'Acceso restringido · Lectura autorizada a una sola persona',
  openAction: 'Abrir expediente',
} as const;

/** Fases en orden de lectura. `warmth` calienta el expediente hacia el final. */
export const PHASES: readonly Phase[] = [
  { id: 'fase-01', code: 'Fase 1', title: 'Identificación de la amenaza', warmth: 0 },
  { id: 'fase-02', code: 'Fase 2', title: 'Inicio del incidente', warmth: 0.04 },
  { id: 'fase-03', code: 'Fase 3', title: 'Técnicas malditas detectadas', warmth: 0.1 },
  { id: 'fase-04', code: 'Fase 4', title: 'Registro de daño emocional', warmth: 0.18 },
  { id: 'fase-05', code: 'Fase 5', title: 'Actualización del expediente', warmth: 0.5 },
  { id: 'conclusion', code: 'Conclusión', title: 'Veredicto final', warmth: 1 },
] as const;

// --- Fase 1 ------------------------------------------------------------------

export const SUBJECT = {
  name: 'Astrid Dyane González Piña',
  codename: 'LA AMENAZA',
  classification: 'Nivel: Especial',
  ability: 'Hacer que piense en ella todo el día, sin descanso ni tregua posible.',
  dangerLabel: 'Extremadamente alto',
  dangerValue: 100,
  dangerWarning: 'No se recomienda acercarse sin protección emocional.',
  photoNotice: 'Imagen restringida',
  photoSubnotice: 'El sujeto solicitó no adjuntar fotografía. El departamento la recuerda igual.',
  fields: [
    { key: 'Expediente', value: 'ADGP-01' },
    { key: 'Estado', value: 'Activo · sin contención' },
    { key: 'Primer contacto', value: 'Registrado' },
    { key: 'Antídoto', value: 'No disponible' },
  ],
} as const;

// --- Fase 2 ------------------------------------------------------------------

export const INCIDENT = {
  prologue:
    'Anteriormente se habían visualizado imágenes de la amenaza, pero el verdadero comienzo ocurrió en el sitio conocido por los ancestros como 2 templos.',
  location: '2 templos',
  symptomsTitle: 'Síntomas iniciales reportados',
  containment: {
    attempt: 'Se intentó calmar al sujeto con agua de horchata.',
    resultLabel: 'Resultado del protocolo',
    result: 'Fallido',
    footnote: 'El sujeto sonrió al vaso vacío. Se dio por perdido el intento.',
  },
  diagnosis: 'El diagnóstico fue inmediato.',
} as const;

export const SYMPTOMS: readonly Symptom[] = [
  { label: 'Sonrisas involuntarias', status: 'Registrado' },
  { label: 'Distracción frecuente', status: 'Registrado' },
  { label: 'Temblor en manos', status: 'Registrado' },
  { label: 'Nerviosismo', status: 'Registrado' },
  { label: 'Incapacidad para actuar normalmente', status: 'Crítico' },
] as const;

// --- Fase 3 ------------------------------------------------------------------

export const TECHNIQUES: readonly Technique[] = [
  {
    code: '01',
    name: 'Sonrisa devastadora',
    description: 'Capaz de desarmar cualquier defensa emocional en menos de 3 segundos.',
    icon: 'smile',
    grade: 'Clase B',
  },
  {
    code: '02',
    name: 'Mirada que baja el IQ',
    description: 'Efecto documentado: el sujeto olvida cómo hablar con coherencia.',
    icon: 'eye',
    grade: 'Clase B',
  },
  {
    code: '03',
    name: 'Manipulación emocional vía notas de voz',
    description:
      'Detectada una capacidad anómala para alterar el estado emocional del sujeto mediante audios enviados en momentos críticos.',
    icon: 'voice',
    grade: 'Clase A',
  },
  {
    code: '04',
    name: 'Expansión de dominio',
    alias: 'Hacerme extrañarte',
    description: 'Técnica de nivel maestro. Sin antídoto conocido.',
    icon: 'domain',
    grade: 'Clase especial',
    ultimate: true,
  },
] as const;

// --- Fase 4 ------------------------------------------------------------------

/** Máximo de la escala visual. El 11 llega al tope y rompe el límite. */
export const DAMAGE_SCALE_MAX = 11;
/** Umbral de seguridad marcado con línea punteada. */
export const DAMAGE_SAFETY_LIMIT = 10;

export const DAMAGE_EVENTS: readonly EmotionalEvent[] = [
  { label: 'Voz', value: 8, note: 'Daño sostenido' },
  { label: 'Verte', value: 9, note: 'Daño alto' },
  { label: 'Primera cita', value: 10, note: 'Umbral alcanzado' },
  { label: 'Primer abrazo', value: 10, note: 'Ejecución inmediata' },
  { label: 'Verte arreglada', value: 11, note: 'Fuera de escala', offScale: true },
];

export const DAMAGE_REPORT = {
  intro: 'Mediciones tomadas durante seis meses de exposición continua.',
  conclusionTitle: 'Conclusiones del análisis',
  conclusions: [
    'Los niveles de daño emocional superan todos los umbrales de seguridad establecidos.',
    'Se registran daños críticos al verte arreglada y ejecución inmediata cuando me abrazas.',
    'Inclusive el simple hecho de estar cerca es devastadoramente hermoso.',
  ],
  warning: 'No existe tratamiento.',
  aside: 'Ni pienso buscarlo.',
} as const;

// --- Fase 5 ------------------------------------------------------------------

export const REVIEW = {
  heading: 'Actualización del expediente',
  lines: [
    'Tras una revisión exhaustiva del caso, se detectó que la clasificación inicial fue prematura.',
    'Las señales observadas indican una posible reciprocidad emocional…',
  ],
  analysisLabel: 'Analizando reciprocidad',
  analysisLog: [
    'Cotejando notas de voz a deshoras…',
    'Revisando quién escribe primero…',
    'Midiendo duración de los abrazos…',
    'Contrastando miradas sostenidas…',
    'Evaluando “jaja” contra “JASDJ”…',
    'Compilando evidencia sentimental…',
  ],
  resultLabel: 'Resultado actual',
  resultPrimary: 'No confirmado…',
  resultSecondary: 'Peroooo tampoco negado.',
  statusLines: ['El sujeto permanece bajo observación…', '…aunque altamente ilusionado.'],
} as const;

// --- Conclusión --------------------------------------------------------------

export const VERDICT = {
  eyebrow: 'Conclusión',
  heading: 'Veredicto final',
  beats: [
    'Después de meses de investigación exhaustiva…',
    '…se concluye que efectivamente…',
    'eres mi persona favorita.',
  ],
} as const;

export const CLOSING = {
  lead: `El ${DEPARTMENT}`,
  lead2: 'cierra este expediente con una calificación de:',
  badge: 'Caso resuelto',
  badgeSub: 'Con éxito rotundo',
  sealed: 'Expediente cerrado.',
  meta: 'Archivado sin fecha de caducidad · Revisión permanente',
  restart: 'Volver a investigar',
} as const;

// --- Tarjeta de cumpleaños (pantalla principal) -------------------------------

export const BIRTHDAY = {
  envelopeNote: 'Tienes correspondencia',
  to: 'Para',
  name: 'Dyane',
  frontLine: 'Un pequeño detalle para ti.',
  openAction: 'Abrir tarjeta',
  eyebrow: 'Hoy es tu día',
  greeting: '¡Feliz cumpleaños,',
  message: [
    'Hoy el mundo celebra que existes, y yo lo celebro un poquito más fuerte que todos.',
    'Gracias por cada sonrisa, por los audios a deshoras y por convertir días normales en mis favoritos.',
    'Ojalá este nuevo año te trate tan bonito como tú haces sentir a quienes tenemos la suerte de estar cerca de ti.',
  ],
  wish: 'Que se cumpla todo lo que pidas al soplar las velas.',
  signOff: 'Con todo mi cariño,',
  signature: 'quien más te quiere',
  postscript: 'P.D. Esta tarjeta guarda un secreto. Dicen que el sello solo se rompe si insistes…',
  sealAlmost: 'Casi… una vez más.',
  sealLabel: 'Sello misterioso',
} as const;

// --- Secreto de la tarjeta ---------------------------------------------------

export const DOMAIN_OPENING = {
  kanji: '領域展開',
  title: 'Expansión de dominio',
  techniqueLabel: 'Técnica',
  technique: 'Hacerme extrañarte',
  note: 'Abriendo el expediente clasificado…',
} as const;

// --- Secuencia de apertura ---------------------------------------------------

export const BOOT_LOG: readonly string[] = [
  'Verificando credenciales del lector…',
  'Descifrando expediente ADGP-01…',
  'Cargando registros sentimentales…',
  'Desactivando protocolos de disimulo…',
  'Acceso concedido.',
];
