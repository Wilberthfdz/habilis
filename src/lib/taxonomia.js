/**
 * HABILIS — TAXONOMÍA DE OFICIOS TÉCNICOS (MÉXICO)
 * ================================================
 *
 * Estructura de 3 niveles:
 *   Nivel 1  categoria      → el ramo grande (lo que ve el usuario en el landing)
 *   Nivel 2  subcategoria   → la especialización real del técnico
 *   Nivel 3  especialidad   → el detalle fino (marca, tecnología o aplicación)
 *
 * IMPORTANTE — el nivel 3 NO siempre es marca.
 * Cada subcategoría declara `tipoNivel3` con uno de estos valores:
 *   'marca'       → Nissan, Ford, Carrier...
 *   'tecnologia'  → VRF, chiller, inverter...
 *   'aplicacion'  → residencial, industrial, media tensión...
 *   'material'    → cobre, PVC, acero inoxidable...
 *
 * Las marcas viven TAMBIÉN en el catálogo MARCAS de abajo, como etiquetas
 * cruzadas del perfil del técnico. No metas todas las marcas al árbol:
 * 20 marcas × 8 subcategorías = 160 nodos que nadie navega.
 *
 * Referencias oficiales:
 *   sinco → Sistema Nacional de Clasificación de Ocupaciones (INEGI)
 *   ec    → Estándar de Competencia (CONOCER), sirve para verificación real
 *
 * Última actualización: agosto 2026
 */

export const TAXONOMIA = [

  // ══════════════════════════════════════════════════════════════
  {
    id: 'clima',
    nombre: 'Climatización y Refrigeración',
    icono: 'snowflake',
    sinco: '2637',
    descripcion: 'Aire acondicionado, refrigeración comercial e industrial, cadena de frío.',
    keywords: ['aire acondicionado', 'clima', 'refri', 'refrigeracion', 'hvac', 'frio', 'minisplit'],
    subcategorias: [
      {
        id: 'clima.minisplit',
        nombre: 'Minisplits y equipos residenciales',
        tipoNivel3: 'tecnologia',
        ec: ['EC1390'],
        keywords: ['minisplit', 'mini split', 'split', 'aire de casa', 'ventana'],
        especialidades: [
          { id: 'clima.minisplit.inverter', nombre: 'Inverter' },
          { id: 'clima.minisplit.convencional', nombre: 'Convencional (on/off)' },
          { id: 'clima.minisplit.multisplit', nombre: 'Multisplit' },
          { id: 'clima.minisplit.ventana', nombre: 'Ventana' },
          { id: 'clima.minisplit.portatil', nombre: 'Portátil' },
          { id: 'clima.minisplit.instalacion', nombre: 'Instalación desde cero' },
          { id: 'clima.minisplit.mantenimiento', nombre: 'Mantenimiento y lavado' },
        ],
      },
      {
        id: 'clima.central',
        nombre: 'Aire acondicionado central',
        tipoNivel3: 'tecnologia',
        ec: ['EC0506'],
        keywords: ['central', 'ducteria', 'ductos', 'paquete', 'fan coil'],
        especialidades: [
          { id: 'clima.central.paquete', nombre: 'Equipos paquete' },
          { id: 'clima.central.dividido', nombre: 'Sistema dividido (condensadora + manejadora)' },
          { id: 'clima.central.fancoil', nombre: 'Fan coils' },
          { id: 'clima.central.ducteria', nombre: 'Ductería y difusores' },
          { id: 'clima.central.balanceo', nombre: 'Balanceo de aire' },
        ],
      },
      {
        id: 'clima.vrf',
        nombre: 'VRF / VRV y chillers',
        tipoNivel3: 'tecnologia',
        keywords: ['vrf', 'vrv', 'chiller', 'enfriador', 'flujo variable'],
        especialidades: [
          { id: 'clima.vrf.vrf', nombre: 'Sistemas VRF / VRV' },
          { id: 'clima.vrf.chiller_aire', nombre: 'Chiller enfriado por aire' },
          { id: 'clima.vrf.chiller_agua', nombre: 'Chiller enfriado por agua' },
          { id: 'clima.vrf.torres', nombre: 'Torres de enfriamiento' },
          { id: 'clima.vrf.bombeo', nombre: 'Bombeo de agua helada' },
          { id: 'clima.vrf.manejadoras', nombre: 'Manejadoras de aire (UMA)' },
        ],
      },
      {
        id: 'clima.comercial',
        nombre: 'Refrigeración comercial',
        tipoNivel3: 'aplicacion',
        ec: ['EC0506', 'EC1389'],
        keywords: ['camara fria', 'congelador', 'vitrina', 'exhibidor', 'cuarto frio'],
        especialidades: [
          { id: 'clima.comercial.camaras', nombre: 'Cámaras frigoríficas' },
          { id: 'clima.comercial.vitrinas', nombre: 'Vitrinas y exhibidores' },
          { id: 'clima.comercial.congeladores', nombre: 'Congeladores y conservadores' },
          { id: 'clima.comercial.maquinas_hielo', nombre: 'Máquinas de hielo' },
          { id: 'clima.comercial.cocina', nombre: 'Refrigeración para cocina industrial' },
          { id: 'clima.comercial.autocontenidos', nombre: 'Equipos autocontenidos' },
        ],
      },
      {
        id: 'clima.industrial',
        nombre: 'Refrigeración industrial',
        tipoNivel3: 'tecnologia',
        keywords: ['amoniaco', 'industrial', 'planta', 'proceso'],
        especialidades: [
          { id: 'clima.industrial.amoniaco', nombre: 'Sistemas de amoniaco (NH3)' },
          { id: 'clima.industrial.co2', nombre: 'Sistemas de CO2 transcrítico' },
          { id: 'clima.industrial.tunel', nombre: 'Túneles de congelación' },
          { id: 'clima.industrial.proceso', nombre: 'Enfriamiento de proceso' },
        ],
      },
      {
        id: 'clima.especialidades',
        nombre: 'Especialidades técnicas',
        tipoNivel3: 'tecnologia',
        keywords: ['fuga', 'recuperacion', 'refrigerante', 'soldadura cobre', 'vacio'],
        especialidades: [
          { id: 'clima.especialidades.fugas', nombre: 'Detección y reparación de fugas' },
          { id: 'clima.especialidades.recuperacion', nombre: 'Recuperación y manejo de refrigerantes' },
          { id: 'clima.especialidades.soldadura', nombre: 'Soldadura de cobre y plata' },
          { id: 'clima.especialidades.retrofit', nombre: 'Retrofit de refrigerantes' },
          { id: 'clima.especialidades.controles', nombre: 'Controles y termostatos' },
          { id: 'clima.especialidades.eficiencia', nombre: 'Diagnóstico de eficiencia energética' },
        ],
      },
      {
        id: 'clima.marino_hotel',
        nombre: 'Clima marino y hotelero',
        tipoNivel3: 'aplicacion',
        nota: 'Alta demanda en la zona de Quintana Roo',
        keywords: ['yate', 'barco', 'hotel', 'resort', 'marino'],
        especialidades: [
          { id: 'clima.marino_hotel.yates', nombre: 'Aire acondicionado marino / yates' },
          { id: 'clima.marino_hotel.hoteles', nombre: 'Clima en hoteles y resorts' },
          { id: 'clima.marino_hotel.corrosion', nombre: 'Tratamiento anticorrosión salina' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'electricidad',
    nombre: 'Electricidad',
    icono: 'zap',
    sinco: '2632',
    descripcion: 'Instalaciones eléctricas residenciales, comerciales e industriales.',
    keywords: ['electricista', 'electrico', 'luz', 'corriente', 'instalacion electrica'],
    subcategorias: [
      {
        id: 'electricidad.residencial',
        nombre: 'Instalaciones residenciales',
        tipoNivel3: 'aplicacion',
        ec: ['EC0118'],
        keywords: ['casa', 'departamento', 'contacto', 'apagador', 'foco'],
        especialidades: [
          { id: 'electricidad.residencial.nueva', nombre: 'Instalación nueva' },
          { id: 'electricidad.residencial.reparacion', nombre: 'Reparación y diagnóstico' },
          { id: 'electricidad.residencial.tablero', nombre: 'Tableros y centros de carga' },
          { id: 'electricidad.residencial.iluminacion', nombre: 'Iluminación y LED' },
          { id: 'electricidad.residencial.tierra', nombre: 'Sistemas de tierra física' },
          { id: 'electricidad.residencial.medidor', nombre: 'Trámites y medidor CFE' },
        ],
      },
      {
        id: 'electricidad.comercial',
        nombre: 'Instalaciones comerciales',
        tipoNivel3: 'aplicacion',
        keywords: ['local', 'oficina', 'plaza', 'comercio'],
        especialidades: [
          { id: 'electricidad.comercial.locales', nombre: 'Locales y oficinas' },
          { id: 'electricidad.comercial.iluminacion', nombre: 'Iluminación comercial' },
          { id: 'electricidad.comercial.emergencia', nombre: 'Circuitos de emergencia' },
          { id: 'electricidad.comercial.canalizacion', nombre: 'Canalización y charolas' },
        ],
      },
      {
        id: 'electricidad.industrial',
        nombre: 'Instalaciones industriales',
        tipoNivel3: 'aplicacion',
        ec: ['EC1157'],
        keywords: ['industrial', 'planta', 'fabrica', 'maquinaria'],
        especialidades: [
          { id: 'electricidad.industrial.fuerza', nombre: 'Circuitos de fuerza' },
          { id: 'electricidad.industrial.tableros', nombre: 'Tableros de control y CCM' },
          { id: 'electricidad.industrial.trifasico', nombre: 'Sistemas trifásicos' },
          { id: 'electricidad.industrial.arranque', nombre: 'Arrancadores y protecciones' },
          { id: 'electricidad.industrial.termografia', nombre: 'Termografía y mantenimiento predictivo' },
        ],
      },
      {
        id: 'electricidad.media_tension',
        nombre: 'Media y alta tensión',
        tipoNivel3: 'aplicacion',
        nota: 'Requiere certificación obligatoria — validar credenciales',
        keywords: ['media tension', 'subestacion', 'transformador', 'alta tension'],
        especialidades: [
          { id: 'electricidad.media_tension.subestaciones', nombre: 'Subestaciones' },
          { id: 'electricidad.media_tension.transformadores', nombre: 'Transformadores' },
          { id: 'electricidad.media_tension.pruebas', nombre: 'Pruebas eléctricas y puesta en servicio' },
          { id: 'electricidad.media_tension.lineas', nombre: 'Líneas aéreas y subterráneas' },
        ],
      },
      {
        id: 'electricidad.respaldo',
        nombre: 'Respaldo de energía',
        tipoNivel3: 'tecnologia',
        keywords: ['planta de luz', 'generador', 'ups', 'no break', 'bateria'],
        especialidades: [
          { id: 'electricidad.respaldo.plantas', nombre: 'Plantas de emergencia' },
          { id: 'electricidad.respaldo.ups', nombre: 'UPS y no-breaks' },
          { id: 'electricidad.respaldo.transferencia', nombre: 'Transferencias automáticas' },
          { id: 'electricidad.respaldo.baterias', nombre: 'Bancos de baterías' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'plomeria',
    nombre: 'Plomería e Hidráulica',
    icono: 'droplet',
    sinco: '7141',
    descripcion: 'Agua potable, drenaje, sanitarios y sistemas hidráulicos.',
    keywords: ['plomero', 'plomeria', 'fuga de agua', 'tuberia', 'drenaje', 'hidraulica'],
    subcategorias: [
      {
        id: 'plomeria.agua',
        nombre: 'Agua potable',
        tipoNivel3: 'material',
        keywords: ['fuga', 'tuberia', 'presion', 'agua'],
        especialidades: [
          { id: 'plomeria.agua.cobre', nombre: 'Tubería de cobre' },
          { id: 'plomeria.agua.cpvc', nombre: 'CPVC' },
          { id: 'plomeria.agua.pex', nombre: 'PEX' },
          { id: 'plomeria.agua.hidroneumatico', nombre: 'Hidroneumáticos' },
          { id: 'plomeria.agua.fugas', nombre: 'Detección de fugas' },
        ],
      },
      {
        id: 'plomeria.drenaje',
        nombre: 'Drenaje y sanitario',
        tipoNivel3: 'aplicacion',
        keywords: ['drenaje', 'coladera', 'destape', 'wc', 'fosa'],
        especialidades: [
          { id: 'plomeria.drenaje.destape', nombre: 'Destape y desazolve' },
          { id: 'plomeria.drenaje.instalacion', nombre: 'Instalación sanitaria' },
          { id: 'plomeria.drenaje.camara', nombre: 'Videoinspección con cámara' },
          { id: 'plomeria.drenaje.fosas', nombre: 'Fosas sépticas y biodigestores' },
          { id: 'plomeria.drenaje.pluvial', nombre: 'Drenaje pluvial' },
        ],
      },
      {
        id: 'plomeria.muebles',
        nombre: 'Muebles de baño y cocina',
        tipoNivel3: 'aplicacion',
        keywords: ['wc', 'lavabo', 'regadera', 'tarja', 'llave'],
        especialidades: [
          { id: 'plomeria.muebles.bano', nombre: 'Instalación de muebles de baño' },
          { id: 'plomeria.muebles.griferia', nombre: 'Grifería y mezcladoras' },
          { id: 'plomeria.muebles.cocina', nombre: 'Tarjas y cocina' },
        ],
      },
      {
        id: 'plomeria.calentadores',
        nombre: 'Calentadores de agua',
        tipoNivel3: 'tecnologia',
        keywords: ['boiler', 'calentador', 'paso', 'deposito'],
        especialidades: [
          { id: 'plomeria.calentadores.deposito', nombre: 'De depósito' },
          { id: 'plomeria.calentadores.paso', nombre: 'De paso' },
          { id: 'plomeria.calentadores.solar', nombre: 'Solares' },
          { id: 'plomeria.calentadores.electrico', nombre: 'Eléctricos' },
        ],
      },
      {
        id: 'plomeria.bombeo',
        nombre: 'Bombeo y cisternas',
        tipoNivel3: 'tecnologia',
        keywords: ['bomba', 'cisterna', 'tinaco', 'presurizado'],
        especialidades: [
          { id: 'plomeria.bombeo.bombas', nombre: 'Bombas centrífugas y sumergibles' },
          { id: 'plomeria.bombeo.presurizado', nombre: 'Sistemas presurizados' },
          { id: 'plomeria.bombeo.cisternas', nombre: 'Cisternas y tinacos' },
          { id: 'plomeria.bombeo.pozos', nombre: 'Pozos y equipos sumergibles' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'mecanica',
    nombre: 'Mecánica Automotriz y Equipos',
    icono: 'wrench',
    sinco: '2634',
    descripcion: 'Reparación de vehículos, motores y maquinaria móvil.',
    keywords: ['mecanico', 'taller', 'carro', 'auto', 'motor', 'vehiculo'],
    subcategorias: [
      {
        id: 'mecanica.gasolina',
        nombre: 'Motor a gasolina',
        tipoNivel3: 'marca',
        keywords: ['gasolina', 'afinacion', 'motor', 'auto'],
        especialidades: [
          { id: 'mecanica.gasolina.nissan', nombre: 'Nissan' },
          { id: 'mecanica.gasolina.vw', nombre: 'Volkswagen' },
          { id: 'mecanica.gasolina.chevrolet', nombre: 'Chevrolet / GM' },
          { id: 'mecanica.gasolina.ford', nombre: 'Ford' },
          { id: 'mecanica.gasolina.toyota', nombre: 'Toyota' },
          { id: 'mecanica.gasolina.honda', nombre: 'Honda' },
          { id: 'mecanica.gasolina.mitsubishi', nombre: 'Mitsubishi' },
          { id: 'mecanica.gasolina.kia_hyundai', nombre: 'Kia / Hyundai' },
          { id: 'mecanica.gasolina.europeos', nombre: 'Europeos (BMW, Audi, Mercedes)' },
          { id: 'mecanica.gasolina.chinos', nombre: 'Chinos (MG, Chirey, BYD, JAC)' },
          { id: 'mecanica.gasolina.multimarca', nombre: 'Multimarca' },
        ],
      },
      {
        id: 'mecanica.diesel',
        nombre: 'Motor diésel',
        tipoNivel3: 'aplicacion',
        keywords: ['diesel', 'camion', 'trailer', 'pesado'],
        especialidades: [
          { id: 'mecanica.diesel.ligero', nombre: 'Diésel ligero (pickups, vans)' },
          { id: 'mecanica.diesel.pesado', nombre: 'Camión y tractocamión' },
          { id: 'mecanica.diesel.inyeccion', nombre: 'Inyección diésel y common rail' },
          { id: 'mecanica.diesel.turbo', nombre: 'Turbos' },
          { id: 'mecanica.diesel.maquinaria', nombre: 'Maquinaria pesada' },
        ],
      },
      {
        id: 'mecanica.electrica',
        nombre: 'Eléctrico y electrónica automotriz',
        tipoNivel3: 'tecnologia',
        keywords: ['electrico automotriz', 'escaner', 'computadora', 'alternador'],
        especialidades: [
          { id: 'mecanica.electrica.diagnostico', nombre: 'Diagnóstico con escáner' },
          { id: 'mecanica.electrica.computadora', nombre: 'Computadoras y ECU' },
          { id: 'mecanica.electrica.arranque', nombre: 'Marchas y alternadores' },
          { id: 'mecanica.electrica.instalacion', nombre: 'Instalación eléctrica y arneses' },
          { id: 'mecanica.electrica.clima_auto', nombre: 'Aire acondicionado automotriz' },
        ],
      },
      {
        id: 'mecanica.transmision',
        nombre: 'Transmisión y tren motriz',
        tipoNivel3: 'tecnologia',
        keywords: ['transmision', 'clutch', 'caja', 'automatica', 'estandar'],
        especialidades: [
          { id: 'mecanica.transmision.automatica', nombre: 'Transmisión automática' },
          { id: 'mecanica.transmision.estandar', nombre: 'Transmisión estándar' },
          { id: 'mecanica.transmision.cvt', nombre: 'CVT' },
          { id: 'mecanica.transmision.diferencial', nombre: 'Diferenciales y flechas' },
          { id: 'mecanica.transmision.clutch', nombre: 'Clutch' },
        ],
      },
      {
        id: 'mecanica.suspension',
        nombre: 'Suspensión, dirección y frenos',
        tipoNivel3: 'tecnologia',
        keywords: ['suspension', 'frenos', 'amortiguador', 'alineacion', 'balatas'],
        especialidades: [
          { id: 'mecanica.suspension.suspension', nombre: 'Suspensión y amortiguadores' },
          { id: 'mecanica.suspension.direccion', nombre: 'Dirección hidráulica y eléctrica' },
          { id: 'mecanica.suspension.frenos', nombre: 'Frenos y ABS' },
          { id: 'mecanica.suspension.alineacion', nombre: 'Alineación y balanceo' },
        ],
      },
      {
        id: 'mecanica.motos',
        nombre: 'Motocicletas',
        tipoNivel3: 'marca',
        keywords: ['moto', 'motocicleta', 'scooter'],
        especialidades: [
          { id: 'mecanica.motos.italika', nombre: 'Italika' },
          { id: 'mecanica.motos.honda', nombre: 'Honda' },
          { id: 'mecanica.motos.yamaha', nombre: 'Yamaha' },
          { id: 'mecanica.motos.bajaj', nombre: 'Bajaj / Vento' },
          { id: 'mecanica.motos.alta_cilindrada', nombre: 'Alta cilindrada' },
          { id: 'mecanica.motos.electricas', nombre: 'Motos eléctricas' },
        ],
      },
      {
        id: 'mecanica.marina',
        nombre: 'Mecánica marina',
        tipoNivel3: 'tecnologia',
        nota: 'Alta demanda en zonas costeras',
        keywords: ['lancha', 'yate', 'barco', 'fuera de borda', 'marino'],
        especialidades: [
          { id: 'mecanica.marina.fuera_borda', nombre: 'Motores fuera de borda' },
          { id: 'mecanica.marina.dentro_borda', nombre: 'Motores dentro de borda' },
          { id: 'mecanica.marina.diesel_marino', nombre: 'Diésel marino' },
          { id: 'mecanica.marina.sistemas', nombre: 'Sistemas de a bordo' },
          { id: 'mecanica.marina.casco', nombre: 'Casco y fibra de vidrio' },
        ],
      },
      {
        id: 'mecanica.hibridos',
        nombre: 'Híbridos y eléctricos',
        tipoNivel3: 'tecnologia',
        keywords: ['hibrido', 'electrico', 'ev', 'bateria', 'tesla'],
        especialidades: [
          { id: 'mecanica.hibridos.hibrido', nombre: 'Vehículos híbridos' },
          { id: 'mecanica.hibridos.electrico', nombre: 'Vehículos 100% eléctricos' },
          { id: 'mecanica.hibridos.baterias', nombre: 'Baterías de alto voltaje' },
          { id: 'mecanica.hibridos.cargadores', nombre: 'Cargadores y estaciones' },
        ],
      },
      {
        id: 'mecanica.carroceria',
        nombre: 'Carrocería y pintura automotriz',
        tipoNivel3: 'aplicacion',
        keywords: ['hojalateria', 'pintura auto', 'golpe', 'carroceria'],
        especialidades: [
          { id: 'mecanica.carroceria.hojalateria', nombre: 'Hojalatería' },
          { id: 'mecanica.carroceria.pintura', nombre: 'Pintura automotriz' },
          { id: 'mecanica.carroceria.pulido', nombre: 'Pulido y detallado' },
          { id: 'mecanica.carroceria.cristales', nombre: 'Cristales y parabrisas' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'seguridad',
    nombre: 'Seguridad Electrónica',
    icono: 'video',
    sinco: '2635',
    descripcion: 'CCTV, control de acceso, alarmas y sistemas de protección.',
    keywords: ['camaras', 'cctv', 'seguridad', 'alarma', 'videovigilancia', 'acceso'],
    subcategorias: [
      {
        id: 'seguridad.cctv',
        nombre: 'CCTV y videovigilancia',
        tipoNivel3: 'tecnologia',
        keywords: ['camara', 'cctv', 'dvr', 'nvr', 'grabacion'],
        especialidades: [
          { id: 'seguridad.cctv.analogico', nombre: 'Analógico (HDCVI / TVI / AHD)' },
          { id: 'seguridad.cctv.ip', nombre: 'Cámaras IP' },
          { id: 'seguridad.cctv.ptz', nombre: 'PTZ y domos' },
          { id: 'seguridad.cctv.termica', nombre: 'Cámaras térmicas' },
          { id: 'seguridad.cctv.analitica', nombre: 'Videoanalítica y reconocimiento' },
          { id: 'seguridad.cctv.remoto', nombre: 'Monitoreo remoto y nube' },
          { id: 'seguridad.cctv.perimetral', nombre: 'Vigilancia perimetral' },
        ],
      },
      {
        id: 'seguridad.acceso',
        nombre: 'Control de acceso',
        tipoNivel3: 'tecnologia',
        keywords: ['acceso', 'huella', 'chapa', 'checador', 'torniquete'],
        especialidades: [
          { id: 'seguridad.acceso.biometrico', nombre: 'Biométrico (huella / rostro)' },
          { id: 'seguridad.acceso.tarjetas', nombre: 'Tarjetas y RFID' },
          { id: 'seguridad.acceso.chapas', nombre: 'Chapas magnéticas y eléctricas' },
          { id: 'seguridad.acceso.torniquetes', nombre: 'Torniquetes y barreras' },
          { id: 'seguridad.acceso.checador', nombre: 'Checadores de asistencia' },
          { id: 'seguridad.acceso.videoportero', nombre: 'Videoporteros e interfón' },
        ],
      },
      {
        id: 'seguridad.alarmas',
        nombre: 'Alarmas y detección',
        tipoNivel3: 'tecnologia',
        keywords: ['alarma', 'sensor', 'incendio', 'humo', 'panico'],
        especialidades: [
          { id: 'seguridad.alarmas.intrusion', nombre: 'Alarmas de intrusión' },
          { id: 'seguridad.alarmas.incendio', nombre: 'Detección de incendio' },
          { id: 'seguridad.alarmas.panico', nombre: 'Botones de pánico' },
          { id: 'seguridad.alarmas.gas', nombre: 'Detección de gas' },
          { id: 'seguridad.alarmas.monitoreo', nombre: 'Central de monitoreo' },
        ],
      },
      {
        id: 'seguridad.automatizacion_puertas',
        nombre: 'Puertas y portones automáticos',
        tipoNivel3: 'tecnologia',
        keywords: ['porton', 'automatico', 'corredizo', 'cortina'],
        especialidades: [
          { id: 'seguridad.automatizacion_puertas.corredizo', nombre: 'Portón corredizo' },
          { id: 'seguridad.automatizacion_puertas.abatible', nombre: 'Portón abatible' },
          { id: 'seguridad.automatizacion_puertas.cortinas', nombre: 'Cortinas metálicas' },
          { id: 'seguridad.automatizacion_puertas.pluma', nombre: 'Plumas vehiculares' },
        ],
      },
      {
        id: 'seguridad.rastreo',
        nombre: 'GPS y rastreo',
        tipoNivel3: 'aplicacion',
        keywords: ['gps', 'rastreo', 'localizacion', 'flotilla'],
        especialidades: [
          { id: 'seguridad.rastreo.vehicular', nombre: 'Rastreo vehicular' },
          { id: 'seguridad.rastreo.flotillas', nombre: 'Gestión de flotillas' },
          { id: 'seguridad.rastreo.activos', nombre: 'Rastreo de activos' },
          { id: 'seguridad.rastreo.telemetria', nombre: 'Telemetría' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'redes',
    nombre: 'Redes y Telecomunicaciones',
    icono: 'wifi',
    sinco: '2636',
    descripcion: 'Cableado estructurado, fibra óptica, WiFi y sistemas de datos.',
    keywords: ['redes', 'internet', 'wifi', 'cableado', 'fibra', 'router'],
    subcategorias: [
      {
        id: 'redes.cableado',
        nombre: 'Cableado estructurado',
        tipoNivel3: 'tecnologia',
        keywords: ['cableado', 'utp', 'rack', 'nodo', 'patch panel'],
        especialidades: [
          { id: 'redes.cableado.cat5e', nombre: 'Cat 5e' },
          { id: 'redes.cableado.cat6', nombre: 'Cat 6 / 6A' },
          { id: 'redes.cableado.racks', nombre: 'Racks y gabinetes' },
          { id: 'redes.cableado.certificacion', nombre: 'Certificación de cableado' },
          { id: 'redes.cableado.canalizacion', nombre: 'Canalización y charolas' },
        ],
      },
      {
        id: 'redes.fibra',
        nombre: 'Fibra óptica',
        tipoNivel3: 'tecnologia',
        keywords: ['fibra', 'optica', 'fusion', 'otdr'],
        especialidades: [
          { id: 'redes.fibra.fusion', nombre: 'Fusión y empalmes' },
          { id: 'redes.fibra.otdr', nombre: 'Pruebas OTDR' },
          { id: 'redes.fibra.tendido', nombre: 'Tendido aéreo y subterráneo' },
          { id: 'redes.fibra.ftth', nombre: 'FTTH / GPON' },
        ],
      },
      {
        id: 'redes.wifi',
        nombre: 'Redes inalámbricas',
        tipoNivel3: 'aplicacion',
        keywords: ['wifi', 'inalambrico', 'antena', 'enlace', 'cobertura'],
        especialidades: [
          { id: 'redes.wifi.residencial', nombre: 'WiFi residencial' },
          { id: 'redes.wifi.empresarial', nombre: 'WiFi empresarial y APs' },
          { id: 'redes.wifi.enlaces', nombre: 'Enlaces punto a punto' },
          { id: 'redes.wifi.hotspot', nombre: 'Hotspots y portales cautivos' },
          { id: 'redes.wifi.sitesurvey', nombre: 'Site survey y mapas de calor' },
        ],
      },
      {
        id: 'redes.equipos',
        nombre: 'Equipos de red',
        tipoNivel3: 'marca',
        keywords: ['switch', 'router', 'firewall', 'mikrotik', 'ubiquiti'],
        especialidades: [
          { id: 'redes.equipos.mikrotik', nombre: 'MikroTik' },
          { id: 'redes.equipos.ubiquiti', nombre: 'Ubiquiti' },
          { id: 'redes.equipos.cisco', nombre: 'Cisco' },
          { id: 'redes.equipos.tplink', nombre: 'TP-Link / Cudy' },
          { id: 'redes.equipos.aruba', nombre: 'Aruba / HPE' },
          { id: 'redes.equipos.fortinet', nombre: 'Fortinet' },
        ],
      },
      {
        id: 'redes.telefonia',
        nombre: 'Telefonía y audio',
        tipoNivel3: 'tecnologia',
        keywords: ['telefono', 'voip', 'conmutador', 'audio', 'sonido'],
        especialidades: [
          { id: 'redes.telefonia.voip', nombre: 'Telefonía VoIP' },
          { id: 'redes.telefonia.conmutador', nombre: 'Conmutadores y PBX' },
          { id: 'redes.telefonia.voceo', nombre: 'Sistemas de voceo' },
          { id: 'redes.telefonia.audio', nombre: 'Audio distribuido' },
        ],
      },
      {
        id: 'redes.soporte',
        nombre: 'Soporte técnico e infraestructura',
        tipoNivel3: 'aplicacion',
        keywords: ['soporte', 'computadora', 'servidor', 'mantenimiento pc'],
        especialidades: [
          { id: 'redes.soporte.pc', nombre: 'Mantenimiento de PC y laptops' },
          { id: 'redes.soporte.servidores', nombre: 'Servidores' },
          { id: 'redes.soporte.impresoras', nombre: 'Impresoras y multifuncionales' },
          { id: 'redes.soporte.puntoventa', nombre: 'Puntos de venta' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'obra',
    nombre: 'Albañilería y Obra',
    icono: 'hammer',
    sinco: '7121',
    descripcion: 'Construcción, estructura, mampostería y obra civil.',
    keywords: ['albanil', 'albanileria', 'obra', 'construccion', 'cemento', 'muro'],
    subcategorias: [
      {
        id: 'obra.estructura',
        nombre: 'Estructura y cimentación',
        tipoNivel3: 'aplicacion',
        keywords: ['cimentacion', 'castillo', 'losa', 'colado', 'estructura'],
        especialidades: [
          { id: 'obra.estructura.cimentacion', nombre: 'Cimentación' },
          { id: 'obra.estructura.castillos', nombre: 'Castillos y trabes' },
          { id: 'obra.estructura.losas', nombre: 'Losas y colados' },
          { id: 'obra.estructura.acero', nombre: 'Armado de acero' },
          { id: 'obra.estructura.cimbra', nombre: 'Cimbra' },
        ],
      },
      {
        id: 'obra.muros',
        nombre: 'Muros y mampostería',
        tipoNivel3: 'material',
        keywords: ['muro', 'block', 'ladrillo', 'aplanado', 'repellado'],
        especialidades: [
          { id: 'obra.muros.block', nombre: 'Block' },
          { id: 'obra.muros.ladrillo', nombre: 'Ladrillo' },
          { id: 'obra.muros.piedra', nombre: 'Piedra' },
          { id: 'obra.muros.aplanados', nombre: 'Aplanados y repellados' },
        ],
      },
      {
        id: 'obra.pisos',
        nombre: 'Pisos y recubrimientos',
        tipoNivel3: 'material',
        keywords: ['piso', 'loseta', 'azulejo', 'porcelanato', 'firme'],
        especialidades: [
          { id: 'obra.pisos.ceramica', nombre: 'Cerámica y porcelanato' },
          { id: 'obra.pisos.marmol', nombre: 'Mármol y piedra natural' },
          { id: 'obra.pisos.concreto', nombre: 'Concreto pulido y estampado' },
          { id: 'obra.pisos.vinilico', nombre: 'Vinílico y laminado' },
          { id: 'obra.pisos.epoxico', nombre: 'Epóxico industrial' },
        ],
      },
      {
        id: 'obra.demolicion',
        nombre: 'Demolición y remodelación',
        tipoNivel3: 'aplicacion',
        keywords: ['demolicion', 'remodelacion', 'ampliacion'],
        especialidades: [
          { id: 'obra.demolicion.demolicion', nombre: 'Demolición controlada' },
          { id: 'obra.demolicion.remodelacion', nombre: 'Remodelación integral' },
          { id: 'obra.demolicion.ampliacion', nombre: 'Ampliaciones' },
        ],
      },
      {
        id: 'obra.impermeabilizacion',
        nombre: 'Impermeabilización',
        tipoNivel3: 'material',
        keywords: ['impermeabilizante', 'gotera', 'azotea', 'filtracion'],
        especialidades: [
          { id: 'obra.impermeabilizacion.acrilico', nombre: 'Acrílico' },
          { id: 'obra.impermeabilizacion.prefabricado', nombre: 'Prefabricado (manto asfáltico)' },
          { id: 'obra.impermeabilizacion.poliuretano', nombre: 'Poliuretano' },
          { id: 'obra.impermeabilizacion.cisternas', nombre: 'Cisternas y albercas' },
          { id: 'obra.impermeabilizacion.goteras', nombre: 'Reparación de goteras' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'acabados',
    nombre: 'Acabados e Interiores',
    icono: 'paintbrush',
    sinco: '7123',
    descripcion: 'Tablaroca, pintura, plafones y terminados de interiores.',
    keywords: ['acabados', 'pintura', 'tablaroca', 'plafon', 'interiores'],
    subcategorias: [
      {
        id: 'acabados.tablaroca',
        nombre: 'Tablaroca y sistemas ligeros',
        tipoNivel3: 'aplicacion',
        keywords: ['tablaroca', 'panel', 'drywall', 'muro falso', 'durock'],
        especialidades: [
          { id: 'acabados.tablaroca.muros', nombre: 'Muros divisorios' },
          { id: 'acabados.tablaroca.plafones', nombre: 'Plafones' },
          { id: 'acabados.tablaroca.acustico', nombre: 'Aislamiento acústico' },
          { id: 'acabados.tablaroca.humedad', nombre: 'Zonas húmedas (Durock)' },
          { id: 'acabados.tablaroca.decorativo', nombre: 'Diseños y falsos plafones decorativos' },
        ],
      },
      {
        id: 'acabados.pintura',
        nombre: 'Pintura',
        tipoNivel3: 'material',
        keywords: ['pintura', 'pintor', 'vinilica', 'esmalte'],
        especialidades: [
          { id: 'acabados.pintura.vinilica', nombre: 'Vinílica' },
          { id: 'acabados.pintura.esmalte', nombre: 'Esmalte' },
          { id: 'acabados.pintura.texturizado', nombre: 'Texturizados' },
          { id: 'acabados.pintura.epoxica', nombre: 'Epóxica industrial' },
          { id: 'acabados.pintura.decorativa', nombre: 'Decorativa y murales' },
          { id: 'acabados.pintura.altura', nombre: 'Trabajos en altura y fachadas' },
        ],
      },
      {
        id: 'acabados.plafones',
        nombre: 'Plafones y falsos techos',
        tipoNivel3: 'material',
        keywords: ['plafon', 'techo falso', 'reticular'],
        especialidades: [
          { id: 'acabados.plafones.reticular', nombre: 'Reticular' },
          { id: 'acabados.plafones.madera', nombre: 'Madera y PVC' },
          { id: 'acabados.plafones.acustico', nombre: 'Acústico' },
        ],
      },
      {
        id: 'acabados.cancel',
        nombre: 'Canceles y vidrio',
        tipoNivel3: 'material',
        keywords: ['cancel', 'vidrio', 'aluminio', 'ventana', 'domo'],
        especialidades: [
          { id: 'acabados.cancel.aluminio', nombre: 'Aluminio' },
          { id: 'acabados.cancel.templado', nombre: 'Cristal templado' },
          { id: 'acabados.cancel.pvc', nombre: 'PVC' },
          { id: 'acabados.cancel.domos', nombre: 'Domos y tragaluces' },
          { id: 'acabados.cancel.pelicula', nombre: 'Películas y polarizado' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'herreria',
    nombre: 'Herrería y Soldadura',
    icono: 'flame',
    sinco: '7131',
    descripcion: 'Trabajo de metales, estructuras metálicas y soldadura.',
    keywords: ['herrero', 'herreria', 'soldadura', 'soldador', 'metal', 'fierro'],
    subcategorias: [
      {
        id: 'herreria.estructural',
        nombre: 'Herrería estructural',
        tipoNivel3: 'aplicacion',
        keywords: ['estructura', 'techumbre', 'nave', 'ptr'],
        especialidades: [
          { id: 'herreria.estructural.techumbres', nombre: 'Techumbres' },
          { id: 'herreria.estructural.naves', nombre: 'Naves industriales' },
          { id: 'herreria.estructural.escaleras', nombre: 'Escaleras metálicas' },
          { id: 'herreria.estructural.entrepisos', nombre: 'Entrepisos' },
        ],
      },
      {
        id: 'herreria.ornamental',
        nombre: 'Herrería ornamental',
        tipoNivel3: 'aplicacion',
        keywords: ['porton', 'reja', 'barandal', 'proteccion'],
        especialidades: [
          { id: 'herreria.ornamental.portones', nombre: 'Portones' },
          { id: 'herreria.ornamental.rejas', nombre: 'Rejas y protecciones' },
          { id: 'herreria.ornamental.barandales', nombre: 'Barandales' },
          { id: 'herreria.ornamental.puertas', nombre: 'Puertas metálicas' },
        ],
      },
      {
        id: 'herreria.soldadura',
        nombre: 'Procesos de soldadura',
        tipoNivel3: 'tecnologia',
        keywords: ['soldadura', 'mig', 'tig', 'electrodo', 'arco'],
        especialidades: [
          { id: 'herreria.soldadura.smaw', nombre: 'SMAW (electrodo revestido)' },
          { id: 'herreria.soldadura.mig', nombre: 'MIG / MAG' },
          { id: 'herreria.soldadura.tig', nombre: 'TIG' },
          { id: 'herreria.soldadura.aluminio', nombre: 'Aluminio' },
          { id: 'herreria.soldadura.inoxidable', nombre: 'Acero inoxidable' },
          { id: 'herreria.soldadura.certificada', nombre: 'Soldadura certificada (tubería/presión)' },
        ],
      },
      {
        id: 'herreria.acero_inox',
        nombre: 'Acero inoxidable',
        tipoNivel3: 'aplicacion',
        keywords: ['inoxidable', 'inox', 'cocina industrial'],
        especialidades: [
          { id: 'herreria.acero_inox.cocinas', nombre: 'Cocinas industriales' },
          { id: 'herreria.acero_inox.mobiliario', nombre: 'Mobiliario y mesas' },
          { id: 'herreria.acero_inox.tuberia', nombre: 'Tubería sanitaria' },
          { id: 'herreria.acero_inox.pasamanos', nombre: 'Pasamanos y decorativo' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'carpinteria',
    nombre: 'Carpintería y Muebles',
    icono: 'ruler',
    sinco: '7132',
    descripcion: 'Muebles a medida, closets, cocinas y trabajos en madera.',
    keywords: ['carpintero', 'carpinteria', 'madera', 'mueble', 'closet', 'cocina'],
    subcategorias: [
      {
        id: 'carpinteria.cocinas',
        nombre: 'Cocinas integrales',
        tipoNivel3: 'material',
        keywords: ['cocina', 'integral', 'alacena'],
        especialidades: [
          { id: 'carpinteria.cocinas.melamina', nombre: 'Melamina' },
          { id: 'carpinteria.cocinas.madera', nombre: 'Madera sólida' },
          { id: 'carpinteria.cocinas.cubiertas', nombre: 'Cubiertas (cuarzo, granito)' },
          { id: 'carpinteria.cocinas.herrajes', nombre: 'Herrajes y mecanismos' },
        ],
      },
      {
        id: 'carpinteria.closets',
        nombre: 'Closets y vestidores',
        tipoNivel3: 'aplicacion',
        keywords: ['closet', 'vestidor', 'ropero'],
        especialidades: [
          { id: 'carpinteria.closets.medida', nombre: 'A la medida' },
          { id: 'carpinteria.closets.corredizo', nombre: 'Puertas corredizas' },
          { id: 'carpinteria.closets.vestidor', nombre: 'Vestidores' },
        ],
      },
      {
        id: 'carpinteria.muebles',
        nombre: 'Muebles y mobiliario',
        tipoNivel3: 'aplicacion',
        keywords: ['mueble', 'mesa', 'escritorio', 'librero'],
        especialidades: [
          { id: 'carpinteria.muebles.residencial', nombre: 'Mobiliario residencial' },
          { id: 'carpinteria.muebles.comercial', nombre: 'Mobiliario comercial' },
          { id: 'carpinteria.muebles.restauracion', nombre: 'Restauración' },
          { id: 'carpinteria.muebles.puertas', nombre: 'Puertas de madera' },
        ],
      },
      {
        id: 'carpinteria.exterior',
        nombre: 'Madera para exteriores',
        tipoNivel3: 'aplicacion',
        keywords: ['deck', 'pergola', 'palapa', 'exterior'],
        especialidades: [
          { id: 'carpinteria.exterior.decks', nombre: 'Decks' },
          { id: 'carpinteria.exterior.pergolas', nombre: 'Pérgolas' },
          { id: 'carpinteria.exterior.palapas', nombre: 'Palapas' },
          { id: 'carpinteria.exterior.tratamiento', nombre: 'Tratamiento y sellado' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'automatizacion',
    nombre: 'Automatización y Control Industrial',
    icono: 'cpu',
    sinco: '2633',
    descripcion: 'PLC, motores, variadores y sistemas de control de procesos.',
    keywords: ['automatizacion', 'plc', 'motor', 'variador', 'control', 'industrial'],
    subcategorias: [
      {
        id: 'automatizacion.motores',
        nombre: 'Motores eléctricos',
        tipoNivel3: 'tecnologia',
        keywords: ['motor', 'rebobinado', 'trifasico', 'bobina'],
        especialidades: [
          { id: 'automatizacion.motores.trifasicos', nombre: 'Motores trifásicos' },
          { id: 'automatizacion.motores.monofasicos', nombre: 'Motores monofásicos' },
          { id: 'automatizacion.motores.rebobinado', nombre: 'Rebobinado' },
          { id: 'automatizacion.motores.reductores', nombre: 'Motorreductores' },
          { id: 'automatizacion.motores.servomotores', nombre: 'Servomotores' },
          { id: 'automatizacion.motores.balanceo', nombre: 'Balanceo y alineación' },
        ],
      },
      {
        id: 'automatizacion.plc',
        nombre: 'PLC y control',
        tipoNivel3: 'marca',
        keywords: ['plc', 'programacion', 'scada', 'hmi'],
        especialidades: [
          { id: 'automatizacion.plc.siemens', nombre: 'Siemens' },
          { id: 'automatizacion.plc.allen_bradley', nombre: 'Allen-Bradley / Rockwell' },
          { id: 'automatizacion.plc.mitsubishi', nombre: 'Mitsubishi' },
          { id: 'automatizacion.plc.schneider', nombre: 'Schneider' },
          { id: 'automatizacion.plc.delta', nombre: 'Delta' },
          { id: 'automatizacion.plc.hmi_scada', nombre: 'HMI y SCADA' },
        ],
      },
      {
        id: 'automatizacion.variadores',
        nombre: 'Variadores y arrancadores',
        tipoNivel3: 'tecnologia',
        keywords: ['variador', 'vfd', 'arrancador', 'frecuencia'],
        especialidades: [
          { id: 'automatizacion.variadores.vfd', nombre: 'Variadores de frecuencia' },
          { id: 'automatizacion.variadores.suave', nombre: 'Arrancadores suaves' },
          { id: 'automatizacion.variadores.parametrizacion', nombre: 'Parametrización' },
        ],
      },
      {
        id: 'automatizacion.instrumentacion',
        nombre: 'Instrumentación',
        tipoNivel3: 'tecnologia',
        keywords: ['sensor', 'instrumento', 'calibracion', 'transmisor'],
        especialidades: [
          { id: 'automatizacion.instrumentacion.sensores', nombre: 'Sensores y transmisores' },
          { id: 'automatizacion.instrumentacion.calibracion', nombre: 'Calibración' },
          { id: 'automatizacion.instrumentacion.valvulas', nombre: 'Válvulas de control' },
          { id: 'automatizacion.instrumentacion.neumatica', nombre: 'Neumática e hidráulica' },
        ],
      },
      {
        id: 'automatizacion.domotica',
        nombre: 'Domótica y edificios inteligentes',
        tipoNivel3: 'tecnologia',
        keywords: ['domotica', 'casa inteligente', 'bms', 'smart home'],
        especialidades: [
          { id: 'automatizacion.domotica.residencial', nombre: 'Domótica residencial' },
          { id: 'automatizacion.domotica.bms', nombre: 'BMS (edificios)' },
          { id: 'automatizacion.domotica.iluminacion', nombre: 'Control de iluminación' },
          { id: 'automatizacion.domotica.persianas', nombre: 'Cortinas y persianas automáticas' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'solar',
    nombre: 'Energía Solar y Renovables',
    icono: 'sun',
    sinco: '2632',
    descripcion: 'Sistemas fotovoltaicos, calentamiento solar y almacenamiento.',
    keywords: ['solar', 'paneles', 'fotovoltaico', 'energia', 'renovable'],
    subcategorias: [
      {
        id: 'solar.fotovoltaico',
        nombre: 'Sistemas fotovoltaicos',
        tipoNivel3: 'aplicacion',
        ec: ['EC0586.01'],
        keywords: ['panel solar', 'fotovoltaico', 'interconectado', 'cfe'],
        especialidades: [
          { id: 'solar.fotovoltaico.residencial', nombre: 'Residencial interconectado' },
          { id: 'solar.fotovoltaico.comercial', nombre: 'Comercial e industrial' },
          { id: 'solar.fotovoltaico.aislado', nombre: 'Aislado (off-grid)' },
          { id: 'solar.fotovoltaico.tramites', nombre: 'Trámites de interconexión CFE' },
          { id: 'solar.fotovoltaico.mantenimiento', nombre: 'Mantenimiento y limpieza' },
        ],
      },
      {
        id: 'solar.termico',
        nombre: 'Solar térmico',
        tipoNivel3: 'tecnologia',
        keywords: ['calentador solar', 'termico', 'tubos'],
        especialidades: [
          { id: 'solar.termico.tubos', nombre: 'Tubos evacuados' },
          { id: 'solar.termico.planos', nombre: 'Colectores planos' },
          { id: 'solar.termico.albercas', nombre: 'Calentamiento de albercas' },
        ],
      },
      {
        id: 'solar.almacenamiento',
        nombre: 'Almacenamiento',
        tipoNivel3: 'tecnologia',
        keywords: ['bateria', 'litio', 'respaldo', 'inversor'],
        especialidades: [
          { id: 'solar.almacenamiento.litio', nombre: 'Baterías de litio' },
          { id: 'solar.almacenamiento.agm', nombre: 'AGM y gel' },
          { id: 'solar.almacenamiento.hibrido', nombre: 'Inversores híbridos' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'lineablanca',
    nombre: 'Línea Blanca y Electrodomésticos',
    icono: 'washing-machine',
    sinco: '2638',
    descripcion: 'Reparación de electrodomésticos y equipos del hogar.',
    keywords: ['lavadora', 'refrigerador', 'estufa', 'secadora', 'electrodomestico'],
    subcategorias: [
      {
        id: 'lineablanca.lavado',
        nombre: 'Lavado y secado',
        tipoNivel3: 'marca',
        keywords: ['lavadora', 'secadora', 'lavavajillas'],
        especialidades: [
          { id: 'lineablanca.lavado.whirlpool', nombre: 'Whirlpool / Acros' },
          { id: 'lineablanca.lavado.mabe', nombre: 'Mabe / Easy' },
          { id: 'lineablanca.lavado.lg', nombre: 'LG' },
          { id: 'lineablanca.lavado.samsung', nombre: 'Samsung' },
          { id: 'lineablanca.lavado.multimarca', nombre: 'Multimarca' },
        ],
      },
      {
        id: 'lineablanca.refrigeracion_hogar',
        nombre: 'Refrigeradores domésticos',
        tipoNivel3: 'tecnologia',
        keywords: ['refrigerador', 'refri', 'congelador casa'],
        especialidades: [
          { id: 'lineablanca.refrigeracion_hogar.convencional', nombre: 'Convencional' },
          { id: 'lineablanca.refrigeracion_hogar.nofrost', nombre: 'No Frost' },
          { id: 'lineablanca.refrigeracion_hogar.inverter', nombre: 'Inverter' },
          { id: 'lineablanca.refrigeracion_hogar.dispensador', nombre: 'Con dispensador y fábrica de hielo' },
        ],
      },
      {
        id: 'lineablanca.cocina',
        nombre: 'Equipos de cocina',
        tipoNivel3: 'tecnologia',
        keywords: ['estufa', 'horno', 'microondas', 'campana'],
        especialidades: [
          { id: 'lineablanca.cocina.estufas', nombre: 'Estufas de gas' },
          { id: 'lineablanca.cocina.electricas', nombre: 'Parrillas eléctricas e inducción' },
          { id: 'lineablanca.cocina.hornos', nombre: 'Hornos' },
          { id: 'lineablanca.cocina.microondas', nombre: 'Microondas' },
          { id: 'lineablanca.cocina.campanas', nombre: 'Campanas y extractores' },
        ],
      },
      {
        id: 'lineablanca.industrial_cocina',
        nombre: 'Equipo de cocina industrial',
        tipoNivel3: 'aplicacion',
        keywords: ['cocina industrial', 'restaurante', 'freidora', 'plancha'],
        especialidades: [
          { id: 'lineablanca.industrial_cocina.freidoras', nombre: 'Freidoras y planchas' },
          { id: 'lineablanca.industrial_cocina.hornos', nombre: 'Hornos de convección' },
          { id: 'lineablanca.industrial_cocina.lavaloza', nombre: 'Lavalozas industriales' },
          { id: 'lineablanca.industrial_cocina.campanas', nombre: 'Campanas y extracción' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'gas',
    nombre: 'Gas LP y Natural',
    icono: 'flame-kindling',
    sinco: '7141',
    descripcion: 'Instalaciones de gas, tanques y equipos de combustión.',
    keywords: ['gas', 'lp', 'natural', 'tanque', 'estacionario', 'fuga de gas'],
    subcategorias: [
      {
        id: 'gas.instalacion',
        nombre: 'Instalaciones de gas',
        tipoNivel3: 'aplicacion',
        nota: 'Requiere unidad de verificación acreditada — validar credenciales',
        keywords: ['instalacion gas', 'tuberia gas', 'regulador'],
        especialidades: [
          { id: 'gas.instalacion.residencial', nombre: 'Residencial' },
          { id: 'gas.instalacion.comercial', nombre: 'Comercial y restaurantes' },
          { id: 'gas.instalacion.industrial', nombre: 'Industrial' },
          { id: 'gas.instalacion.reguladores', nombre: 'Reguladores y medidores' },
        ],
      },
      {
        id: 'gas.tanques',
        nombre: 'Tanques y almacenamiento',
        tipoNivel3: 'aplicacion',
        keywords: ['tanque', 'estacionario', 'cilindro'],
        especialidades: [
          { id: 'gas.tanques.estacionarios', nombre: 'Tanques estacionarios' },
          { id: 'gas.tanques.portatiles', nombre: 'Cilindros portátiles' },
          { id: 'gas.tanques.pruebas', nombre: 'Pruebas de hermeticidad' },
        ],
      },
      {
        id: 'gas.seguridad',
        nombre: 'Seguridad y detección',
        tipoNivel3: 'tecnologia',
        keywords: ['fuga de gas', 'detector', 'verificacion'],
        especialidades: [
          { id: 'gas.seguridad.fugas', nombre: 'Detección de fugas' },
          { id: 'gas.seguridad.detectores', nombre: 'Detectores de gas' },
          { id: 'gas.seguridad.verificacion', nombre: 'Verificación normativa' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'agua',
    nombre: 'Albercas y Tratamiento de Agua',
    icono: 'waves',
    sinco: '7141',
    descripcion: 'Albercas, purificación y plantas de tratamiento.',
    keywords: ['alberca', 'piscina', 'agua', 'purificacion', 'filtro', 'osmosis'],
    subcategorias: [
      {
        id: 'agua.albercas',
        nombre: 'Albercas',
        tipoNivel3: 'aplicacion',
        nota: 'Muy alta demanda en Quintana Roo (residencial y hotelero)',
        keywords: ['alberca', 'piscina', 'jacuzzi', 'cloro'],
        especialidades: [
          { id: 'agua.albercas.mantenimiento', nombre: 'Mantenimiento y química' },
          { id: 'agua.albercas.filtracion', nombre: 'Equipos de filtración' },
          { id: 'agua.albercas.bombas', nombre: 'Bombas y motores' },
          { id: 'agua.albercas.iluminacion', nombre: 'Iluminación sumergible' },
          { id: 'agua.albercas.calefaccion', nombre: 'Calefacción de alberca' },
          { id: 'agua.albercas.construccion', nombre: 'Construcción y rehabilitación' },
          { id: 'agua.albercas.jacuzzi', nombre: 'Jacuzzis y spas' },
        ],
      },
      {
        id: 'agua.purificacion',
        nombre: 'Purificación',
        tipoNivel3: 'tecnologia',
        keywords: ['purificador', 'osmosis', 'suavizador', 'filtro'],
        especialidades: [
          { id: 'agua.purificacion.osmosis', nombre: 'Ósmosis inversa' },
          { id: 'agua.purificacion.suavizadores', nombre: 'Suavizadores' },
          { id: 'agua.purificacion.uv', nombre: 'Luz ultravioleta' },
          { id: 'agua.purificacion.filtros', nombre: 'Filtros y carbón activado' },
        ],
      },
      {
        id: 'agua.tratamiento',
        nombre: 'Plantas de tratamiento',
        tipoNivel3: 'aplicacion',
        keywords: ['ptar', 'aguas residuales', 'tratamiento'],
        especialidades: [
          { id: 'agua.tratamiento.ptar', nombre: 'PTAR (aguas residuales)' },
          { id: 'agua.tratamiento.potabilizadora', nombre: 'Potabilizadoras' },
          { id: 'agua.tratamiento.operacion', nombre: 'Operación y monitoreo' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'elevacion',
    nombre: 'Elevadores y Equipos de Elevación',
    icono: 'arrow-up-down',
    sinco: '2639',
    descripcion: 'Elevadores, montacargas y equipos de izaje.',
    keywords: ['elevador', 'ascensor', 'montacargas', 'escalera electrica'],
    subcategorias: [
      {
        id: 'elevacion.elevadores',
        nombre: 'Elevadores',
        tipoNivel3: 'marca',
        keywords: ['elevador', 'ascensor'],
        especialidades: [
          { id: 'elevacion.elevadores.otis', nombre: 'Otis' },
          { id: 'elevacion.elevadores.schindler', nombre: 'Schindler' },
          { id: 'elevacion.elevadores.kone', nombre: 'Kone' },
          { id: 'elevacion.elevadores.thyssen', nombre: 'ThyssenKrupp' },
          { id: 'elevacion.elevadores.multimarca', nombre: 'Multimarca' },
        ],
      },
      {
        id: 'elevacion.montacargas',
        nombre: 'Montacargas',
        tipoNivel3: 'tecnologia',
        keywords: ['montacargas', 'forklift', 'patin'],
        especialidades: [
          { id: 'elevacion.montacargas.electrico', nombre: 'Eléctricos' },
          { id: 'elevacion.montacargas.combustion', nombre: 'De combustión' },
          { id: 'elevacion.montacargas.patines', nombre: 'Patines hidráulicos' },
        ],
      },
      {
        id: 'elevacion.escaleras',
        nombre: 'Escaleras eléctricas',
        tipoNivel3: 'aplicacion',
        keywords: ['escalera electrica', 'rampa'],
        especialidades: [
          { id: 'elevacion.escaleras.mantenimiento', nombre: 'Mantenimiento' },
          { id: 'elevacion.escaleras.reparacion', nombre: 'Reparación' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  {
    id: 'cerrajeria',
    nombre: 'Cerrajería',
    icono: 'key',
    sinco: '7133',
    descripcion: 'Cerraduras, llaves y sistemas de cierre.',
    keywords: ['cerrajero', 'cerradura', 'llave', 'chapa'],
    subcategorias: [
      {
        id: 'cerrajeria.residencial',
        nombre: 'Cerrajería residencial y comercial',
        tipoNivel3: 'tecnologia',
        keywords: ['chapa', 'cerradura', 'apertura'],
        especialidades: [
          { id: 'cerrajeria.residencial.mecanica', nombre: 'Cerraduras mecánicas' },
          { id: 'cerrajeria.residencial.electronica', nombre: 'Cerraduras electrónicas y smart' },
          { id: 'cerrajeria.residencial.apertura', nombre: 'Apertura de emergencia' },
          { id: 'cerrajeria.residencial.maestreo', nombre: 'Sistemas de llave maestra' },
        ],
      },
      {
        id: 'cerrajeria.automotriz',
        nombre: 'Cerrajería automotriz',
        tipoNivel3: 'tecnologia',
        keywords: ['llave de auto', 'chip', 'inmovilizador'],
        especialidades: [
          { id: 'cerrajeria.automotriz.llaves', nombre: 'Duplicado de llaves con chip' },
          { id: 'cerrajeria.automotriz.programacion', nombre: 'Programación de controles' },
          { id: 'cerrajeria.automotriz.apertura', nombre: 'Apertura vehicular' },
        ],
      },
      {
        id: 'cerrajeria.cajas',
        nombre: 'Cajas fuertes',
        tipoNivel3: 'aplicacion',
        keywords: ['caja fuerte', 'boveda'],
        especialidades: [
          { id: 'cerrajeria.cajas.apertura', nombre: 'Apertura' },
          { id: 'cerrajeria.cajas.instalacion', nombre: 'Instalación' },
          { id: 'cerrajeria.cajas.mantenimiento', nombre: 'Mantenimiento' },
        ],
      },
    ],
  },
];


/**
 * MARCAS — etiquetas cruzadas del perfil del técnico.
 * No son nodos del árbol. Un técnico puede marcar varias.
 * Se filtran por categoría para no mostrarle marcas de autos
 * a un técnico de refrigeración.
 */
export const MARCAS = {
  clima: ['Carrier', 'Trane', 'York', 'Daikin', 'Mirage', 'Mabe', 'LG', 'Samsung',
          'Midea', 'Rheem', 'Lennox', 'Bohn', 'Copeland', 'Danfoss', 'Bitzer', 'Tecumseh'],
  mecanica: ['Nissan', 'Volkswagen', 'Chevrolet', 'Ford', 'Toyota', 'Honda', 'Mazda',
             'Mitsubishi', 'Kia', 'Hyundai', 'Suzuki', 'Renault', 'Peugeot', 'BMW',
             'Mercedes-Benz', 'Audi', 'Jeep', 'RAM', 'MG', 'Chirey', 'BYD', 'JAC'],
  seguridad: ['Hikvision', 'Dahua', 'Axis', 'Ezviz', 'Provision', 'Epcom', 'Hanwha',
              'ZKTeco', 'Suprema', 'Honeywell', 'Bosch', 'DSC', 'Ajax'],
  redes: ['MikroTik', 'Ubiquiti', 'Cisco', 'TP-Link', 'Cudy', 'Aruba', 'Fortinet',
          'Ruckus', 'Grandstream', 'Panduit', 'Belden'],
  automatizacion: ['Siemens', 'Allen-Bradley', 'Schneider', 'Mitsubishi', 'Delta',
                   'Omron', 'ABB', 'WEG', 'Danfoss', 'Festo', 'SMC'],
  lineablanca: ['Whirlpool', 'Mabe', 'Acros', 'Easy', 'LG', 'Samsung', 'Frigidaire',
                'GE', 'Koblenz', 'Daewoo', 'Hisense'],
  solar: ['Growatt', 'Fronius', 'SMA', 'Huawei', 'Enphase', 'Canadian Solar',
          'Jinko', 'Trina', 'Solis', 'Victron'],
  elevacion: ['Otis', 'Schindler', 'Kone', 'ThyssenKrupp', 'Mitsubishi', 'Hyundai'],
};


/**
 * CERTIFICACIONES — estándares CONOCER y otras credenciales verificables.
 * Este es el diferenciador de Habilis: reputación con respaldo real.
 */
export const CERTIFICACIONES = [
  { id: 'EC0506', nombre: 'Instalación y mantenimiento de sistemas de refrigeración hasta 25 TR', emisor: 'CONOCER', categorias: ['clima'] },
  { id: 'EC1390', nombre: 'Instalación y mantenimiento de climatización hasta 3 TR', emisor: 'CONOCER', categorias: ['clima'] },
  { id: 'EC1389', nombre: 'Servicio a equipos de refrigeración autocontenidos', emisor: 'CONOCER', categorias: ['clima'] },
  { id: 'EC0443', nombre: 'Aire acondicionado y refrigeración comercial', emisor: 'CONOCER', categorias: ['clima'] },
  { id: 'EC0118', nombre: 'Instalaciones eléctricas seguras en vivienda', emisor: 'CONOCER', categorias: ['electricidad'] },
  { id: 'EC1023', nombre: 'Mantenimiento de instalaciones y sistemas eléctricos', emisor: 'CONOCER', categorias: ['electricidad'] },
  { id: 'EC1157', nombre: 'Instalaciones eléctricas en la industria', emisor: 'CONOCER', categorias: ['electricidad'] },
  { id: 'EC0586.01', nombre: 'Instalación de sistemas fotovoltaicos interconectados', emisor: 'CONOCER', categorias: ['solar'] },
  { id: 'NOM-001-SEDE', nombre: 'Cumplimiento NOM-001-SEDE (instalaciones eléctricas)', emisor: 'Normativa', categorias: ['electricidad', 'solar'] },
  { id: 'FABRICANTE', nombre: 'Certificación de fabricante', emisor: 'Marca', categorias: ['clima', 'mecanica', 'seguridad', 'redes', 'automatizacion', 'elevacion'] },
];


/**
 * ═══════════════════════════════════════════════════════════════
 * HELPERS
 * ═══════════════════════════════════════════════════════════════
 */

let _flatCache = null;

/** Aplana el árbol a una lista de nodos con su ruta completa. */
export function aplanarTaxonomia() {
  if (_flatCache) return _flatCache;
  const out = [];
  for (const cat of TAXONOMIA) {
    out.push({ id: cat.id, nivel: 1, nombre: cat.nombre, ruta: cat.nombre, categoriaId: cat.id });
    for (const sub of cat.subcategorias || []) {
      out.push({
        id: sub.id, nivel: 2, nombre: sub.nombre,
        ruta: `${cat.nombre} › ${sub.nombre}`,
        categoriaId: cat.id, subcategoriaId: sub.id,
      });
      for (const esp of sub.especialidades || []) {
        out.push({
          id: esp.id, nivel: 3, nombre: esp.nombre,
          ruta: `${cat.nombre} › ${sub.nombre} › ${esp.nombre}`,
          categoriaId: cat.id, subcategoriaId: sub.id, especialidadId: esp.id,
          tipoNivel3: sub.tipoNivel3,
        });
      }
    }
  }
  _flatCache = out;
  return out;
}

/** Índice id → nodo, construido una sola vez, para lookups O(1). */
let _idIndex = null;

/** Busca un nodo por su id en cualquier nivel. */
export function buscarNodo(id) {
  if (!_idIndex) {
    _idIndex = new Map(aplanarTaxonomia().map((n) => [n.id, n]));
  }
  return _idIndex.get(id) || null;
}

/** Devuelve las especialidades disponibles para una subcategoría. */
export function especialidadesDe(subcategoriaId) {
  for (const cat of TAXONOMIA) {
    const sub = (cat.subcategorias || []).find((s) => s.id === subcategoriaId);
    if (sub) return sub.especialidades || [];
  }
  return [];
}

/** Marcas relevantes para una categoría. */
export function marcasDe(categoriaId) {
  return MARCAS[categoriaId] || [];
}

/** Certificaciones aplicables a una categoría. */
export function certificacionesDe(categoriaId) {
  return CERTIFICACIONES.filter((c) => c.categorias.includes(categoriaId));
}

/**
 * Normaliza texto para búsqueda: minúsculas, sin acentos.
 * Úsalo para generar los campos *_lower que ya tenías planeados.
 */
export function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Coincidencia por palabra completa o inicio de palabra, nunca por subcadena
// suelta — evita que "moto" haga match con "remoto" (el propio texto lo
// contiene: re-MOTO). Consultas de menos de 3 caracteres no matchean nada:
// son demasiado cortas para dar resultados útiles.
function coincide(candidatos, q) {
  if (q.length < 3) return false;
  return candidatos.some((c) => {
    const norm = normalizar(c);
    if (norm === q) return true;
    const palabras = norm.split(/[\s/()+,-]+/).filter((p) => p.length >= 3);
    return palabras.some((p) => p.startsWith(q));
  });
}

/**
 * Búsqueda difusa por texto libre. Útil para:
 *  - El buscador de la landing
 *  - El agente Verificador clasificando el registro por voz
 * Devuelve nodos ordenados por relevancia.
 */
export function buscarPorTexto(query, limite = 10) {
  const q = normalizar(query);
  if (!q) return [];
  const resultados = [];

  for (const cat of TAXONOMIA) {
    const catMatch = coincide([cat.nombre, ...(cat.keywords || [])], q);

    for (const sub of cat.subcategorias || []) {
      const subMatch = coincide([sub.nombre, ...(sub.keywords || [])], q);
      if (subMatch) {
        resultados.push({ id: sub.id, nivel: 2, nombre: sub.nombre, ruta: `${cat.nombre} › ${sub.nombre}`, score: 2 });
      }
      for (const esp of sub.especialidades || []) {
        if (coincide([esp.nombre], q)) {
          resultados.push({ id: esp.id, nivel: 3, nombre: esp.nombre, ruta: `${cat.nombre} › ${sub.nombre} › ${esp.nombre}`, score: 3 });
        }
      }
    }
    if (catMatch) {
      resultados.push({ id: cat.id, nivel: 1, nombre: cat.nombre, ruta: cat.nombre, score: 1 });
    }
  }

  return resultados.sort((a, b) => b.score - a.score).slice(0, limite);
}

/** Estadísticas del catálogo. */
export function estadisticas() {
  let subs = 0, esps = 0;
  for (const cat of TAXONOMIA) {
    subs += (cat.subcategorias || []).length;
    for (const sub of cat.subcategorias || []) esps += (sub.especialidades || []).length;
  }
  return { categorias: TAXONOMIA.length, subcategorias: subs, especialidades: esps, total: TAXONOMIA.length + subs + esps };
}

export default TAXONOMIA;
