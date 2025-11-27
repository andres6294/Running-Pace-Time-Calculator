/* ============================
   app.js - Calculadora Running
   Comentarios en español paso a paso
   ============================ */

/* ----------------------------
   Función: actualizarDistancia
   - Copia el valor del selector al input de distancia.
   - Si el usuario elige "otra" o nada, deja la casilla editable.
   - Si elige una distancia predefinida, la pone y deshabilita la edición.
   - Llama a verificarCampos() para mantener el estado del formulario coherente.
   ---------------------------- */
function actualizarDistancia() {
    const selector = document.getElementById("selector_distancia");
    const distancia = document.getElementById("distancia");

    if (selector.value === "otra" || selector.value === "") {
        // Opción "otra" o vacío: liberar la casilla para que el usuario escriba
        distancia.value = "";
        distancia.disabled = false;
    } else {
        // Opción predefinida: fijar el valor y bloquear la edición
        distancia.value = selector.value;
        distancia.disabled = true;
    }

    // Mantener lógica de bloqueo/habilitación después del cambio
    verificarCampos();
}

/* =========================
   HELPERS - funciones pequeñas reutilizables
   ========================= */

/**
 * Convierte horas y minutos a minutos totales.
 * @param {number} h - horas
 * @param {number} m - minutos
 * @returns {number} minutos totales
 */
function minutosDesdeHorasMinutos(h, m) {
    return h * 60 + m;
}

/**
 * Convierte minutos totales a {horas, minutos} y maneja el caso
 * en que el redondeo deje 60 minutos.
 * @param {number} totalMinutos
 * @returns {{horas:number, minutos:number}}
 */
function horasYMinutosDesdeMinutos(totalMinutos) {
    const horas = Math.floor(totalMinutos / 60);
    let minutos = Math.round(totalMinutos % 60);

    // Si el redondeo produce 60 minutos, ajustamos
    if (minutos === 60) {
        return { horas: horas + 1, minutos: 0 };
    }
    return { horas, minutos };
}

/**
 * Convierte ritmo minutos + segundos a minutos decimales.
 * Ej: 5 min 30 seg -> 5.5
 */
function minutosDecimalesDesdeMinSeg(min, seg) {
    return min + (seg / 60);
}

/**
 * Formatea tiempo hh:mm con dos dígitos.
 */
function formatTiempo(h, m) {
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${hh}:${mm}`;
}

/* =========================
   VALIDACIONES
   ========================= */

/**
 * validarRitmo:
 * - Acepta ritmo vacío (cuando el usuario no lo introduce porque
 *   quiere calcularlo).
 * - Si el usuario introduce ritmo, valida:
 *   - minutos >= 0
 *   - segundos entre 0 y 59
 *   - si puso segundos pero no minutos, pide minutos también
 *   - si puso 0:00 explícitamente, devuelve error
 * Devuelve null si no hay error, o string con el mensaje de error.
 */
function validarRitmo() {
    const minRaw = document.getElementById("ritmo_min").value.trim();
    const segRaw = document.getElementById("ritmo_seg").value.trim();

    // Si ambos vacíos → no validar ritmo (es válido estar vacío)
    if (minRaw === "" && segRaw === "") return null;

    // Validar formato numérico cuando haya valor
    if (segRaw !== "" && isNaN(segRaw)) return "Los segundos del ritmo deben ser un número.";
    if (minRaw !== "" && isNaN(minRaw)) return "Los minutos del ritmo deben ser un número.";

    const min = minRaw === "" ? null : Number(minRaw);
    const seg = segRaw === "" ? null : Number(segRaw);

    // Si hay segundos pero no minutos → pedir minutos
    if (min === null && seg !== null) return "Debes ingresar los minutos del ritmo.";

    if (min !== null && min < 0) return "Los minutos del ritmo no pueden ser negativos.";
    if (seg !== null && (seg < 0 || seg >= 60)) return "Los segundos deben estar entre 0 y 59.";

    if (min === 0 && seg === 0) return "El ritmo no puede ser 0:00.";

    return null;
}

/* =========================
   Función: verificarCampos
   - Se ejecuta cada vez que el usuario escribe (oninput).
   - Cuenta qué grupos están llenos: distancia / tiempo / ritmo.
   - Si hay 2 grupos llenos → bloquea la edición del tercero (para que
 * no introduzcan 3 valores).
   - Si hay < 2 → habilita todo para permitir entradas.
   - Muestra mensajes de ayuda/validación ligera (no intrusiva).
   ========================= */
function verificarCampos() {
    const msg = document.getElementById("mensaje");
    msg.innerText = ""; // limpiar mensajes de ayuda por defecto

    // leer raw y recortar espacios
    const distanciaRaw = document.getElementById("distancia").value.trim();
    const horasRaw = document.getElementById("tiempo_horas").value.trim();
    const minutosRaw = document.getElementById("tiempo_minutos").value.trim();
    const ritmoMinRaw = document.getElementById("ritmo_min").value.trim();
    const ritmoSegRaw = document.getElementById("ritmo_seg").value.trim();

    // determinar si cada "grupo" está lleno
    const distanciaLlena = distanciaRaw !== "";
    const tiempoLleno = horasRaw !== "" || minutosRaw !== "";
    const ritmoLleno = ritmoMinRaw !== "" || ritmoSegRaw !== "";

    // contar grupos llenos
    let gruposLlenos = 0;
    if (distanciaLlena) gruposLlenos++;
    if (tiempoLleno) gruposLlenos++;
    if (ritmoLleno) gruposLlenos++;

    // referencias a inputs para habilitar/deshabilitar
    const inpDist = document.getElementById("distancia");
    const inpHoras = document.getElementById("tiempo_horas");
    const inpMin = document.getElementById("tiempo_minutos");
    const inpRMin = document.getElementById("ritmo_min");
    const inpRSeg = document.getElementById("ritmo_seg");
    const selector = document.getElementById("selector_distancia");

    // validaciones ligeras e informativas
    if (ritmoSegRaw !== "" && (isNaN(ritmoSegRaw) || Number(ritmoSegRaw) < 0 || Number(ritmoSegRaw) > 59)) {
        msg.innerText = "Los segundos del ritmo deben ser un número entre 0 y 59.";
    } else if (minutosRaw !== "" && (isNaN(minutosRaw) || Number(minutosRaw) < 0 || Number(minutosRaw) > 59)) {
        msg.innerText = "Los minutos del tiempo deben ser un número entre 0 y 59.";
    } else {
        // si no hay errores, no mostramos mensajes (o se mostrarán desde calcular())
        // msg.innerText = "";
    }

    // Lógica de bloqueo:
    // - Si hay exactamente 2 grupos llenos, bloquear el tercero (vacío).
    // - Si hay menos de 2, habilitar todo.
    if (gruposLlenos >= 2) {
        // bloquear el grupo que esté vacío
        if (!distanciaLlena) {
            inpDist.disabled = true;
            // si el selector estaba en predefinida, mantenerlo sincronizado
            selector.disabled = true;
        } else {
            inpDist.disabled = distanciaLlena && selector.value !== "otra" ? true : false;
            selector.disabled = false;
        }

        if (!tiempoLleno) {
            inpHoras.disabled = true;
            inpMin.disabled = true;
        } else {
            // tiempo ya lleno → mantener habilitados? No, los dejamos como están (se pueden seguir editando)
            inpHoras.disabled = false;
            inpMin.disabled = false;
        }

        if (!ritmoLleno) {
            inpRMin.disabled = true;
            inpRSeg.disabled = true;
        } else {
            inpRMin.disabled = false;
            inpRSeg.disabled = false;
        }
    } else {
        // menos de 2 grupos llenos => habilitar todo
        inpDist.disabled = false;
        selector.disabled = false;
        inpHoras.disabled = false;
        inpMin.disabled = false;
        inpRMin.disabled = false;
        inpRSeg.disabled = false;
    }
}

/* =========================
   Función principal: calcular()
   - Lee y valida entradas
   - Detecta qué combinación (dos campos) ingresó el usuario
   - Calcula el tercer valor y lo muestra en los inputs y en mensaje
   - Usa las funciones helper para conversiones y formato
   ========================= */
function calcular() {
    const msg = document.getElementById("mensaje");
    msg.innerText = ""; // limpiar mensajes previos

    // Validar ritmo (pero permitir ritmo vacío)
    const errorR = validarRitmo();
    if (errorR) {
        msg.innerText = errorR;
        return;
    }

    // referencias a inputs
    const inpDist = document.getElementById("distancia");
    const inpHoras = document.getElementById("tiempo_horas");
    const inpMinutos = document.getElementById("tiempo_minutos");
    const inpRMin = document.getElementById("ritmo_min");
    const inpRSeg = document.getElementById("ritmo_seg");

    // leer valores como strings y trim
    const distRaw = inpDist.value.trim();
    const horasRaw = inpHoras.value.trim();
    const minutosRaw = inpMinutos.value.trim();
    const rMinRaw = inpRMin.value.trim();
    const rSegRaw = inpRSeg.value.trim();

    // validaciones básicas de formato (segundos y minutos limites)
    if (rSegRaw !== "" && (isNaN(rSegRaw) || Number(rSegRaw) < 0 || Number(rSegRaw) > 59)) {
        msg.innerText = "Los segundos del ritmo deben ser un número entre 0 y 59.";
        return;
    }
    if (minutosRaw !== "" && (isNaN(minutosRaw) || Number(minutosRaw) < 0 || Number(minutosRaw) > 59)) {
        msg.innerText = "Los minutos del tiempo deben ser un número entre 0 y 59.";
        return;
    }

    // convertir a valores numéricos o null (si están vacíos)
    const distancia = distRaw === "" ? null : parseFloat(distRaw); // km
    const horas = horasRaw === "" ? 0 : parseInt(horasRaw, 10);
    const minutos = minutosRaw === "" ? 0 : parseInt(minutosRaw, 10);
    const tiempoMinutos = (horasRaw === "" && minutosRaw === "") ? null : minutosDesdeHorasMinutos(horas, minutos);

    const ritmoMin = rMinRaw === "" ? null : parseInt(rMinRaw, 10);
    const ritmoSeg = rSegRaw === "" ? null : parseInt(rSegRaw, 10);
    const ritmo = (ritmoMin === null && ritmoSeg === null) ? null : minutosDecimalesDesdeMinSeg(ritmoMin || 0, ritmoSeg || 0);

    // contar cuántos grupos están llenos
    let llenos = 0;
    if (distancia !== null && !Number.isNaN(distancia)) llenos++;
    if (tiempoMinutos !== null && !Number.isNaN(tiempoMinutos)) llenos++;
    if (ritmo !== null && !Number.isNaN(ritmo)) llenos++;

    // validaciones de número de grupos
    if (llenos < 2) {
        msg.innerText = "Rellena al menos dos campos (distancia, tiempo o ritmo).";
        return;
    }
    if (llenos > 2) {
        msg.innerText = "Rellena exactamente dos campos; el tercero se calculará automáticamente. Borra uno si quieres calcularlo.";
        return;
    }

    // ===== CASO A: distancia + tiempo => calcular ritmo (min:seg) =====
    if (distancia !== null && tiempoMinutos !== null && ritmo === null) {
        if (distancia <= 0) { msg.innerText = "La distancia debe ser mayor que 0."; return; }

        // ritmo en minutos decimales
        const ritmoCalc = tiempoMinutos / distancia; // minutos por km en decimal

        // separar en min y seg
        let rMinCalc = Math.floor(ritmoCalc);
        let rSegCalc = Math.round((ritmoCalc - rMinCalc) * 60);

        // ajuste si segundos redondeados llegan a 60
        if (rSegCalc === 60) {
            rSegCalc = 0;
            rMinCalc += 1;
        }

        // escribir en inputs (min y seg)
        inpRMin.value = rMinCalc;
        inpRSeg.value = rSegCalc;

        msg.innerText = `Ritmo calculado: ${rMinCalc} min ${rSegCalc < 10 ? "0" + rSegCalc : rSegCalc} seg / km`;

        // bloquear el campo que falta para evitar introducir 3 valores
        verificarCampos();
        return;
    }

    // ===== CASO B: distancia + ritmo => calcular tiempo (hh:mm) =====
    if (distancia !== null && ritmo !== null && tiempoMinutos === null) {
        if (distancia <= 0) { msg.innerText = "La distancia debe ser mayor que 0."; return; }
        if (ritmo <= 0) { msg.innerText = "El ritmo debe ser mayor que 0."; return; }

        // tiempo total en minutos = distancia * ritmo (ritmo en minutos por km)
        const tiempoTotal = distancia * ritmo;
        const hm = horasYMinutosDesdeMinutos(tiempoTotal);

        // escribir horas y minutos en inputs
        inpHoras.value = hm.horas;
        inpMinutos.value = hm.minutos;

        msg.innerText = `Tiempo calculado: ${formatTiempo(hm.horas, hm.minutos)} (hh:mm)`;

        verificarCampos();
        return;
    }

    // ===== CASO C: tiempo + ritmo => calcular distancia (km) =====
    if (tiempoMinutos !== null && ritmo !== null && distancia === null) {
        if (ritmo <= 0) { msg.innerText = "El ritmo debe ser mayor que 0."; return; }

        // distancia = tiempo total (min) / ritmo (min/km)
        const distanciaCalc = tiempoMinutos / ritmo;
        // mostrar con 2 decimales
        document.getElementById("distancia").value = distanciaCalc.toFixed(2);

        msg.innerText = `Distancia calculada: ${distanciaCalc.toFixed(2)} km`;

        verificarCampos();
        return;
    }

    // si llegamos aquí, algo no previsto ocurrió
    msg.innerText = "No se pudo calcular con los valores ingresados.";
}
function calcular() {
    const distancia = parseFloat(document.getElementById("distancia").value);
    const horas = parseInt(document.getElementById("tiempo_horas").value) || 0;
    const minutos = parseInt(document.getElementById("tiempo_minutos").value) || 0;

    const ritmoMin = parseInt(document.getElementById("ritmo_min").value) || 0;
    const ritmoSeg = parseInt(document.getElementById("ritmo_seg").value) || 0;

    const mensaje = document.getElementById("mensaje");

    // Reset del mensaje visual
    mensaje.textContent = "";

    const tiempoTotalMin = horas * 60 + minutos;
    const ritmoTotalSeg = ritmoMin * 60 + ritmoSeg;

    // ⚠️ Validaciones de ritmo imposible
    if (ritmoMin === 0 && ritmoSeg === 0 && tiempoTotalMin === 0 && distancia > 0) {
        mensaje.textContent = "❌ El ritmo no puede ser 0:00";
        return;
    }

    // -------------------------------------
    // 1. Calcular ritmo
    // -------------------------------------
    if (distancia > 0 && tiempoTotalMin > 0 && ritmoTotalSeg === 0) {
        const ritmoEnSeg = (tiempoTotalMin * 60) / distancia;
        const min = Math.floor(ritmoEnSeg / 60);
        const seg = Math.round(ritmoEnSeg % 60);

        mensaje.textContent = `🏃 Ritmo: ${min}:${seg.toString().padStart(2, "0")} min/km`;
        return;
    }

    // -------------------------------------
    // 2. Calcular tiempo
    // -------------------------------------
    if (distancia > 0 && ritmoTotalSeg > 0 && tiempoTotalMin === 0) {
        const tiempoFinalSeg = distancia * ritmoTotalSeg;
        const horasCalc = Math.floor(tiempoFinalSeg / 3600);
        const minCalc = Math.floor((tiempoFinalSeg % 3600) / 60);

        mensaje.textContent = `⏱️ Tiempo estimado: ${horasCalc}h ${minCalc}m`;
        return;
    }

    // -------------------------------------
    // 3. Calcular distancia
    // -------------------------------------
    if (ritmoTotalSeg > 0 && tiempoTotalMin > 0 && distancia === 0) {
        const totalSeg = tiempoTotalMin * 60;
        const dist = totalSeg / ritmoTotalSeg;

        mensaje.textContent = `📏 Distancia: ${dist.toFixed(2)} km`;
        return;
    }

    // Si no se cumplen condiciones suficientes
    mensaje.textContent = "Completa dos campos para calcular el tercero.";
}

/* =========================
   Función: resetear()
   - Limpia todos los campos, habilita entradas y borra mensajes.
   ========================= */
function resetear() {
    document.getElementById("selector_distancia").value = "";
    document.getElementById("distancia").value = "";
    document.getElementById("tiempo_horas").value = "";
    document.getElementById("tiempo_minutos").value = "";
    document.getElementById("ritmo_min").value = "";
    document.getElementById("ritmo_seg").value = "";

    // habilitar todos los inputs por si estaban deshabilitados
    document.getElementById("distancia").disabled = false;
    document.getElementById("selector_distancia").disabled = false;
    document.getElementById("tiempo_horas").disabled = false;
    document.getElementById("tiempo_minutos").disabled = false;
    document.getElementById("ritmo_min").disabled = false;
    document.getElementById("ritmo_seg").disabled = false;

    // borrar mensaje
    document.getElementById("mensaje").innerText = "";
}

/* =========================
   Fin del archivo
   ========================= */

/*
NOTAS de uso:
- Asegúrate en el HTML de tener oninput="verificarCampos()" en cada input para que
  la función verificarCampos() se ejecute en tiempo real mientras el usuario escribe.
- Llama a actualizarDistancia() desde el select (onchange) como ya tienes.
- El flujo esperado: el usuario rellena dos grupos → la tercera se bloquea → el usuario presiona "Calcular" → el tercero se completa automáticamente.
*/
