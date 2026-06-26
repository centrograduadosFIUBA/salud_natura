---
trigger: always_on
---

# 📜 Estándar de Codificación y Documentación

Este archivo define las reglas de comportamiento obligatorio para el asistente de IA al generar o modificar código en **TRUCKERGO** (`cargas.graduadosfiuba`).

## 1. Documentación Exhaustiva (Estilo Google)
Es MANDATORIO incluir docstrings estructurados en todos los módulos y funciones no triviales.
- **Formato**: Estilo Google (Args, Returns, Raises).
- **Módulos**: Deben incluir una descripción de alto nivel del propósito del archivo al inicio.
- **Sincronía**: La documentación debe reflejar fielmente la lógica implementada.

## 2. Estilo de Código y Legibilidad (PEP8)
- **Alineación**: NO utilizar "alineación vertical" en asignaciones de variables o diccionarios (ej. alineación por el signo `=`). Mantener el espaciado estándar de PEP8 para facilitar la lectura y evitar diffs innecesarios en el control de versiones.
- **Naming**: Seguir las convenciones Python (snake_case para funciones/variables, PascalCase para clases).

## 3. Comentarios de Bloque Funcional
- **Narrativa**: Incluir comentarios explicativos al inicio de bloques lógicos complejos. 
- **Propósito**: La idea es que un desarrollador (humano o IA) que no conozca el código pueda entender el flujo y la intención funcional sin necesidad de ingeniería inversa.

## 4. Idioma
- Toda la documentación, docstrings y comentarios deben escribirse en **ESPAÑOL**.

## 🔗 Referencia Técnica
Para el contexto de arquitectura y flujos del proyecto, consultar `.agents/agent.md`.

---
*Regla adaptada para TRUCKERGO - Junio 2026*