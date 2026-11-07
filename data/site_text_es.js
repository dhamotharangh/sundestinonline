/* SunDestin Online — SPANISH site text. Same keys as data/site_text.js; anything missing here
   falls back to English. Edit freely, keep the keys. */
window.SDO_SITE_ES = {
  nav: [["Fotos", "#gallery"], ["Tarifas", "#rates"], ["Contacto", "#inquiry"]],
  nav_cta: "Ver fechas",
  signin_link: "Entrar", account_link: "Hola, {user}",
  theme_label: "Tema",
  themes: [["emerald_water", "Agua esmeralda"], ["deep_gulf", "Golfo profundo"], ["sunset_sand", "Arena al atardecer"], ["night_swim", "Baño nocturno"]],

  hero: {
    title: "Vistas impresionantes al mar",
    title2: "desde tu balcón privado",
    sub: "Tu balcón está justo sobre la piscina y la arena, así que vigilas a los niños desde tu silla. Condominio frente al mar en el 2.º piso de Sun Destin Beach Resort, Destin FL. Capacidad para 6.",
    sub_strong: "De la puerta a la arena en menos de un minuto.",
    sub2: "Despierta frente al Golfo de México color esmeralda en este cuidado condominio del 2.º piso. Desde el balcón estás tan cerca que oyes las olas y tan bajo que puedes contar las sombrillas sobre la arena blanca como el azúcar.",
    cta: "Ver fechas",
    line: ["Sin comisión de plataforma", "Reserva directa con el propietario", "El precio que ves es el que pagas"]
  },

  gallery:   { kicker: "Fotos", title: "Cada habitación, cada vista", lead: "", all_label: "Todas", see_all: "Ver las {n} fotos" },
  condo:     { kicker: "El condominio", fact_labels: { bedrooms: "Dormitorios", bathrooms: "Baños", sleeps: "Capacidad", floor: "Piso", view: "Vista", complex: "Resort", beds: "Camas", address: "Dirección" } },
  amenities: { kicker: "Comodidades", title: "Todo lo que necesita una semana de playa" },
  rates:     { kicker: "Tarifas y fechas", title_prefix: "Desde", title_suffix: "por noche",
               packages_title: "Elige una semana", packages_hint: "Toca un paquete y el calendario salta a esas fechas. Precios con limpieza, antes de impuestos.",
               nights_word: "noches", from_word: "desde",
               calendar_title: "Elige tus noches", calendar_hint: "Haz clic en la primera noche y luego en la última. También puedes arrastrar.",
               guests_label: "Adultos", children_label: "Niños",
               check_in: "Llegada", check_out: "Salida", ask_cta: "Consultar estas fechas",
               empty_hint: "Elige llegada y salida para ver un estimado.", order_hint: "La salida debe ser después de la llegada.",
               cleaning: "Limpieza", taxes: "Impuestos",
               min_hint: "Estas fechas suelen pedir un mínimo de {min} noches. Pregunta igual, el propietario puede hacer una excepción.",
               min_hard: "La estancia mínima es de {min} noches. Elige una salida posterior.",
               booked_hint: "{n} de esas noches ya están reservadas. Prueba otras fechas.",
               no_rate_hint: "Aún no hay tarifa publicada para parte de esas fechas. Pregunta al propietario.",
               estimate_hint: "Solo un estimado. El propietario confirma el precio exacto.",
               legend_free: "Disponible", legend_booked: "Reservado", legend_sel: "Tus noches",
               csv_note: "Tarifas y disponibilidad vienen de data/rates.csv y data/availability.csv.",
               preview_note: "Vista previa de un CSV cargado, solo en este navegador. " },
  location:  { kicker: "Ubicación", title: "En la playa, en pleno Destin" },
  reviews:   { kicker: "Huéspedes", title: "Lo que dicen los huéspedes",
               empty: "Las reseñas de huéspedes llegarán pronto a esta página.", empty_links: "Mientras tanto, léelas en", empty_no_links: "Pide referencias al propietario al consultar.",
               add_btn: "Escribe tu reseña", edit_btn: "Edita tu reseña", signin_hint: "Regístrate o inicia sesión para dejar una reseña.", signin_link: "Tu cuenta",
               form_title: "Tu reseña", stars_label: "Estrellas", text_label: "¿Cómo fue la estancia?", when_label: "¿Cuándo te hospedaste? (opcional)", save_btn: "Guardar reseña", cancel_btn: "Cancelar", delete_btn: "Borrar mi reseña",
               saved: "Gracias. Tu reseña ya está en la página (demo: solo en este navegador).", demo_tag: "Reseña demo", prev: "Reseñas anteriores", next: "Más reseñas" },
  inquiry:   { kicker: "Reserva directa", title: "Pide tus fechas. Ahórrate la comisión.",
               lead: "Envía las fechas y el propietario responde con un presupuesto, normalmente en un día. Pagas directamente al propietario.",
               labels: { name: "Nombre", email: "Correo", checkin: "Llegada", checkout: "Salida", guests: "Huéspedes", message: "Algo más" },
               placeholder: "Viajamos con niños, llegamos tarde, necesitamos sillas de playa…", submit: "Enviar consulta",
               sent: "Se abrirá tu aplicación de correo con la consulta lista. Si no, escribe a {email}.",
               mail_subject: "Consulta: {name} · {in} a {out}",
               mail_body: "Hola,\n\nMe gustaría hospedarme en {name}.\n\nLlegada: {in}\nSalida: {out}\nHuéspedes: {guests}\n\n{message}\n\nGracias,\n{guest}\n{guestEmail}" },
  faq:       { kicker: "Preguntas", title: "Bueno saberlo" },

  footer: {
    tagline: "Condominios frente al mar en Destin, Florida, gestionados por su propietario. Reserva directa, sin comisión.",
    links: [["Fotos", "#gallery"], ["Tarifas", "#rates"], ["Mapa", "#location"], ["Preguntas", "#faq"], ["Todas las propiedades", "properties.html"], ["Tu cuenta", "register.html"], ["Términos", "terms.html"], ["Privacidad", "privacy.html"]],
    legal_lead: "Reserva directa con el propietario. Sin comisión de plataforma:",
    legal: "cada reserva, pago, cancelación y reembolso es un acuerdo directo entre tú y el propietario. SunDestin Online es el sitio propio del propietario, no un mercado ni una agencia.",
    copyright: "SunDestin Online"
  },

  account: { kicker: "Huéspedes", title: "Tu cuenta", lead: "Regístrate una vez y tus datos quedan listos para cada consulta. Demo: se guarda solo en este navegador.",
             consent: "Solo guardamos tu nombre y correo, y solo los ve el propietario. Puedes borrar tu cuenta aquí cuando quieras.",
             signup_title: "Registrarse", signin_title: "Iniciar sesión", name: "Nombre", email: "Correo", password: "Contraseña", password_hint: "Al menos 8 caracteres",
             signup_btn: "Crear cuenta", signin_btn: "Entrar", signout_btn: "Salir", delete_btn: "Borrar mi cuenta",
             hello: "Hola, {user}", since: "Registrado el {date}", switch_in: "¿Ya tienes cuenta? Inicia sesión", switch_up: "¿Nuevo aquí? Regístrate" },

  list: { kicker: "Propiedades", title: "Condominios en la playa de Destin, gestionados por sus propietarios", lead: "Cada uno se reserva directamente con su propietario. Elige un condominio para ver fotos, tarifas y mapa.", from: "desde", per_night: "/ noche" }
};
