let hierbas = [];
const _hierbasFallback = [
  {
    nombre:"Manzanilla", lat:"Matricaria chamomilla",
    lote:"Lote I", loteDesc:"Lote I · Hierbas suaves",
    img:"/static/img/manzanilla.jpg",
    props:["Antiinflamatoria","Sedante suave","Digestiva","Antibacteriana","Antiespasmódica"],
    usos:"Alivia insomnio y nerviosismo, calma cólicos y gastritis. Aplicada en piel reduce rojeces e irritaciones. En infusión es el remedio estrella para noches inquietas y malestares digestivos.",
    nota:"La infusión debe reposar tapada 10 min para conservar sus aceites esenciales.",
    dolencias:["insomnio","nerviosismo","digestión","gastritis","cólicos","inflamación"]
  },
  {
    nombre:"Menta", lat:"Mentha × piperita",
    lote:"Lote I", loteDesc:"Lote I · Hierbas suaves",
    img:"/static/img/menta.jpg",
    props:["Digestiva","Analgésica","Refrescante","Antiespasmódica","Descongestionante"],
    usos:"Reduce náuseas, flatulencias y espasmos intestinales. El mentol actúa sobre cefaleas tensionales aplicado en sienes. Inhalada despeja vías respiratorias en resfríos.",
    nota:"Evitar en niños menores de 2 años. No usar aceite esencial puro sin diluir.",
    dolencias:["náuseas","digestión","dolor de cabeza","resfriado","gases","espasmos"]
  },
  {
    nombre:"Lavanda", lat:"Lavandula angustifolia",
    lote:"Lote I", loteDesc:"Lote I · Hierbas suaves",
    img:"/static/img/lavanda.jpg",
    props:["Ansiolítica","Sedante","Antifúngica","Cicatrizante","Analgésica"],
    usos:"Reduce ansiedad e insomnio mediante aromaterapia o infusión. Aplicada en piel acelera cicatrización de quemaduras leves y heridas. Reconocida en medicina integrativa por su acción sobre el sistema nervioso.",
    nota:"El aceite esencial de lavanda es uno de los pocos que puede aplicarse puro en pequeñas áreas.",
    dolencias:["insomnio","ansiedad","estrés","quemaduras","piel","nerviosismo"]
  },
  {
    nombre:"Romero", lat:"Salvia rosmarinus",
    lote:"Lote II", loteDesc:"Lote II · Hierbas energizantes",
    img:"/static/img/romero.jpg",
    props:["Estimulante circulatorio","Antioxidante","Antibacteriano","Hepatoprotector","Nootrópico suave"],
    usos:"Mejora la memoria y concentración estimulando el flujo cerebral. En fricciones capilar combate la alopecia androgenética. Protege el hígado y activa la secreción biliar.",
    nota:"Contraindicado en embarazo en dosis terapéuticas elevadas. No usar en epilepsia.",
    dolencias:["memoria","concentración","circulación","cansancio","hígado","cabello"]
  },
  {
    nombre:"Cúrcuma", lat:"Curcuma longa",
    lote:"Lote II", loteDesc:"Lote II · Hierbas energizantes",
    img:"/static/img/curcuma.jpg",
    props:["Antiinflamatoria potente","Antioxidante","Hepatoprotectora","Anticancerígena","Inmunomoduladora"],
    usos:"La curcumina bloquea las mismas rutas inflamatorias que antiinflamatorios de síntesis. Indicada en artritis, enfermedades autoinmunes y protección hepática. Su biodisponibilidad aumenta 20× con pimienta negra.",
    nota:"Absorción máxima combinada con pimienta negra (piperina) y grasas saludables.",
    dolencias:["inflamación","artritis","hígado","dolor","defensas"]
  },
  {
    nombre:"Jengibre", lat:"Zingiber officinale",
    lote:"Lote II", loteDesc:"Lote II · Hierbas energizantes",
    img:"/static/img/jengibre.jpg",
    props:["Antiemético","Antiinflamatorio","Termogénico","Digestivo","Circulatorio"],
    usos:"Antiemético más estudiado en náuseas del embarazo y quimioterapia. Activa la circulación periférica y reduce dolor muscular postesfuerzo. Potencia el sistema inmune en procesos infecciosos.",
    nota:"En personas con anticoagulantes, consultar al médico antes de usar en dosis altas.",
    dolencias:["náuseas","digestión","circulación","dolor muscular","resfriado","defensas"]
  },
  {
    nombre:"Eucalipto", lat:"Eucalyptus globulus",
    lote:"Lote III", loteDesc:"Lote III · Hierbas respiratorias",
    img:"/static/img/eucalipto.jpg",
    props:["Expectorante","Antiséptico","Broncodilatador","Antibacteriano","Febrífugo"],
    usos:"El 1,8-cineol (eucaliptol) fluidifica el moco y dilata bronquios. Fundamental en gripe, bronquitis y sinusitis. En vaporizaciones libera las vías aéreas en minutos.",
    nota:"No usar aceite esencial internamente. Evitar en niños menores de 6 años sin supervisión.",
    dolencias:["resfriado","tos","bronquitis","sinusitis","gripe","fiebre"]
  },
  {
    nombre:"Valeriana", lat:"Valeriana officinalis",
    lote:"Lote III", loteDesc:"Lote III · Hierbas respiratorias",
    img:"/static/img/valeriana.jpg",
    props:["Sedante","Ansiolítica","Antiespasmódica","Hipnótica","Miorelajante"],
    usos:"Reduce la latencia de sueño sin generar dependencia. Ideal para insomnio de conciliación y ansiedad moderada. En contracturas musculares actúa como relajante natural.",
    nota:"El efecto sedante se potencia con alcohol. Evitar conducir tras su consumo en dosis altas.",
    dolencias:["insomnio","ansiedad","contracturas","nerviosismo","estrés","espasmos"]
  },
  {
    nombre:"Cola de Caballo", lat:"Equisetum arvense",
    lote:"Lote III", loteDesc:"Lote III · Hierbas respiratorias",
    img:"/static/img/cola_caballo.jpg",
    props:["Diurética","Remineralizante","Cicatrizante","Antiinflamatoria","Hemostática"],
    usos:"Rica en sílice orgánico, refuerza huesos, uñas y cabello. Excelente diurético natural para retención de líquidos e infecciones urinarias. Favorece la regeneración de tejido conectivo.",
    nota:"No usar en insuficiencia renal. Tomar con abundante agua. Máximo 6 semanas continuas.",
    dolencias:["retención de líquidos","huesos","cabello","uñas","infección urinaria"]
  },
  {
    nombre:"Caléndula", lat:"Calendula officinalis",
    lote:"Lote IV", loteDesc:"Lote IV · Hierbas reparadoras",
    img:"/static/img/calendula.jpg",
    props:["Cicatrizante","Antiinflamatoria","Antifúngica","Emoliente","Antibacteriana"],
    usos:"Acelera la cicatrización de heridas, quemaduras y ulceraciones. Trata dermatitis atópica, eccemas y eritemas del pañal. En uso interno alivia gastritis y úlceras gástricas.",
    nota:"Una de las plantas más seguras. Raramente produce dermatitis de contacto en alérgicos a asteráceas.",
    dolencias:["heridas","piel","eccemas","gastritis","quemaduras","hongos"]
  },
  {
    nombre:"Tomillo", lat:"Thymus vulgaris",
    lote:"Lote IV", loteDesc:"Lote IV · Hierbas reparadoras",
    img:"/static/img/tomillo.jpg",
    props:["Antibacteriano","Expectorante","Antifúngico","Antioxidante","Antiviral"],
    usos:"El timol es uno de los antisépticos naturales más potentes. Trata tos, bronquitis y laringitis con eficacia comparable a algunos mucolíticos. Preserva alimentos por sus propiedades antimicrobianas.",
    nota:"Rico en hierro y vitamina C. En dosis terapéuticas altas puede irritar la mucosa digestiva.",
    dolencias:["tos","bronquitis","resfriado","infecciones","gripe","hongos"]
  },
  {
    nombre:"Pasiflora", lat:"Passiflora incarnata",
    lote:"Lote IV", loteDesc:"Lote IV · Hierbas reparadoras",
    img:"/static/img/pasiflora.jpg",
    props:["Sedante","Ansiolítica","Antiespasmódica","Hipnótica","Analgésica"],
    usos:"Actúa sobre los receptores GABA reduciendo ansiedad sin somnolencia excesiva. Muy eficaz en insomnio de mantenimiento (despertares nocturnos). Alivia palpitaciones de origen nervioso.",
    nota:"Compatible con valeriana para potenciar el efecto. Evitar combinación con benzodiacepinas.",
    dolencias:["insomnio","ansiedad","palpitaciones","nerviosismo","estrés","espasmos"]
  },
  {
    nombre:"Diente de León", lat:"Taraxacum officinale",
    lote:"Lote V", loteDesc:"Lote V · Hierbas depurativas",
    img:"/static/img/diente_leon.jpg",
    props:["Diurético","Depurativo","Digestivo","Hepatoprotector","Prebiótico"],
    usos:"Estimula la producción de bilis y mejora la digestión de grasas. Depurativo hepático excepcional, rico en inulina (prebiótico). Las hojas son ricas en vitaminas A, C y K.",
    nota:"El diente de león recoge contaminantes del suelo. Recolectar solo en zonas limpias.",
    dolencias:["hígado","digestión","retención de líquidos","depuración","colesterol"]
  },
  {
    nombre:"Boldo", lat:"Peumus boldus",
    lote:"Lote V", loteDesc:"Lote V · Hierbas depurativas",
    img:"/static/img/boldo.jpg",
    props:["Hepatoprotector","Colerético","Digestivo","Antioxidante","Laxante suave"],
    usos:"La boldina estimula la secreción y expulsión de bilis, indicada en cálculos biliares y hígado perezoso. Endémico de Chile y Argentina, es el hepatoprotector más usado en Latinoamérica.",
    nota:"Contraindicado en obstrucción de vías biliares. No usar más de 4 semanas seguidas.",
    dolencias:["hígado","digestión","vesícula","depuración"]
  },
  {
    nombre:"Ortiga", lat:"Urtica dioica",
    lote:"Lote V", loteDesc:"Lote V · Hierbas depurativas",
    img:"/static/img/ortiga.jpg",
    props:["Diurética","Antiinflamatoria","Remineralizante","Depurativa","Antihistamínica"],
    usos:"La cocción elimina el ácido úrico y es aliada en gota y artritis. Extraordinariamente nutritiva: hierro, calcio, magnesio, vitaminas A y C. Uso tópico en alopecia androgenética.",
    nota:"Cocida o seca pierde el poder urticante. Las semillas son adaptógenas y energizantes.",
    dolencias:["artritis","retención de líquidos","cabello","gota","alergias","depuración"]
  },
  {
    nombre:"Salvia", lat:"Salvia officinalis",
    lote:"Lote VI", loteDesc:"Lote VI · Hierbas femeninas",
    img:"/static/img/salvia.jpg",
    props:["Antisudorífica","Antimicrobiana","Estrogénica leve","Digestiva","Neuroprotectora"],
    usos:"La planta de la menopausia por excelencia: reduce sofocos y sudoración nocturna. Antiséptico oral potente en gingivitis y aftas. Estudios muestran mejora en memoria y Alzheimer leve.",
    nota:"Evitar en embarazo y lactancia por su contenido en tujona. No superar 15 g/día de hoja seca.",
    dolencias:["menopausia","sofocos","memoria","encías","sudoración","digestión"]
  },
  {
    nombre:"Anís Verde", lat:"Pimpinella anisum",
    lote:"Lote VI", loteDesc:"Lote VI · Hierbas femeninas",
    img:"/static/img/anis.jpg",
    props:["Carminativo","Espasmolítico","Expectorante","Galactagogo","Estrogénico suave"],
    usos:"Alivia gases, meteorismo y cólicos intestinales. Estimula la producción de leche materna. En afecciones respiratorias actúa como expectorante suave que facilita la eliminación del moco.",
    nota:"El aceite esencial (anetol) puede ser tóxico en dosis altas. Usar la planta en infusión es seguro.",
    dolencias:["gases","digestión","tos","lactancia","cólicos","meteorismo"]
  },
  {
    nombre:"Melisa", lat:"Melissa officinalis",
    lote:"Lote VI", loteDesc:"Lote VI · Hierbas femeninas",
    img:"/static/img/melisa.jpg",
    props:["Ansiolítica","Antiviral","Digestiva","Sedante","Antiespasmódica"],
    usos:"La planta del corazón tranquilo: combate ansiedad, taquicardias nerviosas y nerviosismo. Antiviral demostrado contra herpes labial (VHS-1). Excelente para digestión nerviosa y colon irritable.",
    nota:"Combina perfecto con valeriana para el insomnio. Las hojas frescas conservan mejor el aroma.",
    dolencias:["ansiedad","herpes","digestión","palpitaciones","nerviosismo","insomnio","estrés"]
  },
  {
    nombre:"Equinácea", lat:"Echinacea purpurea",
    lote:"Lote VII", loteDesc:"Lote VII · Hierbas del escudo",
    img:"/static/img/echinacea.jpg",
    props:["Inmunoestimulante","Antiviral","Antibacteriana","Antiinflamatoria","Cicatrizante"],
    usos:"Reduce duración e intensidad de resfríos e infecciones virales. Estimula la producción de glóbulos blancos y la actividad de macrófagos. Ideal en cambios de estación como preventivo.",
    nota:"No usar más de 8 semanas continuas. No recomendada en enfermedades autoinmunes sin supervisión.",
    dolencias:["resfriado","defensas","infecciones","gripe","heridas"]
  },
  {
    nombre:"Té Verde", lat:"Camellia sinensis",
    lote:"Lote VII", loteDesc:"Lote VII · Hierbas del escudo",
    img:"/static/img/te_verde.jpg",
    props:["Antioxidante potente","Termogénico","Cardioprotector","Neuroprotector","Anticancerígeno"],
    usos:"Las catequinas (EGCG) neutralizan radicales libres con eficacia 100× superior a la vitamina C. Protege el corazón reduciendo LDL oxidado. La L-teanina produce calma y enfoque sin excitación.",
    nota:"Contiene cafeína. Evitar en embarazo, hipertiroidismo y problemas de sueño en dosis altas.",
    dolencias:["cansancio","colesterol","memoria","adelgazar","defensas","circulación"]
  },
  {
    nombre:"Ginkgo Biloba", lat:"Ginkgo biloba",
    lote:"Lote VII", loteDesc:"Lote VII · Hierbas del escudo",
    img:"/static/img/ginkgo.jpg",
    props:["Vasodilatador","Antioxidante","Neuroprotector","Anticoagulante suave","Nootrópico"],
    usos:"Mejora la microcirculación cerebral, aliviando tinnitus y mareos. Estudios muestran mejora en memoria y deterioro cognitivo leve. El árbol más antiguo del mundo: 270 millones de años de historia medicinal.",
    nota:"Interacción con anticoagulantes (warfarina, aspirina). Consultar al médico si se toman medicamentos.",
    dolencias:["memoria","mareos","circulación","tinnitus","concentración"]
  }
];

let current = 0;
let abierto = false;

function abrirLibro(idx){
  document.getElementById('cover').classList.add('open');
  document.getElementById('pages').classList.add('visible');
  document.getElementById('navBar').classList.add('visible');
  abierto = true;
  if(idx !== undefined && idx >= 0){
    mostrarPlanta(idx);
  } else {
    mostrarIndice();
  }
}

function cerrarLibro(){
  document.getElementById('cover').classList.remove('open');
  document.getElementById('pages').classList.remove('visible');
  document.getElementById('navBar').classList.remove('visible');
  abierto = false;
}

function _ocultarVistas(){
  document.getElementById('indexView').classList.remove('visible');
  document.getElementById('fuentesView').classList.remove('visible');
  document.getElementById('plantView').classList.add('hidden');
  document.getElementById('jugoView').classList.add('hidden');
  document.getElementById('infusionView').classList.add('hidden');
  document.getElementById('btnPrev').style.display = 'none';
  document.getElementById('btnNext').style.display = 'none';
  document.getElementById('navCounter').style.display = 'none';
  document.getElementById('loteIndicator').style.display = 'none';
}

function mostrarIndice(){
  _ocultarVistas();
  document.getElementById('indexView').classList.add('visible');
  document.getElementById('btnIdx').classList.remove('visible');
  idxRenderLista(hierbas, 'Todas las plantas');
}

function mostrarFuentes(){
  _ocultarVistas();
  document.getElementById('fuentesView').classList.add('visible');
  // Recopilar todas las fuentes únicas de todas las plantas
  const set = new Set();
  hierbas.forEach(h => {
    if(!h.fuentes) return;
    h.fuentes.split(/[;\n]/).forEach(f => {
      const t = f.trim();
      if(t) set.add(t);
    });
  });
  const lista = document.getElementById('fuentesList');
  lista.innerHTML = [...set].sort().map(f => `<li>${f}</li>`).join('');
}

function cerrarFuentes(){
  mostrarPlanta(current);
}

/* ── JUGOS INLINE ── */
const JUGOS = [
  {
    nombre: 'Néctar de Lavanda y Manzana Verde',
    tag: 'Relajante nocturno',
    fotoId: 4448078,
    plantas: ['lavanda'],
    ingredientes: ['2 manzanas verdes en trozos','1 cdta. flores de lavanda comestibles','½ limón, su jugo','1 taza de agua filtrada','1 cda. miel de agave (opcional)','4–5 cubitos de hielo'],
    pasos: ['Infusiona las flores de lavanda en ¼ taza de agua caliente 3 minutos. Cuela y enfría.','Licuadora: manzana, agua restante, jugo de limón y hielo. Licúa 30 segundos.','Agrega la infusión fría y licúa 45 segundos más hasta mezcla homogénea.','Endulza con miel si deseas. Sirve de inmediato en vaso alto.'],
    beneficio: 'La lavanda activa receptores GABA induciendo calma progresiva. La manzana verde aporta quercetina y magnesio que relajan la musculatura. Ideal 30 minutos antes de acostarse.'
  },
  {
    nombre: 'Elixir de Plátano y Toronjil',
    tag: 'Antiestrés natural',
    fotoId: 12049998,
    plantas: ['melisa','toronjil','melissa'],
    ingredientes: ['2 plátanos maduros','2 cdas. hojas frescas de melisa (toronjil)','1 taza de leche de almendras','½ taza de yogur natural','¼ cdta. canela en polvo','5–6 cubitos de hielo'],
    pasos: ['Lava bien las hojas de melisa y pícalas.','Licuadora: plátanos, leche de almendras, yogur y hielo.','Añade la melisa picada y la canela.','Licúa 1–2 minutos hasta crema homogénea. Sirve de inmediato.'],
    beneficio: 'La melisa contiene ácido rosmarínico que reduce la ansiedad. El plátano aporta triptófano, precursor de la serotonina. Perfecto para momentos de alta tensión.'
  },
  {
    nombre: 'Limonada de Pasiflora',
    tag: 'Calmante del sistema nervioso',
    fotoId: 8540254,
    plantas: ['pasiflora','maracuya','maracuyá'],
    ingredientes: ['2 cdas. flores y hojas secas de pasiflora','3 limones medianos, su jugo','3 cdas. miel de abeja o agave','4 tazas de agua filtrada','Menta fresca e hielo al gusto'],
    pasos: ['Hierve 1 taza de agua, retira del fuego y añade la pasiflora. Infusiona 7 minutos tapado.','Cuela y deja enfriar completamente.','En jarra: jugo de limón, infusión fría, miel y el agua restante. Mezcla bien.','Sirve con hielo y decora con menta fresca.'],
    beneficio: 'Los flavonoides de la pasiflora interactúan con receptores GABA produciendo efecto calmante sin dependencia. El limón aporta vitamina C que reduce el cortisol circulante.'
  },
  {
    nombre: 'Jugo Verde de Menta y Espinaca',
    tag: 'Revitalizante relajante',
    fotoId: 616833,
    plantas: ['menta','hierbabuena'],
    ingredientes: ['2 tazas de espinacas frescas','½ taza de hojas de menta fresca','1 manzana verde','½ pepino','1 cdta. jengibre fresco rallado','1 taza de agua de coco','Jugo de 1 limón','Hielo al gusto'],
    pasos: ['Lava bien todos los vegetales. Pela el pepino y corta en trozos.','Corta la manzana en cuartos sin semillas.','Licuadora: espinaca, menta, manzana, pepino, jengibre e hielo.','Añade agua de coco y jugo de limón. Licúa 1–2 minutos a alta velocidad.'],
    beneficio: 'La menta actúa como relajante muscular natural. La espinaca es rica en magnesio, el mineral antiestrés. El agua de coco repone electrolitos agotados por el estrés crónico.'
  },
  {
    nombre: 'Licuado de Valeriana y Avena',
    tag: 'Inductor del sueño',
    fotoId: 29906263,
    plantas: ['valeriana'],
    ingredientes: ['1 taza de leche de almendras','⅓ taza de avena en copos','15 almendras crudas remojadas 4 h','1 cdta. raíz de valeriana seca','½ plátano maduro','¼ cdta. canela · 1 pizca de nuez moscada'],
    pasos: ['Infusión de valeriana: ½ taza agua caliente, 8 minutos tapado. Cuela y enfría.','Licuadora: avena, almendras escurridas, leche de almendras y plátano.','Añade la infusión fría, canela y nuez moscada.','Licúa 1–2 minutos hasta textura cremosa. Sirve con canela por encima.'],
    beneficio: 'La valeriana eleva los niveles de GABA produciendo sedación natural sin crear dependencia. La avena contiene melatonina y vitaminas del grupo B que regulan el sistema nervioso.'
  },
  {
    nombre: 'Batido de Cereza y Ashwagandha',
    tag: 'Adaptógeno antiestrés',
    fotoId: 7624615,
    plantas: ['ashwagandha','withania'],
    ingredientes: ['1 taza de cerezas frescas deshuesadas','½ cdta. polvo de ashwagandha','1 taza de leche de coco','¼ taza de yogur griego natural','1 cda. miel de manuka','½ cdta. extracto de vainilla','1 pizca de canela · hielo'],
    pasos: ['Lava las cerezas y retira los huesos.','Licuadora: cerezas, leche de coco y yogur.','Añade ashwagandha, miel, vainilla y canela.','Agrega el hielo y licúa 1–2 minutos. Sirve con cerezas frescas.'],
    beneficio: 'La ashwagandha reduce el cortisol y fortalece la resistencia al estrés a largo plazo. Las cerezas son fuente natural de melatonina y antocianinas con efecto antiinflamatorio.'
  },
  {
    nombre: 'Jugo de Piña y Manzanilla',
    tag: 'Digestivo antiestrés',
    fotoId: 11278007,
    plantas: ['manzanilla','camomila','camomilla'],
    ingredientes: ['2 tazas de piña fresca en cubos','2 cdas. flores de manzanilla secas','1 manzana amarilla','1 cdta. jengibre fresco rallado','Jugo de ½ limón','1 cda. miel de acacia · hielo'],
    pasos: ['Infusiona la manzanilla en 1 taza de agua caliente 5 minutos. Cuela y enfría.','Corta la manzana en trozos pequeños.','Licuadora: piña, manzana, jengibre e hielo.','Añade la infusión fría, agua fría y jugo de limón. Licúa 1 minuto.'],
    beneficio: 'La manzanilla actúa sobre el sistema nervioso entérico calmando espasmos y digestión nerviosa. La bromelina de la piña reduce la inflamación gastrointestinal asociada al estrés.'
  },
  {
    nombre: 'Agua Fresca de Pepino y Toronjil',
    tag: 'Hidratante calmante',
    fotoId: 8679633,
    plantas: [],
    ingredientes: ['1 pepino grande pelado en rodajas','½ taza de hojas frescas de melisa','Jugo de 1 limón','4 tazas de agua filtrada','Miel o stevia al gusto'],
    pasos: ['Lava el pepino y la melisa. Pela el pepino y córtalo en rodajas finas.','En jarra grande: pepino, melisa, jugo de limón y agua.','Endulza al gusto y remueve.','Refrigera mínimo 2 horas (mejor toda la noche). Sirve con hielo.'],
    beneficio: 'La melisa aporta ácido rosmarínico con acción ansiolítica suave. El pepino hidrata y refresca mientras reduce la temperatura corporal elevada por el estrés.'
  },
  {
    nombre: 'Smoothie de Cacao Puro y Lavanda',
    tag: 'Reconfortante antiestrés',
    fotoId: 6341422,
    plantas: [],
    ingredientes: ['1 taza de leche de almendras tibia','1½ cdas. cacao puro en polvo sin azúcar','1 cdta. flores de lavanda secas comestibles','1 plátano mediano congelado','1 cda. mantequilla de almendras','1 dátil medjool sin hueso · canela · sal marina'],
    pasos: ['Infusiona la lavanda en la leche tibia 5 minutos. Cuela y reserva.','Licuadora: cacao, mantequilla de almendras, dátil, canela y sal. Vierte la leche infusionada.','Añade el plátano congelado y licúa 1–2 minutos hasta textura suave.','Sirve con nibs de cacao y una flor de lavanda comestible.'],
    beneficio: 'El cacao puro contiene anandamida —la molécula de la felicidad— y magnesio que relaja el sistema nervioso. La lavanda complementa con su efecto ansiolítico para el estrés emocional.'
  },
  {
    nombre: 'Infusión Fría de Hierba Luisa y Jengibre',
    tag: 'Digestivo relajante',
    fotoId: 33789289,
    plantas: ['hierba luisa','cedron','cedrón','jengibre','verbena'],
    ingredientes: ['2 cdas. hojas secas de hierba luisa (cedrón)','1 cdta. jengibre fresco rallado','1 cda. miel de flores','Jugo de ½ lima','2 tazas de agua · hielo'],
    pasos: ['Hierve 1 taza de agua y retira del fuego.','Añade la hierba luisa y el jengibre. Infusiona tapado 6–8 minutos.','Cuela y deja enfriar. Añade el agua fría, miel y jugo de lima.','Sirve con hielo y rodajas de lima.'],
    beneficio: 'La hierba luisa calma simultáneamente el sistema nervioso y el digestivo. Especialmente eficaz cuando el estrés se manifiesta con náuseas o malestar estomacal.'
  }
];

function getJugoParaHierba(nombre){
  const n = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  return JUGOS.find(j => j.plantas && j.plantas.length && j.plantas.some(p => n.includes(p)));
}

function renderJugoInline(j){
  const img = `https://images.pexels.com/photos/${j.fotoId}/pexels-photo-${j.fotoId}.jpeg?auto=compress&cs=tinysrgb&w=400&h=180&fit=crop`;
  return `<div class="jugo-inline">
    <button class="jugo-toggle-btn" onclick="toggleJugoPanel(this)">
      <span>🍹 &nbsp;Elixir herbal &middot; ${j.tag}</span><span>▾</span>
    </button>
    <div class="jugo-panel" style="display:none">
      <img class="jugo-panel-img" src="${img}" alt="${j.nombre}" onerror="this.style.display='none'"/>
      <div class="jugo-panel-body">
        <p class="jugo-panel-tag">${j.tag}</p>
        <p class="jugo-panel-nombre">${j.nombre}</p>
        <p class="jugo-panel-ayuda">${j.beneficio}</p>
        <p class="jugo-ing-title">Ingredientes</p>
        <ul class="jugo-ing-list">${j.ingredientes.map(x=>`<li>${x}</li>`).join('')}</ul>
        <button class="jugo-prep-btn" onclick="toggleJugoPrep(this)">✦ Ver preparación paso a paso</button>
        <ol class="jugo-prep-list" style="display:none">${j.pasos.map(p=>`<li>${p}</li>`).join('')}</ol>
      </div>
    </div>
  </div>`;
}

function toggleJugoPanel(btn){
  const panel = btn.nextElementSibling;
  const open = panel.style.display === 'none';
  panel.style.display = open ? 'block' : 'none';
  btn.querySelectorAll('span')[1].textContent = open ? '▴' : '▾';
}

function toggleJugoPrep(btn){
  const list = btn.nextElementSibling;
  const open = list.style.display === 'none';
  list.style.display = open ? 'block' : 'none';
  btn.textContent = open ? '✦ Ocultar preparación' : '✦ Ver preparación paso a paso';
}

function mostrarPlanta(idx){
  document.getElementById('indexView').classList.remove('visible');
  document.getElementById('fuentesView').classList.remove('visible');
  document.getElementById('plantView').classList.remove('hidden');
  document.getElementById('btnIdx').classList.add('visible');
  document.getElementById('btnFuentes').classList.add('visible');
  document.getElementById('btnPrev').style.display = '';
  document.getElementById('btnNext').style.display = '';
  document.getElementById('navCounter').style.display = '';
  document.getElementById('loteIndicator').style.display = '';
  current = idx;
  renderHierba(idx);
}

/* ── ÍNDICE: lógica ── */
function idxInit(){
  const sel = document.getElementById('idxSelDolencia');
  const todas = [...new Set(hierbas.flatMap(h=>h.dolencias))].sort();
  todas.forEach(d=>{
    const o = document.createElement('option');
    o.value = d;
    o.textContent = d.charAt(0).toUpperCase()+d.slice(1);
    sel.appendChild(o);
  });
}

function norm(s){ return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }

function idxBuscar(){
  const raw = document.getElementById('idxSearch').value.trim();
  document.getElementById('idxSelDolencia').value = '';
  document.getElementById('idxPlantWrap').classList.remove('visible');
  if(!raw){ idxRenderLista(hierbas,'Todas las plantas'); return; }
  fetch(`/api/remedios/buscar?q=${encodeURIComponent(raw)}`)
    .then(r=>r.json())
    .then(json=>{
      if(!json.ok){ idxRenderLista([],'Sin resultados'); return; }
      const nombres = json.data.map(r=>norm(r.nombre_remedio));
      const res = hierbas.filter(h=>nombres.includes(norm(h.nombre)));
      idxRenderLista(res, res.length ? `🔍 ${res.length} resultado${res.length>1?'s':''} para "${raw}"` : `Sin resultados para "${raw}"`);
    })
    .catch(()=>{
      const q = norm(raw);
      const res = hierbas.filter(h=>norm(h.nombre).includes(q)||h.props.some(p=>norm(p).includes(q)));
      idxRenderLista(res, res.length ? `🔍 ${res.length} resultado${res.length>1?'s':''} para "${raw}"` : `Sin resultados para "${raw}"`);
    });
}

function idxSeleccionarDolencia(){
  const d = document.getElementById('idxSelDolencia').value;
  document.getElementById('idxSearch').value = '';
  const wrap = document.getElementById('idxPlantWrap');
  const selP = document.getElementById('idxSelPlanta');
  if(!d){ wrap.classList.remove('visible'); idxRenderLista(hierbas,'Todas las plantas'); return; }
  const filtradas = hierbas.filter(h=>h.dolencias.includes(d));
  selP.innerHTML = '<option value="">— Elige una planta —</option>';
  filtradas.forEach(h=>{
    const o = document.createElement('option');
    o.value = hierbas.indexOf(h);
    o.textContent = h.nombre;
    selP.appendChild(o);
  });
  wrap.classList.add('visible');
  idxRenderLista(filtradas, `Plantas para: ${d}`);
}

function idxIrAPlanta(){
  const idx = parseInt(document.getElementById('idxSelPlanta').value);
  if(isNaN(idx)) return;
  mostrarPlanta(idx);
}

function idxRenderLista(lista, label){
  document.getElementById('idxResultsLabel').textContent = label;
  const ul = document.getElementById('idxPlantList');
  const noR = document.getElementById('idxNoResults');
  if(!lista.length){ ul.innerHTML=''; noR.style.display='block'; return; }
  noR.style.display='none';
  const ordenada = [...lista].sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
  ul.innerHTML = ordenada.map(h=>{
    const idx = hierbas.indexOf(h);
    return `
      <li class="idx-plant-item" onclick="mostrarPlanta(${idx})">
        <span class="idx-plant-num">${String(idx+1).padStart(2,'0')}</span>
        <span class="idx-plant-name">${h.nombre}</span>
        <span class="idx-plant-lote">${h.lote}</span>
      </li>
      <li class="idx-plant-props">${h.props.slice(0,3).join(' · ')}</li>`;
  }).join('');
}

const INFUSIONES = [
  {
    nombre:'Infusión de Cúrcuma y Lavanda',
    tag:'Antiinflamatoria articular',
    fotoId:341514,
    plantas:['curcuma','cúrcuma','lavanda','lavandula'],
    ingredientes:['1 rodaja de cúrcuma fresca (2 cm)','1 cucharada de flores de lavanda secas','430 ml de agua filtrada','1 pizca de pimienta negra molida','1 cucharadita de miel cruda (opcional)'],
    pasos:['Pela y corta la cúrcuma en trozos pequeños','Lleva el agua a ebullición','Añade la cúrcuma y cuece a fuego lento 10 minutos','Apaga el fuego y añade las flores de lavanda','Tapa y deja reposar 5 minutos','Cuela y añade miel al gusto'],
    beneficio:'Alivia el dolor crónico de rodillas y articulaciones. La curcumina inhibe múltiples vías inflamatorias mientras la lavanda reduce la tensión muscular periarticular y potencia el efecto analgésico.'
  },
  {
    nombre:'Infusión de Jengibre y Romero',
    tag:'Recuperación muscular',
    fotoId:6962419,
    plantas:['jengibre','romero','rosmarinus'],
    ingredientes:['1 rodaja de jengibre fresco (2-3 cm)','1 cucharadita de hojas de romero secas','450 ml de agua filtrada','1 cucharadita de miel de romero (opcional)','Unas gotas de limón (opcional)'],
    pasos:['Pela y corta finamente el jengibre','Lleva el agua a ebullición','Añade el jengibre y cuece a fuego lento 5 minutos','Apaga el fuego y añade las hojas de romero','Tapa y deja reposar 7 minutos','Cuela y añade miel y limón al gusto'],
    beneficio:'Combate la inflamación muscular reduciendo citocinas proinflamatorias. El jengibre y el romero actúan en sinergia mejorando la circulación sanguínea y acelerando la recuperación tisular.'
  },
  {
    nombre:'Infusión de Harpagofito',
    tag:'Artritis y rigidez de manos',
    fotoId:6962404,
    plantas:['harpagofito','garra del diablo','harpagophytum'],
    ingredientes:['1 cucharada de raíz seca de harpagofito triturada','250 ml de agua filtrada','1 rodaja fina de limón (opcional)','1 ramita pequeña de canela (opcional)','1 cucharadita de miel de acacia (opcional)'],
    pasos:['Tritura ligeramente la raíz para aumentar la superficie de contacto','Lleva el agua a ebullición','Añade la raíz triturada y reduce el fuego','Cuece a fuego suave 10 minutos','Retira del fuego y deja reposar tapado 5 minutos','Cuela con colador fino y añade limón o miel al gusto'],
    beneficio:'Alivia la artritis y la rigidez en las articulaciones pequeñas de las manos. El harpagósido inhibe las enzimas que degradan el cartílago y reduce la inflamación sinovial de forma comparable a algunos antiinflamatorios convencionales.'
  },
  {
    nombre:'Infusión de Sauce Blanco y Menta',
    tag:'Analgésica para la espalda',
    fotoId:1417945,
    plantas:['sauce','sauce blanco','salix','menta','hierbabuena','mentha'],
    ingredientes:['1 cucharadita de corteza de sauce blanco seca','1 cucharadita de hojas de menta fresca o seca','300 ml de agua filtrada','1 cucharadita de miel de tomillo (opcional)','1 rodaja de jengibre fresco (opcional)'],
    pasos:['Lleva el agua a ebullición','Añade la corteza de sauce blanco y reduce el fuego','Hierve a fuego lento 5 minutos para extraer la salicina','Apaga el fuego y añade las hojas de menta','Tapa y deja reposar 8 minutos','Cuela y añade miel cuando la temperatura baje de 40°C'],
    beneficio:'Alivia el dolor de espalda cervical, dorsal y lumbar. La salicina del sauce actúa como aspirina natural inhibiendo prostaglandinas, mientras el mentol de la menta relaja la musculatura paravertebral y aporta efecto analgésico local.'
  },
  {
    nombre:'Infusión de Manzanilla e Hinojo',
    tag:'Digestiva antiinflamatoria',
    fotoId:8115976,
    plantas:['manzanilla','camomila','camomilla','hinojo','foeniculum'],
    ingredientes:['1 cucharada de flores de manzanilla secas','1 cucharadita de semillas de hinojo ligeramente machacadas','400 ml de agua filtrada','1 rodaja de jengibre fresco (opcional)','1 cucharadita de miel de acacia (opcional)'],
    pasos:['Machaca las semillas de hinojo en un mortero para liberar aceites esenciales','Lleva el agua a ebullición','Añade las semillas de hinojo y las flores de manzanilla','Hierve a fuego lento 7 minutos','Retira del fuego y deja reposar 3-5 minutos','Cuela bien y sirve caliente, con miel si deseas'],
    beneficio:'Alivia el colon irritable, la hinchazón y las digestiones pesadas. La manzanilla calma la mucosa intestinal irritada mientras el hinojo elimina gases y reduce los espasmos dolorosos gracias a su anetol.'
  },
  {
    nombre:'Infusión de Canela y Manzanilla',
    tag:'Alivio del dolor menstrual',
    fotoId:17125144,
    plantas:['canela','cinnamomum','manzanilla','camomila','camomilla'],
    ingredientes:['1 rama de canela (Cinnamomum verum)','1 cucharada de flores de manzanilla secas','350 ml de agua filtrada','1 rodaja fina de jengibre fresco (opcional)','1 cucharadita de miel cruda (opcional)','2-3 clavos de olor (opcional)'],
    pasos:['Parte la rama de canela en trozos pequeños','Lleva el agua a ebullición','Añade la canela y, si deseas, el jengibre y los clavos','Hierve a fuego lento 5 minutos','Retira del fuego y añade las flores de manzanilla','Tapa y deja reposar 10 minutos','Cuela y añade miel al gusto'],
    beneficio:'Reduce el dolor menstrual y la inflamación pélvica. El cinamaldehído de la canela inhibe las prostaglandinas causantes de las contracciones uterinas dolorosas, mientras la manzanilla aporta efecto calmante y antiinflamatorio general.'
  },
  {
    nombre:'Infusión de Melisa y Lavanda',
    tag:'Tensión nerviosa y contracturas',
    fotoId:18745034,
    plantas:['melisa','toronjil','melissa','lavanda','lavandula'],
    ingredientes:['1 cucharada de hojas frescas de melisa (o 2 cucharaditas si son secas)','1 cucharadita de flores de lavanda secas','400 ml de agua filtrada','1 cucharadita de miel de azahar (opcional)','1-2 flores de tila (opcional)'],
    pasos:['Calienta el agua hasta unos 90°C, justo antes del punto de ebullición','Coloca la melisa y la lavanda en una tetera','Vierte el agua caliente sobre las hierbas','Tapa inmediatamente para conservar los aceites esenciales volátiles','Deja reposar 8 minutos','Cuela y añade miel cuando la temperatura baje de 40°C'],
    beneficio:'Alivia el dolor de cabeza tensional, las contracturas cervicales y el insomnio por estrés. La melisa actúa sobre los receptores GABA reduciendo la ansiedad, mientras la lavanda relaja la musculatura y calma el sistema nervioso.'
  },
  {
    nombre:'Infusión de Ortiga y Limón',
    tag:'Recuperación post-ejercicio',
    fotoId:5275234,
    plantas:['ortiga','urtica'],
    ingredientes:['1 cucharada de hojas secas de ortiga','Zumo de ½ limón fresco','400 ml de agua filtrada','1 cucharadita de miel cruda (opcional)','1 rodaja de jengibre fresco (opcional)','1 ramita de menta fresca (opcional)'],
    pasos:['Lleva el agua a ebullición','Añade las hojas secas de ortiga','Hierve a fuego lento 10 minutos para extraer todos los principios activos','Retira del fuego y cuela','Deja enfriar hasta que esté tibia (unos 40°C)','Añade el zumo de limón recién exprimido y miel al gusto'],
    beneficio:'Acelera la recuperación muscular tras el esfuerzo físico. La ortiga aporta quercetina y minerales esenciales que reducen la inflamación, mientras el limón neutraliza el ácido láctico y aporta vitamina C para la reparación tisular.'
  },
  {
    nombre:'Infusión Dorada de Cúrcuma, Pimienta y Jengibre',
    tag:'Antiinflamatoria sistémica',
    fotoId:6962415,
    plantas:['curcuma','cúrcuma','jengibre'],
    ingredientes:['1 rodaja de cúrcuma fresca (2-3 cm) o 1 cucharadita de polvo','1 pizca generosa de pimienta negra recién molida','1 rodaja de jengibre fresco (2 cm)','430 ml de agua filtrada','1 cucharadita de aceite de oliva virgen extra (opcional)','1 cucharadita de miel cruda y 1 rodaja de limón (opcional)'],
    pasos:['Pela y corta finamente la cúrcuma y el jengibre','Lleva el agua a ebullición','Añade la cúrcuma, el jengibre y la pimienta negra','Hierve a fuego suave 10 minutos','Retira del fuego y deja reposar 5 minutos','Añade el aceite de oliva si lo usas para mejorar la absorción de curcumina','Cuela, añade miel y limón al gusto cuando esté a temperatura bebible'],
    beneficio:'Combate la inflamación crónica sistémica actuando sobre múltiples vías inflamatorias. La piperina de la pimienta negra aumenta la biodisponibilidad de la curcumina hasta un 2000%, potenciando enormemente su efecto antiinflamatorio.'
  },
  {
    nombre:'Infusión de Valeriana y Pasiflora',
    tag:'Tensión cervical y hombros',
    fotoId:7948965,
    plantas:['valeriana','pasiflora','maracuya','maracuyá','passiflora'],
    ingredientes:['1 cucharadita de raíz seca de valeriana','1 cucharadita de partes aéreas de pasiflora secas','350 ml de agua filtrada','1 cucharadita de miel (opcional)','1-2 flores de tila (opcional)'],
    pasos:['Calienta el agua hasta unos 90°C, justo antes del punto de ebullición','Añade la valeriana y la pasiflora','Tapa y deja reposar 10 minutos','Cuela la infusión con cuidado','Añade miel al gusto','Bebe caliente, preferiblemente 30 minutos antes de acostarse'],
    beneficio:'Alivia el dolor de hombros y cuello por tensión muscular acumulada. La valeriana actúa como miorelajante natural reduciendo la tensión del trapecio, mientras la pasiflora modula los receptores GABA para calmar el sistema nervioso y romper el círculo dolor-tensión-dolor.'
  }
];

function getInfusionParaHierba(nombre){
  const n = nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  return INFUSIONES.find(inf => inf.plantas && inf.plantas.length && inf.plantas.some(p => n.includes(p)));
}

function renderInfusionInline(inf){
  const img = `https://images.pexels.com/photos/${inf.fotoId}/pexels-photo-${inf.fotoId}.jpeg?auto=compress&cs=tinysrgb&w=400&h=180&fit=crop`;
  return `<div class="jugo-inline">
    <button class="jugo-toggle-btn" onclick="toggleJugoPanel(this)">
      <span>☕ &nbsp;Infusión medicinal &middot; ${inf.tag}</span><span>▾</span>
    </button>
    <div class="jugo-panel" style="display:none">
      <img class="jugo-panel-img" src="${img}" alt="${inf.nombre}" onerror="this.style.display='none'"/>
      <div class="jugo-panel-body">
        <p class="jugo-panel-tag">${inf.tag}</p>
        <p class="jugo-panel-nombre">${inf.nombre}</p>
        <p class="jugo-panel-ayuda">${inf.beneficio}</p>
        <p class="jugo-ing-title">Ingredientes</p>
        <ul class="jugo-ing-list">${inf.ingredientes.map(x=>`<li>${x}</li>`).join('')}</ul>
        <button class="jugo-prep-btn" onclick="toggleJugoPrep(this)">✦ Ver preparación paso a paso</button>
        <ol class="jugo-prep-list" style="display:none">${inf.pasos.map(p=>`<li>${p}</li>`).join('')}</ol>
      </div>
    </div>
  </div>`;
}

function initIdxInfusionesList(){
  const ul = document.getElementById('idxInfusionesList');
  if(!ul) return;
  ul.innerHTML = INFUSIONES.map((inf,i)=>`
    <li class="idx-jugos-item" onclick="seleccionarIdxInfusion(${i})">
      <span class="idx-jugos-item-nombre">☕ ${inf.nombre}</span>
      <span class="idx-jugos-item-tag">${inf.tag}</span>
    </li>`).join('');
}

function toggleIdxInfusionesList(){
  const ul = document.getElementById('idxInfusionesList');
  const open = ul.style.display === 'none';
  ul.style.display = open ? 'block' : 'none';
  document.getElementById('idxInfusionesArrow').textContent = open ? '▴' : '▾';
}

function seleccionarIdxInfusion(i){
  document.getElementById('idxInfusionesList').style.display = 'none';
  document.getElementById('idxInfusionesArrow').textContent = '▾';
  mostrarInfusion(i);
}

function mostrarInfusion(i){
  const inf = INFUSIONES[i];
  _ocultarVistas();
  document.getElementById('btnIdx').classList.add('visible');
  const img = `https://images.pexels.com/photos/${inf.fotoId}/pexels-photo-${inf.fotoId}.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop`;
  document.getElementById('infusionViewImg').src = img;
  document.getElementById('infusionViewImg').style.display = 'block';
  document.getElementById('infusionViewTag').textContent = inf.tag;
  document.getElementById('infusionViewNombre').textContent = inf.nombre;
  document.getElementById('infusionViewAyuda').textContent = inf.beneficio;
  document.getElementById('infusionViewIng').innerHTML = inf.ingredientes.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('infusionViewPasos').innerHTML = inf.pasos.map(p=>`<li>${p}</li>`).join('');
  document.getElementById('infusionView').classList.remove('hidden');
}

function initIdxJugosList(){
  const ul = document.getElementById('idxJugosList');
  if(!ul) return;
  ul.innerHTML = JUGOS.map((j,i)=>`
    <li class="idx-jugos-item" onclick="seleccionarIdxJugo(${i})">
      <span class="idx-jugos-item-nombre">🍹 ${j.nombre}</span>
      <span class="idx-jugos-item-tag">${j.tag}</span>
    </li>`).join('');
}

function toggleIdxJugosList(){
  const ul = document.getElementById('idxJugosList');
  const open = ul.style.display === 'none';
  ul.style.display = open ? 'block' : 'none';
  document.getElementById('idxJugosArrow').textContent = open ? '▴' : '▾';
}

function seleccionarIdxJugo(i){
  document.getElementById('idxJugosList').style.display = 'none';
  document.getElementById('idxJugosArrow').textContent = '▾';
  mostrarJugo(i);
}

function mostrarJugo(i){
  const j = JUGOS[i];
  _ocultarVistas();
  document.getElementById('btnIdx').classList.add('visible');
  const img = `https://images.pexels.com/photos/${j.fotoId}/pexels-photo-${j.fotoId}.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop`;
  document.getElementById('jugoViewImg').src = img;
  document.getElementById('jugoViewImg').style.display = 'block';
  document.getElementById('jugoViewTag').textContent = j.tag;
  document.getElementById('jugoViewNombre').textContent = j.nombre;
  document.getElementById('jugoViewAyuda').textContent = j.beneficio;
  document.getElementById('jugoViewIng').innerHTML = j.ingredientes.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('jugoViewPasos').innerHTML = j.pasos.map(p=>`<li>${p}</li>`).join('');
  document.getElementById('jugoView').classList.remove('hidden');
}

// Carga de plantas desde la API — se llama al iniciar la página
const LOTE_DESC = [
  'Lote I · Hierbas suaves','Lote II · Hierbas energizantes','Lote III · Hierbas respiratorias',
  'Lote IV · Hierbas de la calma','Lote V · Hierbas depurativas','Lote VI · Hierbas femeninas',
  'Lote VII · Hierbas nootrópicas','Lote VIII · Hierbas del huerto','Lote IX · Hierbas del huerto',
  'Lote X · Hierbas del huerto'
];

function normImg(nombre){
  return nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'');
}

function mapearPlanta(p, idx){
  const loteNum  = Math.floor(idx / 3);
  const loteLabel = `Lote ${['I','II','III','IV','V','VI','VII','VIII','IX','X'][loteNum] || (loteNum+1)}`;
  const props = p.propiedades ? p.propiedades.split(',').map(s=>s.trim()).filter(Boolean) : [];
  return {
    nombre: p.nombre_remedio,
    lat:    p.planta_base || '',
    lote:   loteLabel,
    loteDesc: LOTE_DESC[loteNum] || loteLabel,
    img:    p.imagen ? `/static/img/${p.imagen}` : `/static/img/planta_default.svg`,
    props:  props,
    usos:   p.dosificacion || '',
    nota:   p.contraindicaciones || '',
    dolencias: props.map(s=>s.toLowerCase()),
    link:   p.link_articulo_web || '',
    nombres_alternativos: p.nombres_alternativos || '',
    partes_utilizadas:    p.partes_utilizadas || '',
    fuentes:              p.fuentes || ''
  };
}

async function cargarPlantas(){
  try {
    const res = await fetch('/api/plantas');
    const data = await res.json();
    if(data.ok && data.plantas.length){
      hierbas = data.plantas.map((p,i) => mapearPlanta(p, i));
    }
  } catch(e) {
    console.warn('Sin servidor — usando datos locales:', e);
    hierbas = _hierbasFallback;
  }
  idxInit();
  initIdxJugosList();
  initIdxInfusionesList();
  // Re-renderizar la lista si el índice ya estaba visible con hierbas vacías
  const elIdx = document.getElementById('indexView');
  if(elIdx && elIdx.classList.contains('visible')){
    idxRenderLista(hierbas, 'Todas las plantas');
  }
  const paramH = parseInt(new URLSearchParams(window.location.search).get('h'));
  if(!isNaN(paramH) && paramH >= 0 && paramH < hierbas.length){
    setTimeout(() => abrirLibro(paramH), 50);
  }
}

cargarPlantas();

// Apagar servidor solo cuando se cierra el navegador, no en navegación interna
window.addEventListener('pagehide', function(e){
  if(!e.persisted){
    navigator.sendBeacon('/api/apagar', '{}');
  }
});

/* ── REGISTRO / LOGIN ── */
const TIENDAS = {
  ES:  { tipo:'herbolario',      gmaps:'herbolario'             },
  AR:  { tipo:'dietética',       gmaps:'dietética naturista'    },
  MX:  { tipo:'herbolaria',      gmaps:'herbolaria'             },
  CO:  { tipo:'tienda naturista',gmaps:'tienda naturista'       },
  CL:  { tipo:'herboristería',   gmaps:'herboristería'          },
  PE:  { tipo:'botica natural',  gmaps:'botica natural'         },
  US:  { tipo:'health store',    gmaps:'natural health store'   },
  OTRO:{ tipo:'tienda naturista',gmaps:'tienda naturista'       },
};
const ONLINE = {
  ES:  { nombre:'Amazon España',          url:'https://www.amazon.es/s?k={planta}+planta+medicinal'                  },
  AR:  { nombre:'Mercado Libre Argentina',url:'https://listado.mercadolibre.com.ar/{planta}-planta-medicinal'        },
  MX:  { nombre:'Mercado Libre México',   url:'https://listado.mercadolibre.com.mx/{planta}-planta-medicinal'        },
  CO:  { nombre:'Mercado Libre Colombia', url:'https://listado.mercadolibre.com.co/{planta}-planta-medicinal'        },
  CL:  { nombre:'Mercado Libre Chile',    url:'https://listado.mercadolibre.cl/{planta}-planta-medicinal'            },
  PE:  { nombre:'Mercado Libre Perú',     url:'https://listado.mercadolibre.com.pe/{planta}-planta-medicinal'        },
  US:  { nombre:'Amazon USA',             url:'https://www.amazon.com/s?k={planta}+medicinal+herb'                  },
  OTRO:{ nombre:'tienda online',          url:'https://www.google.com/search?q=comprar+{planta}+planta+medicinal'   },
};

function getUsuario(){ try{ return JSON.parse(sessionStorage.getItem('sn_usuario')); }catch(e){ return null; } }

function actualizarTopbar(){
  const u = getUsuario();
  const el = document.getElementById('topbarAuth');
  if(u){
    el.innerHTML = `<div class="topbar-user">✦ <span class="topbar-user-name">${u.nombre_completo.split(' ')[0]}</span> · <span class="topbar-user-logout" onclick="cerrarSesion()">Salir</span></div>`;
  } else {
    const backup = (() => { try{ return JSON.parse(localStorage.getItem('sn_usuario_backup')); }catch(e){ return null; } })();
    const label = backup ? '✦ Entrar' : '✦ Registrarse';
    el.innerHTML = `<button class="topbar-register" onclick="abrirModal()">${label}</button>`;
  }
}

async function actualizarZonas(){
  const u = getUsuario();
  const h = hierbas[current];
  const planta = encodeURIComponent(h.nombre.toLowerCase());

  const tTexto = document.getElementById('zonaTiendaTexto');
  const tLink  = document.getElementById('zonaTiendaLink');
  const oTexto = document.getElementById('zonaOnlineTexto');
  const oLink  = document.getElementById('zonaOnlineLink');

  if(!u){
    tTexto.innerHTML = `<strong>Tienda naturista cercana</strong><span>Regístrate para ver dónde comprar en tu zona</span>`;
    tLink.textContent = 'Registrarse'; tLink.href = '#'; tLink.target = '';
    tLink.onclick = (e)=>accionZona(e,'tienda');
    oTexto.innerHTML = `<strong>Comprar desde casa</strong><span>Regístrate para ver la mejor opción en tu país</span>`;
    oLink.textContent = 'Registrarse'; oLink.href = '#'; oLink.target = '';
    oLink.onclick = (e)=>accionZona(e,'online');
    return;
  }

  // ── Zona compra online (siempre disponible con sesión) ──
  const o    = ONLINE[u.pais_codigo || u.pais] || ONLINE.OTRO;
  const oUrl = o.url.replace('{planta}', planta);
  oTexto.innerHTML = `<strong>Comprar en ${o.nombre}</strong><span>${h.nombre} · envío a ${u.ciudad}</span>`;
  oLink.textContent = 'Ver ofertas';
  oLink.href = oUrl; oLink.target = '_blank'; oLink.onclick = null;

  // ── Zona tienda cercana ──
  const t = TIENDAS[u.pais_codigo || u.pais] || TIENDAS.OTRO;
  // Dirección completa del usuario para usar como punto A en Maps
  const dirUsuario = encodeURIComponent((u.direccion_completa ? u.direccion_completa+', ' : '') + (u.ciudad_prov_pais || u.ciudad || ''));

  // Función para generar URL de Maps con la casa del usuario marcada como punto A
  const mapsDesdeCasa = (destino) =>
    `https://www.google.com/maps/dir/${dirUsuario}/${encodeURIComponent(destino)}`;

  if(u.lat && u.lon){
    // Tenemos coordenadas → consultar API de tiendas reales
    tTexto.innerHTML = `<strong>Buscando tiendas cercanas…</strong><span>${h.nombre} en tu zona</span>`;
    tLink.textContent = '…'; tLink.href = '#'; tLink.onclick = null;

    try {
      const res = await fetch(`/api/tiendas?lat=${u.lat}&lon=${u.lon}`);
      const data = await res.json();
      const tiendas = data.tiendas || [];

      if(tiendas.length > 0){
        const primera = tiendas[0];
        // Dirección exacta de la tienda como destino → tu casa aparece marcada como A
        const destino = primera.direccion && primera.direccion !== 'Sin dirección registrada'
          ? primera.nombre + ', ' + primera.direccion
          : `${primera.lat},${primera.lon}`;
        tTexto.innerHTML = `<strong>${primera.nombre}</strong><span>${primera.direccion || u.ciudad} · ${tiendas.length} tienda${tiendas.length>1?'s':''} encontrada${tiendas.length>1?'s':''}</span>`;
        tLink.textContent = 'Cómo llegar';
        tLink.href = mapsDesdeCasa(destino); tLink.target = '_blank';
      } else {
        // Sin resultados → ruta desde tu casa buscando el tipo de tienda cercana
        tTexto.innerHTML = `<strong>${t.tipo.charAt(0).toUpperCase()+t.tipo.slice(1)} cerca de ti</strong><span>Tu casa marcada · busca en 1 km</span>`;
        tLink.textContent = 'Buscar en Maps';
        tLink.href = mapsDesdeCasa(t.gmaps+' cerca'); tLink.target = '_blank';
      }
    } catch(e){
      tTexto.innerHTML = `<strong>Tiendas cerca de ti</strong><span>Abre Google Maps desde tu casa</span>`;
      tLink.textContent = 'Abrir Maps';
      tLink.href = mapsDesdeCasa(t.gmaps); tLink.target = '_blank';
    }
  } else {
    // Sin coordenadas → geocodificar la dirección registrada automáticamente
    tTexto.innerHTML = `<strong>Tienda ${t.tipo} cerca de ti</strong><span>Localizando tu dirección…</span>`;
    tLink.textContent = '…'; tLink.href = '#'; tLink.target = ''; tLink.onclick = null;

    try {
      const res = await fetch('/api/geocodificar', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          email: u.email,
          direccion_completa: u.direccion_completa || '',
          ciudad_prov_pais: u.ciudad_prov_pais || u.ciudad || ''
        })
      });
      const data = await res.json();
      if(res.ok && data.lat){
        u.lat = data.lat; u.lon = data.lon;
        sessionStorage.setItem('sn_usuario', JSON.stringify(u));
        actualizarZonas();
      } else {
        throw new Error('sin coords');
      }
    } catch(e){
      // Fallback: desde tu dirección buscando el tipo de tienda — tu casa queda marcada
      tTexto.innerHTML = `<strong>${t.tipo.charAt(0).toUpperCase()+t.tipo.slice(1)} en ${u.ciudad}</strong><span>Tu casa como punto de partida</span>`;
      tLink.textContent = 'Buscar desde mi casa';
      tLink.href = mapsDesdeCasa(t.gmaps+' '+u.ciudad); tLink.target = '_blank';
    }
  }
}

function accionZona(e, tipo){
  e.preventDefault();
  if(!getUsuario()){ abrirModal(); }
}

function abrirModal(){
  document.getElementById('modalOverlay').classList.add('visible');
  document.getElementById('regError').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
  // Si hay cuenta guardada → abrir directo en login
  const backup = (() => { try{ return JSON.parse(localStorage.getItem('sn_usuario_backup')); }catch(e){ return null; } })();
  if(backup){
    document.getElementById('panelRegistro').style.display = 'none';
    document.getElementById('panelLogin').style.display = '';
    // Pre-rellenar el email
    const inputEmail = document.getElementById('loginEmail');
    if(inputEmail && backup.email) inputEmail.value = backup.email;
  } else {
    document.getElementById('panelRegistro').style.display = '';
    document.getElementById('panelLogin').style.display = 'none';
  }
}

function cerrarModal(){
  document.getElementById('modalOverlay').classList.remove('visible');
}

function togglePanel(){
  const r = document.getElementById('panelRegistro');
  const l = document.getElementById('panelLogin');
  r.style.display = r.style.display === 'none' ? '' : 'none';
  l.style.display = l.style.display === 'none' ? '' : 'none';
  document.getElementById('regError').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
}

async function registrar(){
  const nombre_completo    = document.getElementById('regNombreCompleto').value.trim();
  const celular            = document.getElementById('regCelular').value.trim();
  const email              = document.getElementById('regEmail').value.trim();
  const direccion_completa = document.getElementById('regDireccion').value.trim();
  const ciudad_prov_pais   = document.getElementById('regCiudadProvPais').value.trim();
  const pais_codigo        = document.getElementById('regPais').value;
  const err                = document.getElementById('regError');
  const btn                = document.querySelector('#panelRegistro .modal-btn');

  const password = document.getElementById('regPassword').value.trim();

  if(!nombre_completo || !celular || !email || !password || !ciudad_prov_pais || !pais_codigo){
    err.textContent = 'Por favor completa los campos obligatorios (*).';
    err.style.display = 'block'; return;
  }
  if(password.length < 6){
    err.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    err.style.display = 'block'; return;
  }

  btn.textContent = '✦ Guardando…'; btn.disabled = true;

  // 1. Guardar en localStorage INMEDIATAMENTE — el usuario nunca pierde su sesión
  const uLocal = {nombre_completo, celular, email, password, direccion_completa,
                  ciudad_prov_pais, pais_codigo, pais: pais_codigo,
                  ciudad: ciudad_prov_pais.split(',')[0].trim(),
                  pendiente_sync: true};
  sessionStorage.setItem('sn_usuario', JSON.stringify(uLocal));
  localStorage.setItem('sn_usuario_backup', JSON.stringify(uLocal));

  cerrarModal();
  actualizarTopbar();
  actualizarZonas();

  // 2. Intentar guardar en el servidor en segundo plano (sin bloquear al usuario)
  try {
    const res = await fetch('/api/registro', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({nombre_completo, celular, email, password, direccion_completa,
                            ciudad_prov_pais, pais_codigo})
    });
    const data = await res.json();

    if(res.status === 409){
      // Email ya en DB → hacer login automático con esos datos
      const res2 = await fetch('/api/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email})
      });
      const data2 = await res2.json();
      if(res2.ok){
        const u = {...data2.usuario, pais: data2.usuario.pais_codigo,
                   ciudad: (data2.usuario.ciudad_prov_pais||'').split(',')[0].trim()};
        sessionStorage.setItem('sn_usuario', JSON.stringify(u));
        localStorage.setItem('sn_usuario_backup', JSON.stringify(u));
        actualizarTopbar(); actualizarZonas();
      }
    } else if(res.ok){
      // Servidor respondió con lat/lon del geocoding → actualizar sesión
      const u = {...data.usuario, pais: pais_codigo,
                 ciudad: ciudad_prov_pais.split(',')[0].trim()};
      sessionStorage.setItem('sn_usuario', JSON.stringify(u));
      localStorage.setItem('sn_usuario_backup', JSON.stringify(u));
      actualizarZonas(); // refrescar con coordenadas reales
    }
  } catch(e){
    // Sin servidor: los datos ya están en localStorage, no pasa nada
  } finally {
    btn.textContent = '✦ Crear cuenta y acceder'; btn.disabled = false;
  }
}

async function login(){
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const err      = document.getElementById('loginError');
  const btn      = document.querySelector('#panelLogin .modal-btn');

  if(!email || !password){ err.style.display='block'; return; }

  btn.textContent = '✦ Accediendo…'; btn.disabled = true;

  try {
    const res  = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if(!res.ok){
      err.style.display = 'block';
    } else {
      const u = {...data.usuario,
                 pais: data.usuario.pais_codigo,
                 ciudad: (data.usuario.ciudad_prov_pais||'').split(',')[0].trim()};
      // Guardar en sesión Y en backup local (cada usuario sobreescribe su propio backup)
      sessionStorage.setItem('sn_usuario', JSON.stringify(u));
      localStorage.setItem('sn_usuario_backup', JSON.stringify(u));
      cerrarModal();
      actualizarTopbar();
      actualizarZonas();
    }
  } catch(e) {
    // Sin servidor → verificar contra copia local
    try {
      const backup = JSON.parse(localStorage.getItem('sn_usuario_backup'));
      const pwOk = !backup?.password || backup.password === password;
      if(backup && backup.email === email && pwOk){
        sessionStorage.setItem('sn_usuario', JSON.stringify(backup));
        cerrarModal(); actualizarTopbar(); actualizarZonas();
      } else { err.style.display = 'block'; }
    } catch(_){ err.style.display = 'block'; }
  } finally {
    btn.textContent = '✦ Acceder'; btn.disabled = false;
  }
}

function cerrarSesion(){
  // Guardar copia antes de borrar para poder volver a entrar
  const u = getUsuario();
  if(u) localStorage.setItem('sn_usuario_backup', JSON.stringify(u));
  sessionStorage.removeItem('sn_usuario');
  actualizarTopbar();
  actualizarZonas();
}

function imprimirFicha(){
  if(!getUsuario()){ abrirModal(); return; }
  const h = hierbas[current];
  const win = window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/>
<title>Ficha – ${h.nombre}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:12mm 14mm}
@media print{.btn-wrap{display:none!important}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
body{font-family:'EB Garamond',serif;color:rgba(232,224,208,.82);background:#0d1810;padding:20px;max-width:800px;margin:0 auto}
.btn-wrap{text-align:center;margin-bottom:14px}
.btn-print{padding:.5rem 2rem;font-family:'Cinzel',serif;font-size:.65rem;letter-spacing:2px;
  text-transform:uppercase;background:rgba(184,146,74,.2);border:1px solid #b8924a;
  border-radius:3px;cursor:pointer;color:#5a3a00}
/* CABECERA */
.cab{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #b8924a}
.logo{width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid #c8a060;flex-shrink:0}
.cab-linea{font-family:'Cinzel',serif;font-size:5.5pt;letter-spacing:3px;text-transform:uppercase;color:#d4af37}
.cab-nombre{font-family:'EB Garamond',serif;font-style:italic;font-size:20pt;color:rgba(232,224,208,.92);line-height:1.1}
.cab-lat{font-style:italic;font-size:8pt;color:rgba(58,30,0,.5);margin-top:2px}
.cab-lote{font-family:'Cinzel',serif;font-size:5.5pt;letter-spacing:3px;text-transform:uppercase;color:#b8924a;margin-top:2px}
/* CUERPO: foto izq, contenido der — igual que el grimorio */
.cuerpo{display:table;width:100%;border-collapse:separate;border-spacing:12px 0}
.col-foto{display:table-cell;width:200px;vertical-align:top}
.col-info{display:table-cell;vertical-align:top}
.foto{width:200px;height:230px;object-fit:cover;border:2px solid #c8a060;display:block}
/* SECCIONES */
h2{font-family:'Cinzel',serif;font-size:5.5pt;letter-spacing:3px;text-transform:uppercase;
  color:#d4af37;margin:8px 0 3px;padding-bottom:2px;border-bottom:1px solid rgba(184,146,74,.4)}
p.t{font-style:italic;font-size:9pt;line-height:1.6;text-align:justify;margin-bottom:4px}
.nota{margin-top:6px;padding:5px 8px;font-style:italic;font-size:8pt;
  color:rgba(58,30,0,.7);border-left:3px solid #b8924a;background:rgba(212,175,55,.07);line-height:1.5}
ul{list-style:none;padding:0;margin:0}
ul li{font-style:italic;font-size:9pt;padding:2px 0 2px 10px;position:relative;border-bottom:1px solid rgba(212,175,55,.05)}
ul li::before{content:'◆';position:absolute;left:0;color:#b8924a;font-size:4pt;top:5px}
.pie{border-top:1px solid rgba(184,146,74,.3);margin-top:12px;padding-top:5px;
  text-align:center;font-family:'Cinzel',serif;font-size:4.5pt;
  letter-spacing:2px;color:rgba(58,30,0,.3);text-transform:uppercase}
</style></head><body>
<div class="btn-wrap">
  <button class="btn-print" onclick="window.print()">🖨 Imprimir / Guardar como PDF</button>
</div>
<div class="cab">
  <img class="logo" src="${location.origin}/static/img/logo.jpg" alt="logo"/>
  <div>
    <p class="cab-linea">Salud Natura · Grimorio de Plantas Medicinales</p>
    <p class="cab-nombre">${h.nombre}</p>
    <p class="cab-lat">${h.lat}</p>
    <p class="cab-lote">${h.loteDesc}</p>
  </div>
</div>
<div class="cuerpo">
  <div class="col-foto">
    <img class="foto" src="${location.origin}${h.img}" alt="${h.nombre}"/>
  </div>
  <div class="col-info">
    <h2>Propiedades medicinales</h2>
    <ul>${h.props.map(p=>`<li>${p}</li>`).join('')}</ul>
    <h2>Usos y dosificación</h2>
    <p class="t">${h.usos}</p>
    ${h.nota ? `<div class="nota">⚕ ${h.nota}</div>` : ''}
    ${h.nombres_alternativos ? `<h2>También conocida como</h2><p class="t">${h.nombres_alternativos}</p>` : ''}
    ${h.partes_utilizadas ? `<h2>Partes utilizadas</h2><p class="t">${h.partes_utilizadas}</p>` : ''}
  </div>
</div>
<div class="pie">Salud Natura · Información con fines divulgativos · Consulte siempre a un profesional de la salud</div>
</body></html>`);
  win.document.close();
}

document.getElementById('modalOverlay').addEventListener('click', function(e){
  if(e.target === this) cerrarModal();
});

actualizarTopbar();

// Abrir modal de registro si viene desde el botón de index.html
if(sessionStorage.getItem('abrirRegistro')){
  sessionStorage.removeItem('abrirRegistro');
  setTimeout(abrirModal, 300);
}

function renderHierba(idx, dir=0){
  const h = hierbas[idx];
  const left = document.getElementById('pageLeft');
  const right = document.getElementById('pageRight');

  // Animación flip
  if(dir !== 0){
    left.classList.add('page-flip');
    right.classList.add('page-flip');
    setTimeout(()=>{left.classList.remove('page-flip');right.classList.remove('page-flip')},500);
  }

  // Lote badge
  document.getElementById('loteBadge').textContent = h.lote;
  document.getElementById('herbNum').textContent = (idx+1)+' / '+hierbas.length;

  // Foto local
  const img = document.getElementById('herbPhoto');
  img.classList.add('loading');
  img.onload = () => img.classList.remove('loading');
  img.onerror = () => img.classList.remove('loading');
  img.src = h.img;

  // Nombre
  document.getElementById('herbName').textContent = h.nombre;
  document.getElementById('herbLat').textContent = h.lat;

  // Propiedades
  const ul = document.getElementById('herbProps');
  ul.innerHTML = h.props.map(p=>`<li>${p}</li>`).join('');

  // Usos
  document.getElementById('herbUsos').textContent = h.usos;

  // Nota / contraindicaciones
  document.getElementById('herbNota').textContent = h.nota ? '⚕ ' + h.nota : '';

  // Campos extra: nombres alternativos, partes, fuentes
  const extra = document.getElementById('herbExtra');
  let extraHtml = '';
  if(h.nombres_alternativos) extraHtml += `<p class="herb-section-title">También conocida como</p><p class="herb-extra-val">${h.nombres_alternativos}</p>`;
  if(h.partes_utilizadas)    extraHtml += `<p class="herb-section-title">Partes utilizadas</p><p class="herb-extra-val">${h.partes_utilizadas}</p>`;
  extra.innerHTML = extraHtml;

  // Jugo herbal inline
  const jugo = getJugoParaHierba(h.nombre);
  document.getElementById('herbJugo').innerHTML = jugo ? renderJugoInline(jugo) : '';
  const infusion = getInfusionParaHierba(h.nombre);
  document.getElementById('herbInfusion').innerHTML = infusion ? renderInfusionInline(infusion) : '';

  // Indicador
  document.getElementById('navCounter').textContent = (idx+1)+' / '+hierbas.length;
  document.getElementById('loteIndicator').textContent = h.loteDesc;

  // Botones
  document.getElementById('btnPrev').disabled = idx === 0;
  document.getElementById('btnNext').disabled = idx === hierbas.length-1;

  // Actualizar enlace de descarga PDF
  const nombrePDF = h.nombre.toLowerCase()
    .replace(/ /g,'_').replace(/\//g,'_')
    .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i')
    .replace(/ó/g,'o').replace(/ú/g,'u').replace(/ñ/g,'n').replace(/ü/g,'u');
  const btnPDF = document.getElementById('btnDescargaPDF');
  if(btnPDF){
    btnPDF.href = `fichas_pdf/${nombrePDF}.pdf`;
    btnPDF.download = `${h.nombre}.pdf`;
  }

  actualizarZonas();
}

function cambiarHierba(dir){
  const next = current + dir;
  if(next < 0 || next >= hierbas.length) return;
  current = next;
  renderHierba(current, dir);
}

// Teclas de dirección
document.addEventListener('keydown', e=>{
  if(!abierto) return;
  if(e.key==='ArrowRight') cambiarHierba(1);
  if(e.key==='ArrowLeft') cambiarHierba(-1);
});
</script>
